ALTER TABLE public.user_settings
ADD COLUMN ai_reviews_used integer NOT NULL DEFAULT 0,
ADD COLUMN ai_reviews_reset_at timestamptz NOT NULL DEFAULT now();