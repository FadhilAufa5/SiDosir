export type User = {
    id: number;
    name: string;
    no_karyawan: string | null;
    role: 'admin' | 'customer_services';
    no_hp: string | null;
    status: 'aktif' | 'nonaktif';
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
