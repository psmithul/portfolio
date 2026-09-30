import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { SignJWT } from 'jose';
import {
  createOwnerSession,
  verifyOwnerSession,
  verifyDeskPassword,
} from '../lib/journal-session.ts';

const secret = 'test-only-session-secret-with-32-characters';
const key = new TextEncoder().encode(secret);

await test('sessions require a valid signature and exact owner claims', async () => {
  const session = await createOwnerSession(secret);
  assert.equal(await verifyOwnerSession(session, secret), true);
  assert.equal(await verifyOwnerSession(session, secret + '-different'), false);
  assert.equal(await verifyOwnerSession(session + 'tampered', secret), false);
  assert.equal(await verifyOwnerSession('mika', secret), false);
  const token = (overrides: Record<string, unknown> = {}) =>
    new SignJWT({ sub: 'mika', role: 'owner', ...overrides })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('mithul-portfolio')
      .setAudience('writing-desk')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(key);
  assert.equal(
    await verifyOwnerSession(await token({ sub: 'visitor' }), secret),
    false,
  );
  assert.equal(
    await verifyOwnerSession(await token({ role: 'reader' }), secret),
    false,
  );
});

await test('expired sessions and tokens for another service are rejected', async () => {
  const expired = await new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('mika')
    .setIssuer('mithul-portfolio')
    .setAudience('writing-desk')
    .setIssuedAt(Math.floor(Date.now() / 1000) - 120)
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(key);
  const wrongAudience = await new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('mika')
    .setIssuer('mithul-portfolio')
    .setAudience('another-service')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
  assert.equal(await verifyOwnerSession(expired, secret), false);
  assert.equal(await verifyOwnerSession(wrongAudience, secret), false);
  await assert.rejects(() => createOwnerSession('too-short'), /32 characters/);
});

await test('password verification uses the saved scrypt hash and rejects invalid formats', async () => {
  const salt = '0123456789abcdef0123456789abcdef';
  const hash = Buffer.from(scryptSync('test-only-password', salt, 64)).toString('hex');
  const encoded = `scrypt:${salt}:${hash}`;
  assert.equal(await verifyDeskPassword('test-only-password', encoded), true);
  assert.equal(await verifyDeskPassword('incorrect-password', encoded), false);
  await assert.rejects(
    () => verifyDeskPassword('anything', 'plaintext'),
    /invalid format/,
  );
  await assert.rejects(
    () => verifyDeskPassword('anything', encoded + ':extra'),
    /invalid format/,
  );
});
