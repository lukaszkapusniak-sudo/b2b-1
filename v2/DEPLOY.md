# Deployment Guide
# → https://lukaszkapusniak-sudo.github.io/b2b-1/

Auth method: **Google OAuth** — one click, no email config needed.

---

## Step 1 — Google Cloud: Create OAuth credentials

1. Go to https://console.cloud.google.com/
2. Create a new project → name it `onAudience Hub`
3. **APIs & Services → OAuth consent screen**
   - User type: **External** → App name: `onAudience Hub`
   - Add your email under **Test users** → Save
4. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs — add **exactly**:
     ```
     https://nyzkkqqjnkctcmxoirdj.supabase.co/auth/v1/callback
     ```
   - Click Create → copy **Client ID** and **Client Secret**

---

## Step 2 — Supabase: Enable Google provider

1. https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/auth/providers
   → Find **Google** → toggle ON → paste Client ID + Secret → Save

2. https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/auth/url-configuration
   → Add Redirect URL:
   ```
   https://lukaszkapusniak-sudo.github.io/b2b-1/
   ```
   (trailing slash matters) → Save

---

## Step 3 — Create GitHub repo

1. https://github.com/new
2. Name: `b2b-1` · Owner: `lukaszkapusniak-sudo` · **Public** · Create

---

## Step 4 — Push files

Unzip `onaudience_hub.zip`, open terminal there:

```bash
git init
git add .
git commit -m "initial deploy"
git branch -M main
git remote add origin https://github.com/lukaszkapusniak-sudo/b2b-1.git
git push -u origin main
```

Watch deploy: https://github.com/lukaszkapusniak-sudo/b2b-1/actions

Live at: **https://lukaszkapusniak-sudo.github.io/b2b-1/**

---

## Step 5 — Enable GitHub Pages (verify)

https://github.com/lukaszkapusniak-sudo/b2b-1/settings/pages
→ Source: branch **gh-pages** → Save if not already set

---

## Step 6 — First sign in + make yourself admin

1. Open https://lukaszkapusniak-sudo.github.io/b2b-1/
2. Click **Continue with Google** → sign in

Make yourself admin — run in https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/editor :

```sql
UPDATE user_profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);
```

Refresh → badge shows **⬡ admin**.

---

## Step 7 — Add teammates

Send them the URL. They sign in with Google. Then set their role:

```sql
-- Find their ID
SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- Set role
UPDATE user_profiles SET role = 'sales'  WHERE id = '<uuid>';
UPDATE user_profiles SET role = 'viewer' WHERE id = '<uuid>';
```

| Role | Access |
|---|---|
| **admin** ⬡ | Everything |
| **sales** ◈ | Own battlegrounds, read/write companies & contacts |
| **viewer** ◇ | Read only |

---

## Updates

```bash
cp /path/to/new/{index.html,hub.css,hub.js} .
git add -A && git commit -m "update" && git push
```

Live in ~60s.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `redirect_uri_mismatch` | Google Cloud redirect URI must be the Supabase callback, not the Pages URL |
| `Access blocked: not verified` | Add your email as a Test User in Google Cloud OAuth consent screen |
| DB error / 401 | Supabase Google provider not enabled, or Client ID/Secret wrong |
| 404 on Pages | Check Pages settings → branch must be `gh-pages` |

---

## Key URLs

| | URL |
|---|---|
| Hub | https://lukaszkapusniak-sudo.github.io/b2b-1/ |
| Supabase callback (→ Google Cloud) | `https://nyzkkqqjnkctcmxoirdj.supabase.co/auth/v1/callback` |
| Supabase Google provider | https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/auth/providers |
| Supabase redirect URLs | https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/auth/url-configuration |
| Supabase SQL editor | https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/editor |
| Google Cloud Console | https://console.cloud.google.com/ |
