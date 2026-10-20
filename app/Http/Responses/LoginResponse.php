<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        // Langsung redirect ke dashboard setelah login berhasil (tanpa OTP)
        return redirect()->intended(config('fortify.home', '/dashboard'));
    }
}