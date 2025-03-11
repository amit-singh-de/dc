-- Create a users table to track additional user information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_sign_in TIMESTAMP WITH TIME ZONE,
  password_history JSONB DEFAULT '[]'::jsonb
);

-- Create a function to automatically add new users to our users table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call this function whenever a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to check if email already exists
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  email_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = email_to_check
  ) INTO email_exists;
  
  RETURN email_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to track password history
CREATE OR REPLACE FUNCTION public.track_password_change() 
RETURNS TRIGGER AS $$
BEGIN
  -- Store the hashed password in the password history
  UPDATE public.users
  SET 
    password_history = password_history || jsonb_build_object('password', new.encrypted_password, 'changed_at', now()),
    updated_at = now()
  WHERE id = new.id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for password changes
DROP TRIGGER IF EXISTS on_password_change ON auth.users;
CREATE TRIGGER on_password_change
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.track_password_change();

-- Create a function to update last sign in time
CREATE OR REPLACE FUNCTION public.update_last_sign_in() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET last_sign_in = now()
  WHERE id = new.user_id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for sign ins
DROP TRIGGER IF EXISTS on_user_sign_in ON auth.sessions;
CREATE TRIGGER on_user_sign_in
  AFTER INSERT ON auth.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_last_sign_in();

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

alter publication supabase_realtime add table users;