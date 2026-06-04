<?php

namespace App\Http\Controllers;

use App\Services\PeminjamanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PeminjamanController extends Controller
{
    public function __construct(
        private readonly PeminjamanService $peminjamanService
    ) {}

    /**
     * Halaman form + daftar peminjaman milik CS.
     */
    public function index(Request $request): Response
    {
        $peminjaman = $this->peminjamanService->daftar(
            filters: ['user_id' => $request->user()->id],
        );

        $statistik = $this->peminjamanService->statistik();

        return Inertia::render('peminjaman/index', [
            'peminjaman' => $peminjaman,
            'statistik'  => $statistik,
        ]);
    }

    /**
     * Simpan peminjaman baru (dengan foto selfie).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_peminjam' => ['required', 'string', 'max:255'],
            'notas_nik'     => ['required', 'string', 'max:50'],
            'nama_dosir'    => ['required', 'string', 'max:255'],
            'no_dosir'      => ['required', 'string', 'max:50'],
            'foto_bukti'    => ['required', 'string'], // base64 image
            'catatan'       => ['nullable', 'string', 'max:1000'],
        ]);

        // Simpan foto base64 ke storage
        $fotoPath = null;
        if ($request->foto_bukti) {
            $imageData = $request->foto_bukti;

            // Remove data:image/xxx;base64, prefix
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $matches)) {
                $ext = $matches[1];
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $imageData = base64_decode($imageData);

                $filename = 'face_' . time() . '_' . uniqid() . '.' . $ext;
                $fotoPath = 'peminjaman/' . $filename;

                Storage::disk('public')->put($fotoPath, $imageData);
            }
        }

        $this->peminjamanService->catat(
            user: $request->user(),
            data: $request->only('nama_peminjam', 'notas_nik', 'nama_dosir', 'no_dosir', 'catatan'),
            fotoPath: $fotoPath,
        );

        return back()->with('success', 'Peminjaman berhasil dicatat.');
    }
}
