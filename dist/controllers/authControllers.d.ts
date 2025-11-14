import { Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const sendOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authControllers.d.ts.map