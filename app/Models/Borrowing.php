<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Borrowing extends Model
{
    public const STATUS_BORROWED = 'borrowed';
    public const STATUS_RETURNED = 'returned';
    public const STATUS_OVERDUE = 'overdue';
    public const STATUS_LOST = 'lost';

    protected $fillable = [
        'user_id',
        'book_id',
        'borrowed_at',
        'due_date',
        'returned_at',
        'status',
        'fine',
    ];

    protected function casts(): array
    {
        return [
            'borrowed_at' => 'datetime',
            'due_date' => 'datetime',
            'returned_at' => 'datetime',
            'fine' => 'integer',
        ];
    }

    protected $appends = [
        'fine_amount',
        'is_overdue',
    ];

    public static function syncOverdueStatuses(): int
    {
        return static::query()
            ->where('status', self::STATUS_BORROWED)
            ->whereNull('returned_at')
            ->where('due_date', '<', now())
            ->update(['status' => self::STATUS_OVERDUE]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    protected function fineAmount(): Attribute
    {
        return Attribute::get(function (): int {
            if (filled($this->fine)) {
                return (int) $this->fine;
            }

            $settings = Setting::current();
            $reference = $this->returned_at ?? now();
            $dueDate = $this->due_date?->copy()->startOfDay();
            $referenceDay = $reference->copy()->startOfDay();

            if (! $dueDate || $referenceDay->lte($dueDate)) {
                return 0;
            }

            return $dueDate->diffInDays($referenceDay) * (int) $settings->fine_per_day;
        });
    }

    protected function isOverdue(): Attribute
    {
        return Attribute::get(function (): bool {
            $dueDate = $this->due_date;
            $reference = $this->returned_at ?? now();

            return $dueDate
                ? in_array($this->status, [self::STATUS_BORROWED, self::STATUS_OVERDUE], true) && $reference->gt($dueDate)
                : false;
        });
    }

    public function scopeForStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_BORROWED, self::STATUS_OVERDUE]);
    }

    public function calculateFine(?Carbon $at = null): int
    {
        $settings = Setting::current();
        $reference = ($at ?? now())->copy()->startOfDay();
        $dueDate = $this->due_date?->copy()->startOfDay();

        if (! $dueDate || $reference->lte($dueDate)) {
            return 0;
        }

        return $dueDate->diffInDays($reference) * (int) $settings->fine_per_day;
    }
}
