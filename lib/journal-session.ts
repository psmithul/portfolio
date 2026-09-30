import { SignJWT, jwtVerify, errors } from 'jose';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const issuer = 'mithul-portfolio';
const audience = 'writing-desk';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

function key(secret: string) {
  if (secret.length < 32)
    throw new Error(
      'JOURNAL_SESSION_SECRET must contain at least 32 characters.',
    );
  return new TextEncoder().encode(secret);
}
export async function createOwnerSession(secret: string) {
  return new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('mika')
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(key(secret));
}
export async function verifyOwnerSession(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, key(secret), {
      algorithms: ['HS256'],
      issuer,
      audience,
      maxTokenAge: `${SESSION_SECONDS}s`,
    });
    return payload.sub === 'mika' && payload.role === 'owner';
  } catch (error) {
    if (error instanceof errors.JOSEError) return false;
    throw error;
  }
}
export async function verifyDeskPassword(password: string, encoded: string) {
  const [method, salt, expected] = encoded.split(':');
  if (
    encoded.split(':').length !== 3 ||
    method !== 'scrypt' ||
    !/^[a-f0-9]{32}$/.test(salt ?? '') ||
    !/^[a-f0-9]{128}$/.test(expected ?? '')
  )
    throw new Error('JOURNAL_PASSWORD_HASH has an invalid format.');
  const actual = (await derive(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
