<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
      padding: 24px;
      margin: 0;
    }

    .card {
      background: #ffffff;
      max-width: 520px;
      margin: 0 auto;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.22);
    }

    .header {
      background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
      color: #ffffff;
      padding: 28px 24px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.2;
    }

    .content {
      padding: 28px 24px 32px;
    }

    .text {
      margin: 0 0 14px;
      color: #334155;
      line-height: 1.7;
      text-align: center;
      font-size: 15px;
    }

    .otp {
      margin: 18px auto 20px;
      padding: 16px 20px;
      border-radius: 14px;
      background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
      color: #0284c7;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      text-align: center;
      border: 1px solid #bae6fd;
    }

    .note {
      margin: 0;
      color: #475569;
      line-height: 1.7;
      text-align: center;
      font-size: 14px;
    }

    .footer {
      padding: 18px 24px 28px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      @if(($branding->library_logo_url ?? null))
        <img src="{{ $branding->library_logo_url }}" alt="{{ $branding->library_name ?? __('messages.common.library_system') }}" style="height:40px; width:auto; object-fit:contain; margin:0 auto 10px; display:block;">
      @endif
      <h1>{{ $branding->library_name ?? __('messages.common.library_system') }}</h1>
    </div>

    <div class="content">
      <p class="text">{{ __('messages.auth.otp_mail_body') }}</p>
      <div class="otp">{{ $otp }}</div>
      <p class="note">{{ __('messages.auth.otp_mail_note') }}</p>
    </div>

    <div class="footer">{{ __('messages.auth.otp_mail_footer') }}</div>
  </div>
</body>
</html>
