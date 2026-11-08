REVOKE INSERT ON TABLE public.app_waitlist FROM anon, authenticated;
GRANT INSERT (email, source) ON TABLE public.app_waitlist TO anon, authenticated;
GRANT ALL ON TABLE public.app_waitlist TO service_role;

ALTER POLICY "Anyone can join the waitlist"
ON public.app_waitlist
TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 3 AND 255
  AND email = btrim(email)
  AND email ~ '^[^[:space:]@]+@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$'
  AND email NOT LIKE '%..%'
  AND source IN (
    'care',
    'find_a_pro',
    'provider',
    'landing_get_started',
    'build_get_started',
    'build_start_ordering',
    'build_track_project',
    'build_start_your_build'
  )
);

COMMENT ON POLICY "Anyone can join the waitlist" ON public.app_waitlist IS
'Public launch notifications accept only bounded, trimmed email addresses and supported signup sources; client inserts are limited to email and source.';