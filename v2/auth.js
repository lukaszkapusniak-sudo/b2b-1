/* ═══ auth.js — onAudience Hub v2.3 ═══
   Magic link / email OTP auth via Supabase.
   Audit trail: logActivity() writes to activity_log on every CRM change.
   ═══════════════════════════════════════════════════════════════════ */

import { SB_URL, SB_KEY } from './config.js';

/* ── Supabase JS client (SDK loaded via CDN in index.html) ── */
let _sb = null;
function sb() {
  if (_sb) return _sb;
  if (!window.supabase) throw new Error('Supabase SDK not loaded');
  _sb = window.supabase.createClient(SB_URL, SB_KEY, {
    auth: {
      persistSession:      true,
      storageKey:          'oaHubSession',
      autoRefreshToken:    true,
      detectSessionInUrl:  true,   // needed for magic link redirect
    }
  });
  return _sb;
}

/* ── Session / user ─────────────────────────────────────────── */

export async function getSession() {
  const { data } = await sb().auth.getSession();
  return data?.session || null;
}

export async function getAuthToken() {
  const s = await getSession();
  return s?.access_token || null;
}

export async function getCurrentUser() {
  const { data } = await sb().auth.getUser();
  return data?.user || null;
}

export async function signOut() {
  await sb().auth.signOut();
}

export function onAuthStateChange(cb) {
  sb().auth.onAuthStateChange(cb);
}

/* ── Magic link OTP ─────────────────────────────────────────── */

export async function sendOTP(email) {
  const { error } = await sb().auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,   // only existing users can log in
    }
  });
  if (error) throw error;
}

export async function verifyOTP(email, token) {
  const { data, error } = await sb().auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;
  return data;
}

/* ── User profile ───────────────────────────────────────────── */

export async function getUserProfile(userId) {
  const token = await getAuthToken();
  if (!token) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/user_profiles?id=eq.${userId}&select=*`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

export async function getAllProfiles() {
  const token = await getAuthToken();
  if (!token) return [];
  const res = await fetch(
    `${SB_URL}/rest/v1/user_profiles?select=id,email,full_name,active_role,avatar_color&order=full_name`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  return await res.json();
}

/* ── Audit trail ────────────────────────────────────────────── */
// Call this after any CRM write.
// action:      'upsert' | 'delete'
// entity_type: 'company' | 'contact' | 'audience' | 'relation' | 'intelligence'
// entity_id:   slug or id
// entity_name: display name
// diff:        { before, after } — optional, pass null if not available

export async function logActivity({ action, entity_type, entity_id, entity_name, diff = null }) {
  try {
    const token = await getAuthToken();
    if (!token) return;   // not logged in — skip silently
    const user = await getCurrentUser();
    if (!user) return;

    await fetch(`${SB_URL}/rest/v1/activity_log`, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        user_id:     user.id,
        user_email:  user.email,
        action,
        entity_type,
        entity_id,
        entity_name,
        diff,
        created_at:  new Date().toISOString(),
      })
    });
  } catch (_) {
    // audit trail failures are silent — never break the main flow
  }
}

/* ── Login screen ───────────────────────────────────────────── */

let _otpEmail = '';   // holds email between step 1 and step 2

export function renderLoginScreen() {
  const app = document.querySelector('.app');
  if (app) app.style.display = 'none';

  let el = document.getElementById('oaLoginScreen');
  if (!el) {
    el = document.createElement('div');
    el.id = 'oaLoginScreen';
    document.body.appendChild(el);
  }
  el.style.display = 'flex';
  _renderStep1(el);
}

function _renderStep1(el) {
  _otpEmail = '';
  el.innerHTML = `
<style>
#oaLoginScreen{position:fixed;inset:0;z-index:99998;background:var(--bg);display:flex;align-items:center;justify-content:center;}
.oa-lb{background:var(--surf);border:1px solid var(--rule);border-radius:4px;padding:32px 36px;width:340px;box-shadow:var(--sh);}
.oa-ll{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:12px;background:var(--g);color:#fff;width:32px;height:32px;border-radius:2px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
.oa-lt{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:var(--t1);text-align:center;margin-bottom:4px;}
.oa-ls{font-family:'IBM Plex Sans',sans-serif;font-size:11px;color:var(--t3);text-align:center;margin-bottom:24px;line-height:1.5;}
.oa-lbl{font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);display:block;margin-bottom:4px;margin-top:14px;}
.oa-inp{width:100%;height:36px;padding:0 10px;border:1px solid var(--rule);border-radius:2px;font-family:'IBM Plex Mono',monospace;font-size:11px;background:var(--surf2);color:var(--t1);outline:none;transition:border-color .15s;box-sizing:border-box;}
.oa-inp:focus{border-color:var(--g);}
.oa-inp::placeholder{color:var(--t4);}
.oa-btn{width:100%;height:38px;margin-top:18px;border:none;border-radius:2px;background:var(--g);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:background .15s;}
.oa-btn:hover{background:var(--gd);}
.oa-btn:disabled{background:var(--surf4);color:var(--t3);cursor:default;}
.oa-err{font-family:'IBM Plex Mono',monospace;font-size:8px;color:#F87171;text-align:center;margin-top:10px;min-height:14px;}
.oa-ver{font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--t4);text-align:center;margin-top:18px;letter-spacing:.04em;}
.oa-otp{width:100%;height:48px;padding:0 10px;border:1px solid var(--rule);border-radius:2px;font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:600;letter-spacing:.25em;text-align:center;background:var(--surf2);color:var(--t1);outline:none;transition:border-color .15s;box-sizing:border-box;}
.oa-otp:focus{border-color:var(--g);}
.oa-back{font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--t3);text-align:center;margin-top:12px;cursor:pointer;text-decoration:underline;}
.oa-back:hover{color:var(--t1);}
</style>
<div class="oa-lb">
  <div class="oa-ll">oA</div>
  <div class="oa-lt">Sales Intelligence Hub</div>
  <div class="oa-ls">Enter your email to receive a one-time login code.</div>
  <label class="oa-lbl">Work email</label>
  <input id="oa-email" class="oa-inp" type="email" placeholder="you@onaudience.com" autocomplete="email"/>
  <button class="oa-btn" id="oa-send-btn" onclick="oaSendOTP()">Send code →</button>
  <div class="oa-err" id="oa-err"></div>
  <div class="oa-ver">Hub v2.3 · onAudience</div>
</div>`;

  setTimeout(() => document.getElementById('oa-email')?.focus(), 80);
  document.getElementById('oa-email')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.oaSendOTP?.();
  });
}

function _renderStep2(el, email) {
  el.innerHTML = `
<div class="oa-lb">
  <div class="oa-ll">oA</div>
  <div class="oa-lt">Check your email</div>
  <div class="oa-ls">We sent a 6-digit code to<br><b style="color:var(--t1);font-family:'IBM Plex Mono',monospace">${email}</b><br><br>Enter it below. Expires in 10 minutes.</div>
  <label class="oa-lbl">One-time code</label>
  <input id="oa-otp" class="oa-otp" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000" autocomplete="one-time-code"/>
  <button class="oa-btn" id="oa-verify-btn" onclick="oaVerifyOTP()">Verify →</button>
  <div class="oa-err" id="oa-err"></div>
  <div class="oa-back" onclick="oaBackToEmail()">← Use a different email</div>
</div>`;

  setTimeout(() => document.getElementById('oa-otp')?.focus(), 80);
  document.getElementById('oa-otp')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.oaVerifyOTP?.();
  });
  // Auto-submit when 6 digits entered
  document.getElementById('oa-otp')?.addEventListener('input', e => {
    if (e.target.value.replace(/\D/g,'').length === 6) window.oaVerifyOTP?.();
  });
}

export function hideLoginScreen() {
  const el = document.getElementById('oaLoginScreen');
  if (el) el.style.display = 'none';
  const app = document.querySelector('.app');
  if (app) app.style.display = '';
}

/* ── Login actions (called from window) ─────────────────────── */

export async function doSendOTP() {
  const email = document.getElementById('oa-email')?.value?.trim();
  const btn   = document.getElementById('oa-send-btn');
  const err   = document.getElementById('oa-err');
  if (!email) { if (err) err.textContent = 'Enter your email'; return; }
  if (btn)  { btn.disabled = true; btn.textContent = 'Sending…'; }
  if (err)  err.textContent = '';
  try {
    await sendOTP(email);
    _otpEmail = email;
    const el = document.getElementById('oaLoginScreen');
    if (el) _renderStep2(el, email);
  } catch (e) {
    if (err) err.textContent = e.message || 'Failed to send code';
    if (btn) { btn.disabled = false; btn.textContent = 'Send code →'; }
  }
}

export async function doVerifyOTP() {
  const token = (document.getElementById('oa-otp')?.value || '').replace(/\D/g, '').slice(0, 6);
  const btn   = document.getElementById('oa-verify-btn');
  const err   = document.getElementById('oa-err');
  if (token.length < 6) { if (err) err.textContent = 'Enter the 6-digit code'; return; }
  if (btn) { btn.disabled = true; btn.textContent = 'Verifying…'; }
  if (err) err.textContent = '';
  try {
    await verifyOTP(_otpEmail, token);
    // onAuthStateChange SIGNED_IN fires → hub boots
  } catch (e) {
    if (err) err.textContent = e.message || 'Invalid or expired code';
    if (btn) { btn.disabled = false; btn.textContent = 'Verify →'; }
  }
}

export function doBackToEmail() {
  const el = document.getElementById('oaLoginScreen');
  if (el) _renderStep1(el);
}

/* ── Nav user badge ─────────────────────────────────────────── */

export function renderUserBadge(profile) {
  const el = document.getElementById('nav-user-badge');
  if (!el || !profile) return;
  const initials = (profile.full_name || profile.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const color = profile.avatar_color || 'var(--g)';
  el.innerHTML = `<span
    style="font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:600;
           background:${color};color:#fff;width:24px;height:24px;border-radius:2px;
           display:inline-flex;align-items:center;justify-content:center;
           cursor:pointer;flex-shrink:0;letter-spacing:.04em"
    title="${profile.full_name || profile.email} · ${profile.active_role} · click to sign out"
    onclick="oaSignOut()">${initials}</span>`;
}
