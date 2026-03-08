
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS theme text DEFAULT 'default';
ALTER TABLE public.areas ADD COLUMN IF NOT EXISTS theme text DEFAULT NULL;
