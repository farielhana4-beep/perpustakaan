<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageStorage
{
    public static function replace(?string $existingPath, UploadedFile $file, string $directory, int $maxSize = 512): string
    {
        if ($existingPath) {
            Storage::disk('public')->delete($existingPath);
        }

        return self::store($file, $directory, $maxSize);
    }

    public static function store(UploadedFile $file, string $directory, int $maxSize = 512): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'png');
        $fileName = Str::uuid()->toString() . '.' . $extension;
        $path = trim($directory, '/') . '/' . $fileName;

        if (in_array($extension, ['svg', 'ico'], true)) {
            Storage::disk('public')->putFileAs($directory, $file, $fileName);

            return $path;
        }

        $sourcePath = $file->getRealPath();

        if (! $sourcePath) {
            Storage::disk('public')->putFileAs($directory, $file, $fileName);

            return $path;
        }

        $image = match ($extension) {
            'jpg', 'jpeg' => function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($sourcePath) : false,
            'png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($sourcePath) : false,
            'webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($sourcePath) : false,
            default => false,
        };

        if (! $image) {
            Storage::disk('public')->putFileAs($directory, $file, $fileName);

            return $path;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $target = $image;

        if ($width > $maxSize || $height > $maxSize) {
            $ratio = min($maxSize / max(1, $width), $maxSize / max(1, $height));
            $newWidth = (int) max(1, round($width * $ratio));
            $newHeight = (int) max(1, round($height * $ratio));
            $target = imagecreatetruecolor($newWidth, $newHeight);

            if (in_array($extension, ['png', 'webp'], true)) {
                imagealphablending($target, false);
                imagesavealpha($target, true);
                $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);
                imagefill($target, 0, 0, $transparent);
            }

            imagecopyresampled($target, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        }

        ob_start();

        $written = match ($extension) {
            'jpg', 'jpeg' => imagejpeg($target, null, 90),
            'png' => imagepng($target, null, 8),
            'webp' => function_exists('imagewebp') ? imagewebp($target, null, 88) : false,
            default => false,
        };

        $binary = ob_get_clean() ?: '';

        if (! $written || $binary === '') {
            Storage::disk('public')->putFileAs($directory, $file, $fileName);

            if ($target !== $image) {
                imagedestroy($target);
            }

            imagedestroy($image);

            return $path;
        }

        Storage::disk('public')->put($path, $binary);

        if ($target !== $image) {
            imagedestroy($target);
        }

        imagedestroy($image);

        return $path;
    }
}
