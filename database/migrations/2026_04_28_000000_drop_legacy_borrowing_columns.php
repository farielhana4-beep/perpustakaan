<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('borrowings', function (Blueprint $table) {
            if (Schema::hasColumn('borrowings', 'borrow_date')) {
                $table->dropColumn('borrow_date');
            }

            if (Schema::hasColumn('borrowings', 'return_date')) {
                $table->dropColumn('return_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('borrowings', function (Blueprint $table) {
            if (! Schema::hasColumn('borrowings', 'borrow_date')) {
                $table->dateTime('borrow_date')->nullable()->after('book_id');
            }

            if (! Schema::hasColumn('borrowings', 'return_date')) {
                $table->dateTime('return_date')->nullable()->after('borrow_date');
            }
        });
    }
};
