<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordOtpResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_request_and_use_otp_password_reset(): void
    {
        Mail::fake();

        $member = User::factory()->create([
            'role' => 'member',
            'password' => Hash::make('OldPassword123!'),
        ]);

        $requestResponse = $this->post('/forgot-password', [
            'email' => $member->email,
        ]);

        $requestResponse->assertRedirect(route('password.reset', ['email' => $member->email]));

        $this->assertDatabaseHas('password_otps', [
            'email' => $member->email,
        ]);

        $otp = (string) \DB::table('password_otps')->where('email', $member->email)->value('otp');

        $resetResponse = $this->post('/reset-password', [
            'email' => $member->email,
            'otp' => $otp,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $resetResponse->assertRedirect(route('login'));

        $this->assertDatabaseMissing('password_otps', [
            'email' => $member->email,
        ]);

        $this->assertTrue(Hash::check('NewPassword123!', $member->fresh()->password));
    }
}
