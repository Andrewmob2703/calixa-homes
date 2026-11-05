CREATE TABLE public.app_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  source text NOT NULL DEFAULT 'care' CHECK (char_length(source) <= 50),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.app_waitlist TO anon, authenticated;
GRANT ALL ON public.app_waitlist TO service_role;
ALTER TABLE public.app_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.app_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);