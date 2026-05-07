<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @php($branding = \App\Models\Setting::current())
    <title>{{ $branding->library_name ?? config('app.name') }}</title>

    @if($branding->library_favicon_url)
        <link rel="icon" type="image/png" href="{{ $branding->library_favicon_url }}">
    @endif

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    @inertiaHead
</head>
<body>
    <div id="app">
        @inertia
    </div>
</body>
</html>
