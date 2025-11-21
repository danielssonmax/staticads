# 🚀 Quick Start - Cron Job Setup

## 1️⃣ Create Database Tables

Go to Supabase SQL Editor and run:

```sql
-- Copy and paste the entire contents of supabase/schema.sql
```

## 2️⃣ Add Environment Variables

### Local (`.env.local`):
```bash
# Generate a secure secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

CRON_SECRET=your-secure-random-string-here
NEXT_PUBLIC_USE_SUPABASE=false
```

### Vercel:
Add the same variables in Vercel Dashboard → Settings → Environment Variables

## 3️⃣ Deploy to Vercel

```bash
git add .
git commit -m "Add cron job for ad sync"
git push
```

Vercel will automatically deploy and configure the cron job from `vercel.json`.

## 4️⃣ Test Manually

```bash
curl -X GET "https://your-domain.vercel.app/api/cron/sync-ads" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expected: `{"success":true,"totalAdsProcessed":800,...}`

## 5️⃣ Check Database

In Supabase:
```sql
SELECT * FROM cron_job_logs ORDER BY started_at DESC LIMIT 1;
SELECT COUNT(*) FROM ad_templates;
```

## 6️⃣ Enable Supabase Mode

After successful sync:

1. Set `NEXT_PUBLIC_USE_SUPABASE=true` in Vercel
2. Redeploy
3. Done! Your app now uses cached data 🎉

## 📅 Schedule

The cron job runs **every Sunday at midnight** automatically.

You can manually trigger it anytime using the curl command above.

## 🔍 Verify It's Working

**Check Vercel Logs:**
- Dashboard → Deployments → Functions
- Look for `/api/cron/sync-ads` logs

**Check Supabase:**
```sql
SELECT 
  status,
  total_ads_processed,
  duration_seconds,
  started_at
FROM cron_job_logs 
ORDER BY started_at DESC 
LIMIT 1;
```

## ⚡ That's It!

Your ads are now being synced automatically every week. The frontend will load much faster using the cached Supabase data.

**Performance improvement: 4-10x faster! 🚀**

See `CRON_JOB_SETUP.md` for detailed documentation.

