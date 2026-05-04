@extends('emails.layout', ['subject' => 'Book Returned'])

@section('content')
    <div style="font-size:16px;line-height:1.8;color:#334155;">
        <p style="margin:0 0 18px;">Hello {{ $member }}, we have received your return request.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
            <tr>
                <td style="width:160px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Book</td>
                <td style="font-weight:700;color:#0f172a;">{{ $book }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Returned At</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($returnedAt)->format('F j, Y g:i A') }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Remaining</td>
                <td style="font-weight:700;color:#0f172a;">{{ $remaining }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Fine</td>
                <td style="font-weight:700;color:#0f172a;">Rp {{ number_format($fine, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div style="margin-top:24px;border-radius:18px;background:#ecfeff;padding:18px 20px;border:1px solid #a5f3fc;">
            <strong style="display:block;margin-bottom:6px;color:#0f172a;">Status</strong>
            <span style="font-size:14px;color:#475569;">
                {{ $remaining > 0 ? 'Partial return recorded. You still have items to return.' : 'This borrowing is now closed.' }}
            </span>
        </div>
    </div>
@endsection
