-- Create tables for SEO Analyzer

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  domain VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  total_issues INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  warning_issues INTEGER DEFAULT 0,
  info_issues INTEGER DEFAULT 0,
  score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Audit Issues table
CREATE TABLE IF NOT EXISTS audit_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  affected_pages INTEGER,
  recommendation TEXT,
  how_to_fix TEXT,
  priority INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  search_volume INTEGER,
  difficulty DECIMAL(5,2),
  current_rank INTEGER,
  previous_rank INTEGER,
  url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_checked TIMESTAMP
);

-- Keyword Rankings table
CREATE TABLE IF NOT EXISTS keyword_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  rank INTEGER,
  search_volume INTEGER,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  report_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'generating',
  file_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_audits_website_id ON audits(website_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audit_issues_audit_id ON audit_issues(audit_id);
CREATE INDEX idx_audit_issues_type ON audit_issues(type);
CREATE INDEX idx_keywords_website_id ON keywords(website_id);
CREATE INDEX idx_keywords_ranking ON keywords(current_rank);
CREATE INDEX idx_keyword_rankings_keyword_id ON keyword_rankings(keyword_id);
CREATE INDEX idx_reports_audit_id ON reports(audit_id);
CREATE INDEX idx_reports_status ON reports(status);
