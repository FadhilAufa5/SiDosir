<?php

namespace App\Services;

use App\Models\Arsip;
use App\Models\LokasiRak;
use Illuminate\Pagination\LengthAwarePaginator;

class ArsipService
{
    /**
     * Cari arsip berdasarkan keyword (no_dosir / nama_nasabah / nip_nasabah).
     */
    public function cari(string $keyword = '', int $perPage = 15): LengthAwarePaginator
    {
        return Arsip::with('lokasiRak')
            ->when($keyword, fn($q) => $q->cari($keyword))
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Ambil detail arsip beserta riwayat dan peminjaman aktif.
     */
    public function detail(int $id): Arsip
    {
        return Arsip::with(['lokasiRak', 'riwayat.user', 'peminjamanAktif.user'])
            ->findOrFail($id);
    }

    /**
     * Buat arsip baru.
     */
    public function buat(array $data): Arsip
    {
        return Arsip::create($data);
    }

    /**
     * Update arsip.
     */
    public function perbarui(Arsip $arsip, array $data): Arsip
    {
        $arsip->update($data);
        return $arsip->fresh('lokasiRak');
    }

    /**
     * Hapus arsip (hanya jika tidak sedang dipinjam).
     */
    public function hapus(Arsip $arsip): void
    {
        if ($arsip->status_arsip === 'dipinjam') {
            throw new \RuntimeException('Arsip sedang dipinjam, tidak bisa dihapus.');
        }

        $arsip->delete();
    }

    /**
     * Update status arsip.
     */
    public function updateStatus(Arsip $arsip, string $status): Arsip
    {
        $arsip->update(['status_arsip' => $status]);
        return $arsip;
    }

    /**
     * Statistik arsip untuk dashboard.
     */
    public function statistik(): array
    {
        return [
            'total'         => Arsip::count(),
            'tersedia'      => Arsip::where('status_arsip', 'tersedia')->count(),
            'dipinjam'      => Arsip::where('status_arsip', 'dipinjam')->count(),
            'dalam_proses'  => Arsip::where('status_arsip', 'dalam_proses')->count(),
            'hilang'        => Arsip::where('status_arsip', 'hilang')->count(),
            'arsip_lama'    => Arsip::where('status_arsip', 'arsip_lama')->count(),
        ];
    }

    /**
     * Semua lokasi rak aktif untuk dropdown.
     */
    public function lokasiAktif()
    {
        return LokasiRak::aktif()->orderBy('kode_lokasi')->get();
    }
}
