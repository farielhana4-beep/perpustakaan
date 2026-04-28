<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $fiction = Category::updateOrCreate(
            ['slug' => 'fiction'],
            ['name' => 'Fiction', 'description' => 'Fiction titles']
        );

        $science = Category::updateOrCreate(
            ['slug' => 'science'],
            ['name' => 'Science', 'description' => 'Science titles']
        );

        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'role' => 'super_admin',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'librarian@example.com'],
            [
                'name' => 'Pustakawan',
                'role' => 'pustakawan',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'member@example.com'],
            [
                'name' => 'Member User',
                'role' => 'member',
                'password' => Hash::make('password'),
            ]
        );

        Book::updateOrCreate(
            ['isbn' => '978000000001'],
            [
                'title' => 'The Library Story',
                'author' => 'Admin Writer',
                'category_id' => $fiction->id,
                'stock' => 5,
            ]
        );

        Book::updateOrCreate(
            ['isbn' => '978000000002'],
            [
                'title' => 'Science Basics',
                'author' => 'Science Author',
                'category_id' => $science->id,
                'stock' => 3,
            ]
        );
    }
}
