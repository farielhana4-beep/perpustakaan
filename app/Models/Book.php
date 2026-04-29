<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'stock',
        'cover',
        'image',
        'category_id',
    ];

    protected $appends = [
        'image_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            $path = $this->image ?: $this->cover;

            return $path ? Storage::disk('public')->url($path) : null;
        });
    }
}
