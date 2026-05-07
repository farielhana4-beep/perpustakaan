<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    protected $fillable = [
        'library_name',
        'library_logo',
        'library_favicon',
        'default_locale',
        'fine_per_day',
        'max_borrow_days',
        'currency',
        'max_books_per_user',
    ];

    protected $appends = [
        'library_logo_url',
        'library_favicon_url',
    ];

    protected function casts(): array
    {
        return [
            'fine_per_day' => 'integer',
            'max_borrow_days' => 'integer',
            'max_books_per_user' => 'integer',
        ];
    }

    public static function defaults(): array
    {
        $defaults = [
            'library_name' => config('app.name'),
            'library_logo' => null,
            'library_favicon' => null,
            'default_locale' => config('app.locale'),
            'fine_per_day' => 1000,
            'max_borrow_days' => 7,
            'currency' => 'IDR',
            'max_books_per_user' => 3,
        ];

        if (! Schema::hasTable('settings')) {
            return $defaults;
        }

        $columns = Schema::getColumnListing('settings');

        return array_filter(
            $defaults,
            static fn ($value, string $key): bool => in_array($key, $columns, true),
            ARRAY_FILTER_USE_BOTH
        );
    }

    public static function current(): self
    {
        if (! Schema::hasTable('settings')) {
            return new static(static::defaults());
        }

        return static::query()->firstOrCreate([], static::defaults());
    }

    public function getLibraryLogoUrlAttribute(): ?string
    {
        return $this->library_logo ? Storage::disk('public')->url($this->library_logo) : null;
    }

    public function getLibraryFaviconUrlAttribute(): ?string
    {
        return $this->library_favicon ? Storage::disk('public')->url($this->library_favicon) : null;
    }
}
