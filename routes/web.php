<?php

use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BorrowingController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\Member\CatalogController;
use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\HistoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::post('/locale', function (Request $request) {
    $locale = $request->locale;
    $supportedLocales = config('app.supported_locales', ['id', 'en']);

    if (! in_array($locale, $supportedLocales, true)) {
        abort(400);
    }

    session(['locale' => $locale]);

    return back();
})->name('locale');

Route::post('/change-language', function (Request $request) {
    $locale = $request->locale;
    $supportedLocales = config('app.supported_locales', ['id', 'en']);

    if (! in_array($locale, $supportedLocales, true)) {
        abort(400);
    }

    session(['locale' => $locale]);

    return back();
})->name('change.language');

/*
|--------------------------------------------------------------------------
| AUTH (GUEST)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('/reset-password', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::get('/search/global', GlobalSearchController::class)
    ->middleware('auth')
    ->name('search.global');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'password'])->name('profile.password');
    Route::post('/profile/avatar', [ProfileController::class, 'avatar'])->name('profile.avatar');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | ROLE REDIRECT
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', function () {
        return match (auth()->user()->role) {
            'super_admin', 'pustakawan' => redirect()->route('admin.dashboard'),
            default => redirect()->route('member.dashboard'),
        };
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:super_admin,pustakawan')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

            // Books (clean resource)
            Route::resource('books', BookController::class)->except(['show']);

            // Categories
            Route::resource('categories', CategoryController::class)->except(['show']);

            Route::get('/exports', ExportController::class)->name('exports');

            // Users (ONLY super_admin)
            Route::middleware('role:super_admin')->group(function () {
                Route::resource('users', UserController::class)->except(['show']);
                Route::middleware('can:manage-branding')->group(function () {
                    Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
                    Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
                });
            });

            // Borrowings / Circulation
            Route::get('/circulation', [BorrowingController::class, 'index'])->name('borrowings.index');
            Route::post('/borrowings', [BorrowingController::class, 'store'])->name('borrowings.store');
            Route::post('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnBook'])->name('borrowings.return');
            Route::post('/borrowings/{borrowing}/return-all', [BorrowingController::class, 'returnAll'])->name('borrowings.return-all');
            Route::post('/borrowings/{borrowing}/lost', [BorrowingController::class, 'markLost'])->name('borrowings.lost');
        });

    /*
    |--------------------------------------------------------------------------
    | MEMBER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::prefix('member')
        ->name('member.')
        ->middleware('role:member')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', MemberDashboardController::class)->name('dashboard');

            // Catalog
            Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
            Route::get('/catalog/{book}', [CatalogController::class, 'show'])->name('catalog.show');

            // Borrow (consistent naming)
            Route::post('/borrowings', [BorrowingController::class, 'store'])->name('borrowings.store');
            Route::post('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnBook'])->name('borrowings.return');
            Route::post('/borrowings/{borrowing}/return-all', [BorrowingController::class, 'returnAll'])->name('borrowings.return-all');

            // History
            Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
        });
});
