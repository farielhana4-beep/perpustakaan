<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject ?? config('app.name') }}</title>
</head>
<body style="margin:0;background:#eef2ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(180deg,#e0f2fe 0%,#eef2ff 36%,#f8fafc 100%);padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,.12);">
                    <tr>
                        <td style="padding:0;">
                            <div style="background:linear-gradient(135deg,#0f766e 0%,#0284c7 100%);padding:28px 32px;color:#ffffff;">
                                <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;opacity:.85;">Library System</div>
                                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;">{{ $subject ?? 'Notification' }}</h1>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px 32px;">
                            <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:12px;line-height:1.7;color:#64748b;">
                                You are receiving this email from {{ config('app.name') }}.
                                If you did not expect this message, you can safely ignore it.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
