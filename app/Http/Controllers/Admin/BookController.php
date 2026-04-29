<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookRequest;
use App\Models\Category;
use App\Models\Book;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Books/Index', [
            'books' => Book::with('category')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Books/Create', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(BookRequest $request)
    {
        $data = $request->validated();
        $data['image'] = $this->storeImage($request->file('image'));

        Book::create($data);

        return redirect()->route('admin.books.index')->with('success', 'Book saved');
    }

    public function edit(Book $book)
    {
        return Inertia::render('Admin/Books/Edit', [
            'book' => $book,
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(BookRequest $request, Book $book)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $newImage = $this->storeImage($request->file('image'));

            if ($newImage) {
                $this->deleteImage($book->image);
                $data['image'] = $newImage;
            }
        } else {
            unset($data['image']);
        }

        $book->update($data);

        return redirect()->route('admin.books.index')->with('success', 'Book saved');
    }

    public function destroy(Book $book)
    {
        $this->deleteImage($book->image);
        $book->delete();

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Book deleted successfully.');
    }

    private function storeImage(?UploadedFile $image): ?string
    {
        if (! $image) {
            return null;
        }

        return Storage::disk('public')->putFile('books', $image);
    }

    private function deleteImage(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
