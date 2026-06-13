import { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from '../lib/auth'

export enum userRole {
    CUSTOMER = 'CUSTOMER',
    PROVIDER = 'PROVIDER',
    ADMIN = 'ADMIN'
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: userRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                return res.status(403).json({
                    success: false,
                    message: 'you are not authorized!'
                })
            }

            if (!session?.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Email verification required, Please verify your email!'
                })
            }

            req.user = {
                id: session?.user.id,
                email: session?.user.email,
                name: session?.user.name,
                role: session?.user.role as string,
                emailVerified: session?.user.emailVerified
            }


            if (roles?.length && !roles.includes(req?.user?.role as userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'you are not authorized!'
                })
            }

            next()

        } catch (error) {
            next(error)
        }

    }
}

export default auth