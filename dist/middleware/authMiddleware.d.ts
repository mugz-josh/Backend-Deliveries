import { Request, Response, NextFunction } from 'express';
export type Role = 'user' | 'admin';
export interface JwtPayload {
    id: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeRoles: (roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map