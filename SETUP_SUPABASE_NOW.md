# 🎯 Supabase Setup - Copy & Paste Guide

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Copy This ENTIRE Block and Paste It

```sql
-- ========================================
-- AD TEMPLATES TABLE
-- ========================================

-- Create the main table for storing ad templates
CREATE TABLE IF NOT EXISTS ad_templates (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  canva_url TEXT,
  industry TEXT[],
  type TEXT,
  ratio TEXT,
  format TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ad_templates_industry ON ad_templates USING GIN(industry);
CREATE INDEX IF NOT EXISTS idx_ad_templates_type ON ad_templates(type);
CREATE INDEX IF NOT EXISTS idx_ad_templates_ratio ON ad_templates(ratio);
CREATE INDEX IF NOT EXISTS idx_ad_templates_last_synced ON ad_templates(last_synced_at DESC);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_ad_templates_updated_at ON ad_templates;
CREATE TRIGGER update_ad_templates_updated_at
    BEFORE UPDATE ON ad_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- CRON JOB LOGS TABLE
-- ========================================

-- Create table for tracking cron job execution
CREATE TABLE IF NOT EXISTS cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL,
  total_ads_processed INTEGER DEFAULT 0,
  total_pages_processed INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

-- Create indexes for cron job logs
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_started_at ON cron_job_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_status ON cron_job_logs(status);

-- ========================================
-- DONE! ✅
-- ========================================

SELECT 'Tables created successfully! ✅' as status;
```

## Step 3: Click "Run" Button

That's it! You should see: `Tables created successfully! ✅`

## Step 4: Verify It Worked

Run this query to check:

```sql
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('ad_templates', 'cron_job_logs');
```

You should see both tables listed.

---

## Next: Add Environment Variables

Add this to your Vercel Dashboard → Settings → Environment Variables:

```bash
CRON_SECRET=paste-this-value-here
```

**Generate CRON_SECRET here:** https://generate-secret.vercel.app/32

Or run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Also add:
```bash
NEXT_PUBLIC_USE_SUPABASE=false
```

(We'll change this to `true` after the first sync)

---

## That's All! 🎉

Your database is now ready. Deploy to Vercel and the cron job will work automatically!

