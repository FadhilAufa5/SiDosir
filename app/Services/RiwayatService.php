<?php

namespace App\Services;

use App\Models\Arsip;
use App\Models\RiwayatArsip;
use App\Models\User;

class RiwayatService
{
    /**
     * Catat aktivitas pada arsip.
     */
    public function catat(
        Arsip $arsip,
        ?User $user,
        string $jenis,
        string $keterangan = ''
    ): RiwayatArsip {
        return RiwayatArsip::create([
            'arsip_id'      => $arsip->id,
            'user_id'       => $user?->id,
            'jenis_riwayat' => $jenis,
            'keterangan'    => $keterangan,
            'waktu'         => now(),
        ]);
    }
}
