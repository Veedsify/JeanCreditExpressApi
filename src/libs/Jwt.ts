import ENV from '@src/common/constants/ENV';
import { IUser } from '@src/database/schemas/UserSchema';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

// Environment variables
const JWT_SECRET = ENV.JwtSecretKey || 'your-fallback-secret';
const TOKEN_EXPIRATION = ENV.JwtTokenExpiration || '1h';

type JwtPayload = {
    userId: string;
    email: string;
    isAdmin?: boolean;
}

async function Authenticate(data: JwtPayload): Promise<any> {
    const payload = { ...data };
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION } as SignOptions
    );
}

export { Authenticate };