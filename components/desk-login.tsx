'use client';
import { useState, type SubmitEvent } from 'react';
import { deskRequest } from './writing-desk';

export function DeskLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signIn(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const password = new FormData(event.currentTarget).get('password');
    try {
      await deskRequest('/api/journal/session', 'POST', { password });
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not sign in.');
      setBusy(false);
    }
  }
  return (
    <form className="desk-login-form" onSubmit={signIn}>
      <label htmlFor="desk-password">Writing desk password</label>
      <input
        id="desk-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={256}
      />
      {error && <p role="alert">{error}</p>}
      <button className="button primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Open writing desk'}
      </button>
    </form>
  );
}
export function DeskSignOut() {
  const [error, setError] = useState('');
  async function signOut() {
    try {
      await deskRequest('/api/journal/session', 'POST', { action: 'signout' });
      window.location.assign('/blog');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not sign out.');
    }
  }
  return (
    <>
      <button type="button" onClick={signOut}>
        Sign out
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
