<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBorrowingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'book_id' => ['required', Rule::exists('books', 'id')],
            'quantity' => ['required', 'integer', 'min:1'],
        ];

        if ($this->routeIs('member.*')) {
            $rules['user_id'] = ['prohibited'];
        } else {
            $rules['user_id'] = ['required', Rule::exists('users', 'id')->where('role', 'member')];
        }

        return $rules;
    }
}
