<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('borrowings', 'borrowed_at')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->dateTime('borrowed_at')->nullable()->after('book_id');
            });
        }

        if (! Schema::hasColumn('borrowings', 'due_date')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->dateTime('due_date')->nullable()->after('borrowed_at');
            });
        }

        if (! Schema::hasColumn('borrowings', 'returned_at')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->dateTime('returned_at')->nullable()->after('due_date');
            });
        }

        if (Schema::hasColumn('borrowings', 'borrow_date')) {
            $rows = DB::table('borrowings')->get();

            foreach ($rows as $row) {
                $borrowedAt = $row->borrowed_at ?? $row->borrow_date ?? null;
                $returnedAt = $row->returned_at ?? $row->return_date ?? null;

                DB::table('borrowings')
                    ->where('id', $row->id)
                    ->update([
                        'borrowed_at' => $borrowedAt,
                        'due_date' => $borrowedAt
                            ? Carbon::parse($borrowedAt)->addDays(7)->toDateTimeString()
                            : now()->addDays(7)->toDateTimeString(),
                        'returned_at' => $returnedAt,
                    ]);
            }
        }
    }

    public function down(): void
    {
        //
    }
};
