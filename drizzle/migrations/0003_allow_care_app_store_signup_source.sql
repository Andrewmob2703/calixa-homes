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
    'build_start_your_build',
    'landing_app_store',
    'build_app_store',
    'about_app_store',
    'faqs_app_store',
    'contact_app_store',
    'care_app_store'
  )
);

COMMENT ON POLICY "Anyone can join the waitlist" ON public.app_waitlist IS
'Public launch notifications accept only bounded, trimmed email addresses and supported signup sources; client inserts are limited to email and source.';