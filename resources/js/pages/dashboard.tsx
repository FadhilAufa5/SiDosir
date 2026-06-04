import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    FileText, ClipboardList, Camera, BarChart3, CheckCircle2,
    ArrowRight, Image, CalendarDays, Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

interface PeminjamanItem {
    id: number;
    nama_peminjam: string;
    notas_nik: string;
    nama_dosir: string;
    no_dosir: string;
    foto_bukti: string | null;
    lokasi_rak: string | null;
    catatan_admin: string | null;
    status: 'menunggu' | 'dipinjam' | 'dikembalikan' | 'ditolak';
    tgl_pinjam: string | null;
    tgl_kembali: string | null;
    catatan: string | null;
    created_at: string;
    user?: User;
}

interface Statistik {
    total: number;
    menunggu: number;
    dipinjam: number;
    dikembalikan: number;
    ditolak: number;
}

interface Props {
    statistik: Statistik;
    peminjamanTerbaru?: PeminjamanItem[];
    isAdmin?: boolean;
}

export default function Dashboard({ statistik, peminjamanTerbaru = [], isAdmin = false }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    const statsItems = isAdmin ? [
        { label: 'Menunggu ACC',  value: statistik.menunggu || 0, color: 'text-blue-600',    bg: 'bg-blue-50',    icon: CheckCircle2 },
        { label: 'Sedang Dipinjam', value: statistik.dipinjam,     color: 'text-amber-600',   bg: 'bg-amber-50',    icon: FileText },
        { label: 'Dikembalikan',    value: statistik.dikembalikan, color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: CheckCircle2 },
    ] : [
        { label: 'Menunggu ACC',  value: statistik.menunggu || 0, color: 'text-blue-600',    bg: 'bg-blue-50',    icon: ClipboardList },
        { label: 'Sedang Dipinjam', value: statistik.dipinjam,     color: 'text-amber-600',   bg: 'bg-amber-50',    icon: FileText },
        { label: 'Dikembalikan',    value: statistik.dikembalikan, color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: CheckCircle2 },
    ];

    const roleLabel = auth.user.role === 'admin' ? 'Admin' : 'Customer Services';

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Selamat datang, <strong>{auth.user.name}</strong>
                            <Badge variant="secondary" className="ml-2 text-xs">{roleLabel}</Badge>
                        </p>
                    </div>
                    {!isAdmin && (
                        <Link href="/peminjaman">
                            <Button>
                                <Camera className="h-4 w-4 mr-1.5" />
                                Catat Peminjaman
                            </Button>
                        </Link>
                    )}
                    {isAdmin && (
                        <Link href="/admin/peminjaman">
                            <Button>
                                <BarChart3 className="h-4 w-4 mr-1.5" />
                                Monitoring
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {statsItems.map(({ label, value, color, bg, icon: Icon }) => (
                        <Card key={label} className={`border-0 ${bg}`}>
                            <CardContent className="flex items-center gap-4 py-5">
                                <Icon className={`h-9 w-9 ${color} opacity-70`} />
                                <div>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Info for CS */}
                {!isAdmin && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="flex items-center gap-4 py-4">
                            <Camera className="h-10 w-10 text-primary opacity-60" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Catat Peminjaman Dosir</p>
                                <p className="text-xs text-muted-foreground">
                                    Gunakan kamera untuk mengambil foto selfie peminjam sebagai bukti verifikasi identitas
                                </p>
                            </div>
                            <Link href="/peminjaman">
                                <Button size="sm" variant="outline" className="gap-1">
                                    Mulai <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Peminjaman Terbaru */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    {isAdmin ? 'Peminjaman Terbaru' : 'Catatan Terbaru Saya'}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {isAdmin ? 'Semua peminjaman dari seluruh CS' : 'Riwayat pencatatan Anda'}
                                </CardDescription>
                            </div>
                            <Link href={isAdmin ? '/admin/peminjaman' : '/peminjaman'}>
                                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                    Lihat Semua <ArrowRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                        {peminjamanTerbaru.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-center">
                                <ClipboardList className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">Belum ada catatan peminjaman</p>
                                {!isAdmin && (
                                    <Link href="/peminjaman">
                                        <Button variant="outline" size="sm">
                                            <Camera className="h-4 w-4 mr-1" />
                                            Catat Sekarang
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {peminjamanTerbaru.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/20 transition-colors">
                                        {/* Foto Thumbnail */}
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                                            {item.foto_bukti ? (
                                                <img src={`/storage/${item.foto_bukti}`} alt="Selfie" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Image className="h-4 w-4 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {item.nama_peminjam} — {item.no_dosir}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {isAdmin && item.user ? `${item.user.name} · ` : ''}
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>

                                        <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                                            item.status === 'menunggu' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            item.status === 'dipinjam' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            item.status === 'ditolak' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
