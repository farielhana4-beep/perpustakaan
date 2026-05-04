@extends('emails.layout', ['subject' => 'Overdue Book Reminder'])

@section('content')
    <div style="font-size:16px;line-height:1.8;color:#334155;">
        <p style="margin:0 0 18px;">Hello {{ $member }}, your borrowed book is overdue.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
            <tr>
                <td style="width:160px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Book</td>
                <td style="font-weight:700;color:#0f172a;">{{ $book }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Due Date</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($due)->format('F j, Y g:i A') }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Days Overdue</td>
                <td style="font-weight:700;color:#b45309;">{{ $daysOverdue }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Current Fine</td>
                <td style="font-weight:700;color:#b91c1c;">{{ $currency }} {{ number_format($fine, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div style="margin-top:24px;border-radius:18px;background:#fff7ed;padding:18px 20px;border:1px solid #fdba74;">
            <strong style="display:block;margin-bottom:6px;color:#9a3412;">Action required</strong>
            <span style="font-size:14px;color:#7c2d12;">Please return the item as soon as possible to stop the fine from increasing.</span>
        </div>
    </div>
@endsection
