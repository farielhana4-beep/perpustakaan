<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('borrowings', 'fine')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->integer('fine')->default(0)->after('status');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('borrowings', 'fine')) {
            Schema::table('borrowings', function (Blueprint $table) {
                $table->dropColumn('fine');
            });
        }
    }
};
