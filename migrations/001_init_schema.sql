-- 🚀 SUPABASE MIGRATION: 001_init_schema.sql
-- Generated for porto-online | Full Stack Portfolio
-- Run with: supabase db push (locally) or via Supabase SQL Editor

-- 🔐 Enable RLS on all tables by default
SET LOCAL "app.settings.disable_rls" = 'false';

-- 🧑‍💼 profiles: Developer profile & availability status
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  is_available BOOLEAN DEFAULT true,
  total_projects INT DEFAULT 0,
  total_skills INT DEFAULT 0,
  total_visitors INT DEFAULT 0
);

-- 📁 projects: Portfolio projects with category & tech stack
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  live_url TEXT,
  github_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('web', 'mobile', 'backend', 'tooling', 'open-source')),
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN DEFAULT false
);

-- ⚙️ skills: Interactive skill cards with categories & proficiency
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'language', 'tools')),
  proficiency_percent INT CHECK (proficiency_percent BETWEEN 0 AND 100) DEFAULT 85,
  icon_name TEXT -- e.g., 'React', 'PostgreSQL', 'TypeScript'
);

-- 📅 experiences: Timeline entries with role & company
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  year_start INT NOT NULL,
  year_end INT,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  is_current BOOLEAN DEFAULT false
);

-- ✉️ contact_messages: Securely stored contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT
);

-- 👥 visitor_sessions: Realtime visitor counter & analytics
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT NOT NULL,
  page_path TEXT DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  country_code CHAR(2)
);

-- ⚙️ site_settings: Global config (status, maintenance, SEO)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT
);

-- 📌 INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON visitor_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);

-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- profiles: readable by all, editable only by owner or admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_readable_by_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_editable_by_owner_or_admin" ON profiles FOR UPDATE USING (
  auth.uid() = id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ','))))
);

-- projects: readable by all, editable only by admin
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_readable_by_all" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_editable_by_admin_only" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- skills: same as projects
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills_readable_by_all" ON skills FOR SELECT USING (true);
CREATE POLICY "skills_editable_by_admin_only" ON skills FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- experiences: same as projects
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experiences_readable_by_all" ON experiences FOR SELECT USING (true);
CREATE POLICY "experiences_editable_by_admin_only" ON experiences FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- contact_messages: insertable by anyone, readable/editable only by admin
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_insertable_by_all" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_readable_by_admin_only" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);
CREATE POLICY "contact_messages_updatable_by_admin_only" ON contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- visitor_sessions: insertable by all, readable only by admin
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visitor_sessions_insertable_by_all" ON visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "visitor_sessions_readable_by_admin_only" ON visitor_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- site_settings: readable by all, editable only by admin
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_readable_by_all" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_editable_by_admin_only" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.email = ANY(string_to_array(current_setting('app.settings.admin_emails', true), ',')))
);

-- 🌟 INSERT DEFAULT PROFILE & SETTINGS (safe for first deploy)
INSERT INTO profiles (full_name, title, bio, email, is_available)
SELECT 'Traya Putra', 'Full Stack Developer', 'Building modern, interactive, and secure web applications.', 'traya@example.com', true
WHERE NOT EXISTS (SELECT 1 FROM profiles);

INSERT INTO site_settings (key, value, description)
SELECT 'site_status', '{"maintenance": false, "message": ""}', 'Global site status'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'site_status');

-- ✅ Migration complete. Run `supabase db push` to apply.