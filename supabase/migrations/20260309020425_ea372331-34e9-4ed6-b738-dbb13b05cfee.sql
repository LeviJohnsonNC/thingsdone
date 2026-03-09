
-- Add checklist and recurrence_rule to items
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS recurrence_rule text DEFAULT NULL;

-- Add desired_outcome to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS desired_outcome text DEFAULT NULL;
