<?php

namespace App\Services;

use App\Models\LokasiRak;
use Illuminate\Pagination\LengthAwarePaginator;

class LokasiRakService
{
    /**
     * Daftar semua lokasi rak dengan filter.
     */
    public function daftar(string $keyword = '', int $perPage = 15): LengthAwarePaginator
    {
        return LokasiRak::withCount('arsip')
            ->when($keyword, fn($q) => $q->where('kode_lokasi', 'like', "%{$keyword}%")
                ->orWhere('nama_lokasi', 'like', "%{$keyword}%"))
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Buat lokasi baru.
     */
    public function buat(array $data): LokasiRak
    {
        return LokasiRak::create($data);
    }

    /**
     * Update lokasi.
     */
    public function perbarui(LokasiRak $lokasi, array $data): LokasiRak
    {
        $lokasi->update($data);
        return $lokasi->fresh();
    }

    /**
     * Hapus lokasi (hanya jika tidak ada arsip).
     */
    public function hapus(LokasiRak $lokasi): void
    {
        if ($lokasi->arsip()->count() > 0) {
            throw new \RuntimeException('Lokasi masih memiliki arsip, tidak bisa dihapus.');
        }

        $lokasi->delete();
    }
}
