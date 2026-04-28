<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    protected $fillable = [
        'fine_per_day',
        'max_borrow_days',
        'currency',
        'max_books_per_user',
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
        return [
            'fine_per_day' => 1000,
            'max_borrow_days' => 7,
            'currency' => 'IDR',
            'max_books_per_user' => 3,
        ];
    }

    public static function current(): self
    {
        if (! Schema::hasTable('settings')) {
            return new static(static::defaults());
        }

        return static::query()->firstOrCreate([], static::defaults());
    }
}
