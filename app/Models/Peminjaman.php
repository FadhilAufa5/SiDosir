<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Peminjaman extends Model
{
    protected $table = 'peminjaman';

    protected $fillable = [
        'user_id',
        'nama_peminjam',
        'notas_nik',
        'nama_dosir',
        'no_dosir',
        'foto_bukti',
        'lokasi_rak',
        'catatan_admin',
        'status',
        'tgl_pinjam',
        'tgl_kembali',
        'catatan',
    ];

    protected $casts = [
        'tgl_pinjam'  => 'date',
        'tgl_kembali' => 'date',
    ];

    /**
     * User (CS) yang mencatat peminjaman.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope search by nama / no dosir.
     */
    public function scopeSearch($query, ?string $keyword)
    {
        if (! $keyword) return $query;
        return $query->where(function ($q) use ($keyword) {
            $q->where('nama_peminjam', 'like', "%{$keyword}%")
              ->orWhere('notas_nik', 'like', "%{$keyword}%")
              ->orWhere('nama_dosir', 'like', "%{$keyword}%")
              ->orWhere('no_dosir', 'like', "%{$keyword}%");
        });
    }
}
