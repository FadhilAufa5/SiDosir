<?php

namespace App\Services;

use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class PeminjamanService
{
    /**
     * Catat pengajuan peminjaman baru (oleh CS).
     */
    public function catat(User $user, array $data, ?string $fotoPath = null): Peminjaman
    {
        return Peminjaman::create([
            'user_id'        => $user->id,
            'nama_peminjam'  => $data['nama_peminjam'],
            'notas_nik'      => $data['notas_nik'],
            'nama_dosir'     => $data['nama_dosir'],
            'no_dosir'       => $data['no_dosir'],
            'foto_bukti'     => $fotoPath,
            'status'         => 'menunggu',
            'catatan'        => $data['catatan'] ?? null,
        ]);
    }

    /**
     * Admin menyetujui peminjaman.
     */
    public function setujui(Peminjaman $peminjaman, array $data): Peminjaman
    {
        $peminjaman->update([
            'status'        => 'dipinjam',
            'lokasi_rak'    => $data['lokasi_rak'],
            'catatan_admin' => $data['catatan_admin'] ?? null,
            'tgl_pinjam'    => now()->toDateString(),
        ]);

        return $peminjaman->fresh();
    }

    /**
     * Admin menolak peminjaman.
     */
    public function tolak(Peminjaman $peminjaman, string $catatanAdmin): Peminjaman
    {
        $peminjaman->update([
            'status'        => 'ditolak',
            'catatan_admin' => $catatanAdmin,
        ]);

        return $peminjaman->fresh();
    }

    /**
     * Proses pengembalian.
     */
    public function kembalikan(Peminjaman $peminjaman): Peminjaman
    {
        $peminjaman->update([
            'status'      => 'dikembalikan',
            'tgl_kembali' => now()->toDateString(),
        ]);

        return $peminjaman->fresh();
    }

    /**
     * Daftar peminjaman dengan filter & search.
     */
    public function daftar(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Peminjaman::with('user')
            ->when($filters['status'] ?? null, fn($q, $s) => $q->byStatus($s))
            ->when($filters['user_id'] ?? null, fn($q, $uid) => $q->where('user_id', $uid))
            ->search($filters['q'] ?? null)
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Statistik peminjaman untuk dashboard.
     */
    public function statistik(): array
    {
        return [
            'total'         => Peminjaman::count(),
            'menunggu'      => Peminjaman::byStatus('menunggu')->count(),
            'dipinjam'      => Peminjaman::byStatus('dipinjam')->count(),
            'dikembalikan'  => Peminjaman::byStatus('dikembalikan')->count(),
            'ditolak'       => Peminjaman::byStatus('ditolak')->count(),
        ];
    }
}
