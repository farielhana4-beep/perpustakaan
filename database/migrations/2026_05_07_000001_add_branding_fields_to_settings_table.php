<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table): void {
            if (! Schema::hasColumn('settings', 'library_name')) {
                $table->string('library_name')->default(config('app.name'))->after('id');
            }

            if (! Schema::hasColumn('settings', 'library_logo')) {
                $table->string('library_logo')->nullable()->after('library_name');
            }

            if (! Schema::hasColumn('settings', 'library_favicon')) {
                $table->string('library_favicon')->nullable()->after('library_logo');
            }

            if (! Schema::hasColumn('settings', 'default_locale')) {
                $table->string('default_locale', 10)->default(config('app.locale'))->after('library_favicon');
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table): void {
            foreach (['library_name', 'library_logo', 'library_favicon', 'default_locale'] as $column) {
                if (Schema::hasColumn('settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
