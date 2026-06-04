<?php

namespace App\Services;

use App\Models\Peminjaman;
use App\Models\Pengembalian;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PengembalianService
{
    public function __construct(
        private readonly RiwayatService $riwayatService
    ) {}

    /**
     * Proses pengembalian dosir.
     */
    public function proses(Peminjaman $peminjaman, User $admin, array $data): Pengembalian
    {
        if ($peminjaman->status !== 'dipinjam') {
            throw new \RuntimeException('Peminjaman tidak dalam status dipinjam.');
        }

        return DB::transaction(function () use ($peminjaman, $admin, $data) {
            $pengembalian = Pengembalian::create([
                'peminjaman_id'     => $peminjaman->id,
                'tgl_kembali'       => $data['tgl_kembali'] ?? now()->toDateString(),
                'kondisi_dokumen'   => $data['kondisi_dokumen'],
                'catatan'           => $data['catatan'] ?? null,
                'status'            => 'selesai',
            ]);

            // Update status peminjaman
            $peminjaman->update(['status' => 'dikembalikan']);

            // Update status arsip berdasarkan kondisi dokumen
            $statusArsip = match ($data['kondisi_dokumen']) {
                'hilang'        => 'hilang',
                'rusak_berat'   => 'dalam_proses',
                default         => 'tersedia',
            };

            $peminjaman->arsip->update(['status_arsip' => $statusArsip]);

            $keterangan = "Dikembalikan oleh {$peminjaman->user->name}. Kondisi: {$data['kondisi_dokumen']}";
            $this->riwayatService->catat($peminjaman->arsip, $admin, 'dikembalikan', $keterangan);

            return $pengembalian->load('peminjaman.arsip');
        });
    }

    /**
     * Daftar pengembalian dengan filter.
     */
    public function daftar(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Pengembalian::with(['peminjaman.user', 'peminjaman.arsip'])
            ->when($filters['kondisi'] ?? null, fn($q, $k) => $q->where('kondisi_dokumen', $k))
            ->latest()
            ->paginate($perPage);
    }
}
