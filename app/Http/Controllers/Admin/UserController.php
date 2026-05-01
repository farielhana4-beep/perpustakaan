<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->select(['id', 'name', 'email', 'role', 'created_at']);

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->string('role')->toString());
        }

        $sort = $request->string('sort')->toString() ?: 'latest';

        if ($sort === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->all(),
            'roles' => [
                ['value' => '', 'label' => 'All Roles'],
                ['value' => 'super_admin', 'label' => 'Super Admin'],
                ['value' => 'pustakawan', 'label' => 'Pustakawan'],
                ['value' => 'member', 'label' => 'Member'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'in:super_admin,pustakawan,member'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'in:super_admin,pustakawan,member'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User updated');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted');
    }
}
