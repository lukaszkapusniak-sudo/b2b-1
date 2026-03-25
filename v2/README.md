# onAudience — Sales Intelligence Hub

## Setup

1. **Create GitHub repo** — push this folder to `main` branch
2. **Enable GitHub Pages** — Settings → Pages → Source: `gh-pages` branch
3. **Supabase auth** — go to [Supabase Dashboard](https://supabase.com/dashboard/project/nyzkkqqjnkctcmxoirdj/auth/url-configuration) and add your GitHub Pages URL to **Redirect URLs**:
   ```
   https://YOUR_ORG.github.io/YOUR_REPO
   ```
4. **First user = admin** — sign in via magic link, then run in Supabase SQL editor:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users LIMIT 1);
   ```
5. **Add teammates** — they sign in with their email. You then set their role:
   ```sql
   UPDATE user_profiles SET role = 'sales' WHERE id = '<their-user-id>';
   -- roles: 'admin' | 'sales' | 'viewer'
   ```

## Roles

| Role | Access |
|---|---|
| `admin` | Full access to all data, all battlegrounds, user list |
| `sales` | Own battlegrounds, read/write companies & contacts |
| `viewer` | Read-only everything |

## Deploy

Push to `main` → GitHub Actions auto-deploys to `gh-pages` branch → live in ~60s.
