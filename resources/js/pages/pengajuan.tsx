import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pengajuan } from '@/routes';
import { useState } from 'react';

export default function Pengajuan() {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        nomor_identitas: '',
        tujuan: '',
        keterangan: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <Head title="Pengajuan" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pengajuan</h1>
                    <p className="text-sm text-muted-foreground">
                        Ajukan permohonan atau kebutuhan Anda di sini
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Form Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Form Pengajuan Baru</CardTitle>
                            <CardDescription>
                                Isi data lengkap untuk mengajukan permohonan
                            </CardDescription>
                        </CardHeader>
                        <Separator className="mb-6" />
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nama">Nama Lengkap</Label>
                                        <Input
                                            id="nama"
                                            name="nama"
                                            placeholder="Masukkan nama lengkap"
                                            value={formData.nama}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Masukkan email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nomor_identitas">Nomor Identitas</Label>
                                    <Input
                                        id="nomor_identitas"
                                        name="nomor_identitas"
                                        placeholder="Masukkan nomor identitas (KTP/SIM)"
                                        value={formData.nomor_identitas}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="tujuan">Tujuan Pengajuan</Label>
                                    <Input
                                        id="tujuan"
                                        name="tujuan"
                                        placeholder="Masukkan tujuan pengajuan"
                                        value={formData.tujuan}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        placeholder="Masukkan keterangan tambahan (opsional)"
                                        value={formData.keterangan}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="flex-1">
                                        Ajukan Permohonan
                                    </Button>
                                    <Button type="reset" variant="outline" className="flex-1">
                                        Reset Form
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penting</CardTitle>
                        </CardHeader>
                        <Separator className="mb-4" />
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Waktu Pemrosesan</h4>
                                <p className="text-xs text-muted-foreground">
                                    Pengajuan Anda akan diproses dalam 3-5 hari kerja
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Syarat & Ketentuan</h4>
                                <p className="text-xs text-muted-foreground">
                                    Pastikan semua data yang Anda masukkan akurat dan lengkap
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Bantuan</h4>
                                <p className="text-xs text-muted-foreground">
                                    Hubungi admin jika ada pertanyaan
                                </p>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                Hubungi Dukungan
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* History Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Riwayat Pengajuan</CardTitle>
                                <CardDescription>
                                    Daftar pengajuan Anda
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                Lihat Semua
                            </Button>
                        </div>
                    </CardHeader>
                    <Separator className="mb-4" />
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                                    <div className="space-y-2">
                                        <p className="font-medium text-sm">Pengajuan #{item} - Peminjaman Buku</p>
                                        <p className="text-xs text-muted-foreground">
                                            Diajukan pada {new Date(Date.now() - item * 86400000).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant={item === 1 ? 'default' : item === 2 ? 'secondary' : 'outline'}>
                                        {item === 1 ? 'Disetujui' : item === 2 ? 'Menunggu' : 'Ditolak'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Pengajuan.layout = {
    breadcrumbs: [
        {
            title: 'Pengajuan',
            href: pengajuan(),
        },
    ],
};
