import * as crypto from 'crypto';

export function generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
}