<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('borrowings', 'quantity')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->integer('quantity')->default(1)->after('book_id');
            });
        }

        if (! Schema::hasColumn('books', 'image')) {
            Schema::table('books', function (Blueprint $table) {
                $table->string('image')->nullable()->after('cover');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('books', 'image')) {
            Schema::table('books', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }

        if (Schema::hasColumn('borrowings', 'quantity')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->dropColumn('quantity');
            });
        }
    }
};
