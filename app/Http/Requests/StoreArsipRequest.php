<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArsipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $arsipId = $this->route('arsip')?->id;

        return [
            'no_dosir'      => ['required', 'string', 'max:50', "unique:arsip,no_dosir,{$arsipId}"],
            'nama_nasabah'  => ['required', 'string', 'max:100'],
            'nip_nasabah'   => ['nullable', 'string', 'max:50'],
            'jenis_dokumen' => ['nullable', 'string', 'max:100'],
            'lokasi_rak_id' => ['nullable', 'exists:lokasi_rak,id'],
            'status_arsip'  => ['required', 'in:tersedia,dipinjam,dalam_proses,hilang,arsip_lama'],
            'keterangan'    => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'no_dosir'      => 'Nomor Dosir',
            'nama_nasabah'  => 'Nama Nasabah',
            'nip_nasabah'   => 'NIP Nasabah',
            'jenis_dokumen' => 'Jenis Dokumen',
            'lokasi_rak_id' => 'Lokasi Rak',
            'status_arsip'  => 'Status Arsip',
        ];
    }
}
