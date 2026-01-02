/*
  # Create register_user_profile RPC

  1. Purpose
    - Safely register/update user profile in public.users table
    - Bypasses RLS policies using SECURITY DEFINER
    - Handles both new user registration and existing user updates

  2. Function Details
    - Name: register_user_profile
    - Parameters:
      - p_name (text): User's full name
      - p_phone (text): User's phone number (without +91 prefix)
    - Returns: void
    - Security: DEFINER (runs with creator's privileges, bypassing RLS)

  3. Behavior
    - Uses auth.uid() to get authenticated user ID
    - Inserts new user or updates existing user
    - Sets default values: is_active=true, content_access=true
    - Updates last_login_at timestamp

  4. Safety
    - Only authenticated users can call this (auth.uid() must exist)
    - Prevents RLS-related silent failures during registration
    - Atomic upsert operation
*/

CREATE OR REPLACE FUNCTION public.register_user_profile(
  p_name text,
  p_phone text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    phone,
    name,
    is_active,
    content_access,
    last_login_at
  )
  VALUES (
    auth.uid(),
    p_phone,
    p_name,
    true,
    true,
    now()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    is_active = true,
    content_access = true,
    last_login_at = now();
END;
$$;