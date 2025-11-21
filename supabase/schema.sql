-- Create table for storing ad templates
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ad_templates_industry ON ad_templates USING GIN(industry);
CREATE INDEX IF NOT EXISTS idx_ad_templates_type ON ad_templates(type);
CREATE INDEX IF NOT EXISTS idx_ad_templates_ratio ON ad_templates(ratio);
CREATE INDEX IF NOT EXISTS idx_ad_templates_last_synced ON ad_templates(last_synced_at DESC);

-- Create function to update updated_at timestamp
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

-- Create table for cron job logs
CREATE TABLE IF NOT EXISTS cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  total_ads_processed INTEGER DEFAULT 0,
  total_pages_processed INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

-- Create index for cron job logs
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_started_at ON cron_job_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_status ON cron_job_logs(status);

