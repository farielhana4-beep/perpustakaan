@extends('emails.layout', ['subject' => 'Pengingat Buku Terlambat'])

@section('content')
    <div style="font-size:16px;line-height:1.8;color:#334155;">
        <p style="margin:0 0 18px;">Halo {{ $member }}, buku yang Anda pinjam sudah terlambat.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
            <tr>
                <td style="width:160px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Buku</td>
                <td style="font-weight:700;color:#0f172a;">{{ $book }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Jatuh Tempo</td>
                <td style="font-weight:700;color:#0f172a;">{{ optional($due)->format('F j, Y g:i A') }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Hari Terlambat</td>
                <td style="font-weight:700;color:#b45309;">{{ $daysOverdue }}</td>
            </tr>
            <tr>
                <td style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">Denda Saat Ini</td>
                <td style="font-weight:700;color:#b91c1c;">{{ $currency }} {{ number_format($fine, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div style="margin-top:24px;border-radius:18px;background:#fff7ed;padding:18px 20px;border:1px solid #fdba74;">
            <strong style="display:block;margin-bottom:6px;color:#9a3412;">Tindakan diperlukan</strong>
            <span style="font-size:14px;color:#7c2d12;">Mohon kembalikan item sesegera mungkin agar denda tidak bertambah.</span>
        </div>
    </div>
@endsection
