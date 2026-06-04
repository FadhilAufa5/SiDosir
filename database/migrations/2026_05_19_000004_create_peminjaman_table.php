<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Data peminjam
            $table->string('nama_peminjam');
            $table->string('notas_nik', 50);

            // Data dosir
            $table->string('nama_dosir');
            $table->string('no_dosir', 50);

            // Bukti Face ID / Selfie
            $table->string('foto_bukti')->nullable();

            // Persetujuan Admin
            $table->string('lokasi_rak')->nullable();
            $table->text('catatan_admin')->nullable();

            // Status monitoring
            $table->enum('status', ['menunggu', 'dipinjam', 'dikembalikan', 'ditolak'])->default('menunggu');
            $table->date('tgl_pinjam')->nullable();
            $table->date('tgl_kembali')->nullable();
            $table->text('catatan')->nullable(); // catatan dari CS

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
