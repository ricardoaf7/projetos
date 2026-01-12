-- Add status column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'ARCHIVE'
  entity TEXT NOT NULL, -- 'PROJECT', 'STEP', 'AGENCY', 'SECTOR'
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
  -- user_id UUID REFERENCES auth.users(id) -- Enable if auth is fully implemented
);

-- Create index for faster querying of logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Ensure cascade delete for steps when a project is deleted
-- Note: This requires dropping the existing constraint first if it wasn't created with CASCADE
-- This block attempts to update the constraint safely
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'project_steps_project_id_fkey' AND table_name = 'project_steps'
  ) THEN
    ALTER TABLE project_steps DROP CONSTRAINT project_steps_project_id_fkey;
    ALTER TABLE project_steps 
      ADD CONSTRAINT project_steps_project_id_fkey 
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;
