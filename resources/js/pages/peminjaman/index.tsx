import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
    Camera, CameraOff, RotateCcw, Send, ClipboardList, FileText,
    User, Hash, BookOpen, StickyNote, CheckCircle2, XCircle, Image, Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import type { PaginatedData, User as UserType } from '@/types';

interface PeminjamanItem {
    id: number;
    user_id: number;
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
    user?: UserType;
}

interface StatistikPeminjaman {
    total: number;
    dipinjam: number;
    dikembalikan: number;
}

interface Props {
    peminjaman: PaginatedData<PeminjamanItem>;
    statistik: StatistikPeminjaman;
}

// ─── Webcam Component ─────────────────────────────────────────────────────────

function WebcamCapture({ onCapture, captured }: { onCapture: (data: string) => void; captured: string | null }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFallback, setIsFallback] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        try {
            setError(null);
            setIsFallback(false);
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Kamera tidak didukung (harus menggunakan HTTPS atau localhost).");
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setStreaming(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
            setStreaming(false);
            setIsFallback(true);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setStreaming(false);
    }, []);

    const capture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            onCapture(dataUrl);
            stopCamera();
        }
    }, [onCapture, stopCamera]);

    const retake = useCallback(() => {
        onCapture('');
        if (isFallback) {
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            startCamera();
        }
    }, [onCapture, startCamera, isFallback]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                onCapture(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    return (
        <div className="space-y-3">
            <Label className="text-sm flex items-center gap-1.5">
                <Camera className="h-4 w-4" />
                Bukti Face ID / Selfie *
            </Label>

            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                {captured ? (
                    // Preview captured photo
                    <div className="relative">
                        <img src={captured} alt="Selfie" className="w-full h-auto rounded-lg" />
                        <div className="absolute bottom-3 right-3">
                            <Button type="button" size="sm" variant="secondary" onClick={retake} className="shadow-lg">
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Foto Ulang
                            </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white shadow">
                                <CheckCircle2 className="h-3 w-3" />
                                Foto Tertangkap
                            </span>
                        </div>
                    </div>
                ) : streaming ? (
                    // Live camera view
                    <div className="relative">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-lg mirror" style={{ transform: 'scaleX(-1)' }} />
                        {/* Face guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-60 border-2 border-white/50 rounded-full" />
                        </div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                            <Button type="button" onClick={capture} className="rounded-full h-14 w-14 shadow-xl bg-white hover:bg-white/90 text-foreground">
                                <Camera className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-medium text-white shadow animate-pulse">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                Kamera Aktif
                            </span>
                        </div>
                    </div>
                ) : (
                    // Camera off state
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        {error ? (
                            <>
                                <XCircle className="h-12 w-12 text-destructive/40" />
                                <p className="text-sm text-destructive text-center max-w-xs">{error}</p>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={startCamera}>
                                        Coba Lagi Kamera
                                    </Button>
                                    <Button type="button" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="h-4 w-4 mr-1.5" />
                                        Unggah Foto
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Camera className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Ambil Foto Selfie Peminjam</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Pastikan wajah terlihat jelas untuk verifikasi
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={startCamera}>
                                        <Camera className="h-4 w-4 mr-1.5" />
                                        Buka Kamera
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="h-4 w-4 mr-1.5" />
                                        Pilih Foto
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Hidden file input for fallback */}
            <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="user" 
                className="hidden" 
                onChange={handleFileUpload}
            />
        </div>
    );
}

// ─── Dialog Bukti Foto & Detail ──────────────────────────────────────────
function PhotoDialog({ item, open, onClose }: { item: PeminjamanItem; open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base">Detail Peminjaman</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    {item.foto_bukti ? (
                        <img src={`/storage/${item.foto_bukti}`} alt="Selfie" className="w-full rounded-lg" />
                    ) : (
                        <div className="flex items-center justify-center py-12 bg-muted rounded-lg">
                            <Image className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}
                    <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
                        <p><span className="text-muted-foreground">Peminjam:</span> <strong>{item.nama_peminjam}</strong> ({item.notas_nik})</p>
                        <p><span className="text-muted-foreground">Dosir:</span> {item.no_dosir} — {item.nama_dosir}</p>
                        <p><span className="text-muted-foreground">Status:</span> <span className="font-medium uppercase">{item.status}</span></p>
                        {item.tgl_pinjam && <p><span className="text-muted-foreground">Tgl. Pinjam:</span> {new Date(item.tgl_pinjam).toLocaleDateString('id-ID')}</p>}
                        {item.lokasi_rak && <p><span className="text-muted-foreground">Lokasi Rak:</span> {item.lokasi_rak}</p>}
                        {item.catatan_admin && <p><span className="text-muted-foreground">Catatan Admin:</span> {item.catatan_admin}</p>}
                        <Separator className="my-2" />
                        {item.catatan && <p><span className="text-muted-foreground">Catatan Saya:</span> {item.catatan}</p>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PeminjamanIndex({ peminjaman, statistik }: Props) {
    const { auth } = usePage<{ auth: { user: UserType } }>().props;
    const [photoItem, setPhotoItem] = useState<PeminjamanItem | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_peminjam: '',
        notas_nik: '',
        nama_dosir: '',
        no_dosir: '',
        foto_bukti: '',
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/peminjaman', {
            onSuccess: () => reset(),
        });
    };

    const statsItems = [
        { label: 'Total Catatan',     value: statistik.total,        color: 'text-foreground',  bg: 'bg-muted/50' },
        { label: 'Menunggu ACC',      value: statistik.menunggu || 0, color: 'text-blue-600',    bg: 'bg-blue-50' },
        { label: 'Sedang Dipinjam',   value: statistik.dipinjam,     color: 'text-amber-600',   bg: 'bg-amber-50' },
        { label: 'Sudah Kembali',     value: statistik.dikembalikan, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <>
            <Head title="Peminjaman Dosir" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Peminjaman Dosir</h1>
                    <p className="text-sm text-muted-foreground">
                        Ajukan peminjaman dosir/arsip nasabah dengan bukti selfie
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statsItems.map(({ label, value, color, bg }) => (
                        <Card key={label} className={`border-0 ${bg}`}>
                            <CardContent className="py-3 px-4">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-5">

                    {/* Form Peminjaman */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Form Peminjaman Baru
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Isi data peminjam dan ambil foto selfie sebagai bukti
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                <form onSubmit={handleSubmit} className="space-y-4">

                                    {/* Nama Peminjam */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="nama_peminjam" className="text-sm flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" /> Nama Peminjam *
                                        </Label>
                                        <Input
                                            id="nama_peminjam"
                                            placeholder="Masukkan nama lengkap peminjam"
                                            value={data.nama_peminjam}
                                            onChange={(e) => setData('nama_peminjam', e.target.value)}
                                            required
                                        />
                                        {errors.nama_peminjam && <p className="text-xs text-destructive">{errors.nama_peminjam}</p>}
                                    </div>

                                    {/* Notas / NIK */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="notas_nik" className="text-sm flex items-center gap-1.5">
                                            <Hash className="h-3.5 w-3.5" /> Notas / NIK (Nomor Taspen) *
                                        </Label>
                                        <Input
                                            id="notas_nik"
                                            placeholder="Masukkan Nomor Taspen atau NIK"
                                            value={data.notas_nik}
                                            onChange={(e) => setData('notas_nik', e.target.value)}
                                            required
                                        />
                                        {errors.notas_nik && <p className="text-xs text-destructive">{errors.notas_nik}</p>}
                                    </div>

                                    {/* Nama Dosir */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="nama_dosir" className="text-sm flex items-center gap-1.5">
                                            <BookOpen className="h-3.5 w-3.5" /> Nama Dosir / Nasabah *
                                        </Label>
                                        <Input
                                            id="nama_dosir"
                                            placeholder="Nama nasabah pada dosir"
                                            value={data.nama_dosir}
                                            onChange={(e) => setData('nama_dosir', e.target.value)}
                                            required
                                        />
                                        {errors.nama_dosir && <p className="text-xs text-destructive">{errors.nama_dosir}</p>}
                                    </div>

                                    {/* No Dosir */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="no_dosir" className="text-sm flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5" /> Nomor Dosir *
                                        </Label>
                                        <Input
                                            id="no_dosir"
                                            placeholder="Nomor dosir/arsip"
                                            value={data.no_dosir}
                                            onChange={(e) => setData('no_dosir', e.target.value)}
                                            required
                                        />
                                        {errors.no_dosir && <p className="text-xs text-destructive">{errors.no_dosir}</p>}
                                    </div>

                                    {/* Webcam Capture */}
                                    <WebcamCapture
                                        onCapture={(dataUrl) => setData('foto_bukti', dataUrl)}
                                        captured={data.foto_bukti || null}
                                    />
                                    {errors.foto_bukti && <p className="text-xs text-destructive">{errors.foto_bukti}</p>}

                                    {/* Catatan */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="catatan" className="text-sm flex items-center gap-1.5">
                                            <StickyNote className="h-3.5 w-3.5" /> Catatan (opsional)
                                        </Label>
                                        <Textarea
                                            id="catatan"
                                            placeholder="Catatan tambahan..."
                                            rows={3}
                                            value={data.catatan}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan', e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={processing || !data.foto_bukti}>
                                        {processing ? (
                                            'Menyimpan...'
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-1.5" />
                                                Ajukan Peminjaman
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Riwayat Peminjaman */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Riwayat Peminjaman Saya</CardTitle>
                                <CardDescription className="text-xs">
                                    {peminjaman.total} catatan peminjaman oleh {auth.user.name}
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                {peminjaman.data.length === 0 ? (
                                    <div className="flex flex-col items-center gap-3 py-12">
                                        <ClipboardList className="h-10 w-10 text-muted-foreground/30" />
                                        <p className="text-sm text-muted-foreground">Belum ada catatan peminjaman</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {peminjaman.data.map((item) => (
                                            <div key={item.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/20 transition-colors">
                                                {/* Foto Bukti Thumbnail */}
                                                <button 
                                                    type="button" 
                                                    onClick={() => setPhotoItem(item)}
                                                    className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 hover:ring-2 ring-primary transition-all cursor-pointer"
                                                >
                                                    {item.foto_bukti ? (
                                                        <img
                                                            src={`/storage/${item.foto_bukti}`}
                                                            alt="Selfie"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Image className="h-5 w-5 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                        <p className="font-semibold text-sm">{item.nama_peminjam}</p>
                                                        {item.status === 'menunggu' && <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium border border-blue-200">Menunggu ACC</span>}
                                                        {item.status === 'dipinjam' && <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium border border-amber-200">Dipinjam</span>}
                                                        {item.status === 'dikembalikan' && <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium border border-emerald-200">Dikembalikan</span>}
                                                        {item.status === 'ditolak' && <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium border border-red-200">Ditolak</span>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Dosir: <span className="font-medium text-foreground">{item.no_dosir}</span> — {item.nama_dosir}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        NIK: {item.notas_nik} · Diajukan pada {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                    
                                                    {/* Informasi Persetujuan / Penolakan Admin */}
                                                    {(item.lokasi_rak || item.catatan_admin) && (
                                                        <div className="mt-2 rounded bg-muted/40 p-2 border border-border/50 text-xs space-y-1">
                                                            {item.lokasi_rak && (
                                                                <p className="text-foreground"><span className="text-muted-foreground font-medium">Lokasi Rak:</span> {item.lokasi_rak}</p>
                                                            )}
                                                            {item.catatan_admin && (
                                                                <p className="text-foreground"><span className="text-muted-foreground font-medium">Catatan Admin:</span> {item.catatan_admin}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {peminjaman.last_page > 1 && (
                                    <div className="flex justify-center gap-1 pt-4">
                                        {peminjaman.links.map((link, i) => (
                                            <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'}
                                                disabled={!link.url} onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {photoItem && <PhotoDialog item={photoItem} open={true} onClose={() => setPhotoItem(null)} />}
        </>
    );
}

PeminjamanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Peminjaman Dosir', href: '/peminjaman' },
    ],
};
