<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
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
        'is_low_stock',
    ];

    public const LOW_STOCK_THRESHOLD = 5;

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

    protected function isLowStock(): Attribute
    {
        return Attribute::get(fn (): bool => (int) $this->stock < self::LOW_STOCK_THRESHOLD);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->where('stock', '<', self::LOW_STOCK_THRESHOLD);
    }
}
