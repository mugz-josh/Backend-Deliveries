import { Request, Response } from 'express';
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateOtpForEmail: (req: Request, res: Response) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkEmail: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=OtpControllers.d.ts.map