import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { peminjaman } from '@/routes';
import { useState } from 'react';

export default function Peminjaman() {
    const [formData, setFormData] = useState({
        item_name: '',
        quantity: '',
        tanggal_peminjaman: '',
        tanggal_pengembalian: '',
        tujuan_peminjaman: '',
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
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <Head title="Peminjaman" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Peminjaman</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola peminjaman barang atau aset Anda
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Peminjaman</CardTitle>
                            <Badge variant="secondary">+5</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Sepanjang masa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktif Saat Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                Sedang dipinjam
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tertunggak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">
                                Menunggu pengembalian
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">
                                Sudah dikembalikan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Form Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Ajukan Peminjaman Baru</CardTitle>
                            <CardDescription>
                                Isi formulir untuk meminjam barang
                            </CardDescription>
                        </CardHeader>
                        <Separator className="mb-6" />
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="item_name">Nama Barang</Label>
                                    <Input
                                        id="item_name"
                                        name="item_name"
                                        placeholder="Masukkan nama barang yang ingin dipinjam"
                                        value={formData.item_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="quantity">Jumlah</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            placeholder="Masukkan jumlah"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="tanggal_peminjaman">Tanggal Peminjaman</Label>
                                        <Input
                                            id="tanggal_peminjaman"
                                            name="tanggal_peminjaman"
                                            type="date"
                                            value={formData.tanggal_peminjaman}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="tanggal_pengembalian">Tanggal Pengembalian</Label>
                                    <Input
                                        id="tanggal_pengembalian"
                                        name="tanggal_pengembalian"
                                        type="date"
                                        value={formData.tanggal_pengembalian}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="tujuan_peminjaman">Tujuan Peminjaman</Label>
                                    <textarea
                                        id="tujuan_peminjaman"
                                        name="tujuan_peminjaman"
                                        placeholder="Jelaskan tujuan peminjaman"
                                        value={formData.tujuan_peminjaman}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="flex-1">
                                        Ajukan Peminjaman
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
                            <CardTitle>Ketentuan Peminjaman</CardTitle>
                        </CardHeader>
                        <Separator className="mb-4" />
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Durasi Maksimal</h4>
                                <p className="text-xs text-muted-foreground">
                                    Peminjaman maksimal 30 hari
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Pengembalian</h4>
                                <p className="text-xs text-muted-foreground">
                                    Kembalikan dalam kondisi baik
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Denda Keterlambatan</h4>
                                <p className="text-xs text-muted-foreground">
                                    Rp. 50.000 per hari
                                </p>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                Baca Syarat Lengkap
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Loans */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Peminjaman Aktif</CardTitle>
                                <CardDescription>
                                    Barang yang sedang Anda pinjam
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
                            {[
                                { name: 'Laptop Dell XPS 13', date: '2 hari', status: 'Aktif' },
                                { name: 'Proyektor EPSON', date: '5 hari', status: 'Aktif' },
                                { name: 'Speaker Portable', date: '7 hari', status: 'Segera Jatuh Tempo' },
                            ].map((item, index) => (
                                <div key={index + 1} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                                    <div className="space-y-2 flex-1">
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Dipinjam selama {item.date}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={item.status === 'Aktif' ? 'secondary' : 'destructive'}>
                                            {item.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                            Kembalikan
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Peminjaman.layout = {
    breadcrumbs: [
        {
            title: 'Peminjaman',
            href: peminjaman(),
        },
    ],
};
