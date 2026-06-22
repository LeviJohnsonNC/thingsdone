// Shared HMAC-signed state helpers for OAuth CSRF protection.

const encoder = new TextEncoder();

function getSecret(): string {
  // Reuse the service role key as HMAC secret (server-only, high-entropy).
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret) throw new Error("Missing signing secret");
  return secret;
}

function b64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return b64url(new Uint8Array(sig));
}

// State format: base64url(userId).base64url(expMs).sig
export async function signState(userId: string, ttlSeconds = 600): Promise<string> {
  const exp = Date.now() + ttlSeconds * 1000;
  const nonce = b64url(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `${b64url(encoder.encode(userId))}.${b64url(encoder.encode(String(exp)))}.${nonce}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifyState(state: string): Promise<{ userId: string } | null> {
  const parts = state.split(".");
  if (parts.length !== 4) return null;
  const [uid, expEnc, nonce, sig] = parts;
  const payload = `${uid}.${expEnc}.${nonce}`;
  const expected = await hmac(payload);
  // Constant-ish compare
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  const exp = Number(new TextDecoder().decode(b64urlDecode(expEnc)));
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  const userId = new TextDecoder().decode(b64urlDecode(uid));
  return { userId };
}
