@extends('emails.layout', ['subject' => 'Buku Dipinjam'])

@section('content')
    <div style="font-size:16px;line-height:1.8;color:#334155;">
        <p style="margin:0 0 18px;">Halo {{ $member }}, peminjaman Anda telah berhasil dicatat.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
            <tr>
                <td style="width:160px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Buku</td>
                <td style="font-weight:700;color:#0f172a;">{{ $book }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Jumlah</td>
                <td style="font-weight:700;color:#0f172a;">{{ $quantity }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Dipinjam Pada</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($borrowedAt)->format('F j, Y g:i A') }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Jatuh Tempo</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($due)->format('F j, Y g:i A') }}</td>
            </tr>
        </table>

        <div style="margin-top:24px;border-radius:18px;background:#f8fafc;padding:18px 20px;border:1px solid #e2e8f0;">
            <strong style="display:block;margin-bottom:6px;color:#0f172a;">Langkah berikutnya</strong>
            <span style="font-size:14px;color:#475569;">Harap kembalikan buku pada atau sebelum tanggal jatuh tempo untuk menghindari denda.</span>
        </div>
    </div>
@endsection
