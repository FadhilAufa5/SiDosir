<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Daftar user dengan filter dan pagination.
     */
    public function daftar(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()->latest();

        if (! empty($filters['q'])) {
            $q = $filters['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('no_karyawan', 'like', "%{$q}%");
            });
        }

        if (! empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Statistik user berdasarkan role.
     */
    public function statistik(): array
    {
        return [
            'total'              => User::count(),
            'admin'              => User::where('role', 'admin')->count(),
            'customer_services'  => User::where('role', 'customer_services')->count(),
            'aktif'              => User::where('status', 'aktif')->count(),
            'nonaktif'           => User::where('status', 'nonaktif')->count(),
        ];
    }

    /**
     * Buat user baru.
     */
    public function buat(array $data): User
    {
        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }

    /**
     * Update data user.
     */
    public function update(User $user, array $data): User
    {
        // Hanya hash password jika diisi
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    /**
     * Hapus user (soft: nonaktifkan).
     */
    public function hapus(User $user): bool
    {
        // Jangan hapus diri sendiri
        if ($user->id === auth()->id()) {
            return false;
        }

        return $user->delete();
    }

    /**
     * Toggle status aktif/nonaktif.
     */
    public function toggleStatus(User $user): User
    {
        $user->update([
            'status' => $user->status === 'aktif' ? 'nonaktif' : 'aktif',
        ]);

        return $user->fresh();
    }
}
