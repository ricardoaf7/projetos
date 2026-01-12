-- Migration to add new fields to project_steps table

ALTER TABLE project_steps
ADD COLUMN IF NOT EXISTS responsible_agency TEXT,
ADD COLUMN IF NOT EXISTS responsible_sector TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS completion_forecast DATE;

-- Create indexes for new columns if needed for filtering
CREATE INDEX IF NOT EXISTS idx_project_steps_start_date ON project_steps(start_date);
CREATE INDEX IF NOT EXISTS idx_project_steps_completion_forecast ON project_steps(completion_forecast);
