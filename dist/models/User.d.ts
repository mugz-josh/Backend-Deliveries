export interface User {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    phone?: string | null;
    avatar?: string | null;
    role?: 'user' | 'admin' | 'driver';
    created_at?: Date;
}
//# sourceMappingURL=User.d.ts.map