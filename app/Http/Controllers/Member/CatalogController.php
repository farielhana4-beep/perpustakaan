<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category')->orderBy('title');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->integer('category')) {
            $query->where('category_id', $categoryId);
        }

        return Inertia::render('Member/Catalog/Index', [
            'books' => $query->get(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search ?? '',
                'category' => $categoryId ?: '',
            ],
        ]);
    }

    public function show(Book $book)
    {
        $book->load('category');

        return Inertia::render('Member/Catalog/Show', [
            'book' => $book,
        ]);
    }
}
