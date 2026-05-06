@extends('emails.layout', ['subject' => 'Buku Dikembalikan'])

@section('content')
    <div style="font-size:16px;line-height:1.8;color:#334155;">
        <p style="margin:0 0 18px;">Halo {{ $member }}, kami telah menerima permintaan pengembalian Anda.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
            <tr>
                <td style="width:160px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Buku</td>
                <td style="font-weight:700;color:#0f172a;">{{ $book }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Dikembalikan Pada</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($returnedAt)->format('F j, Y g:i A') }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Sisa</td>
                <td style="font-weight:700;color:#0f172a;">{{ $remaining }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Denda</td>
                <td style="font-weight:700;color:#0f172a;">Rp {{ number_format($fine, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div style="margin-top:24px;border-radius:18px;background:#ecfeff;padding:18px 20px;border:1px solid #a5f3fc;">
            <strong style="display:block;margin-bottom:6px;color:#0f172a;">Status</strong>
            <span style="font-size:14px;color:#475569;">
                {{ $remaining > 0 ? 'Pengembalian sebagian telah dicatat. Anda masih memiliki item untuk dikembalikan.' : 'Peminjaman ini sekarang sudah ditutup.' }}
            </span>
        </div>
    </div>
@endsection
