-- Create a function to send password reset emails
CREATE OR REPLACE FUNCTION send_password_reset_email(email_address TEXT, reset_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find the user
  SELECT id INTO user_id FROM auth.users WHERE email = email_address;
  
  -- If user exists, send the email
  IF user_id IS NOT NULL THEN
    -- Insert into password_reset_codes table
    INSERT INTO password_reset_codes (user_id, email, code, expires_at)
    VALUES (user_id, email_address, reset_code, NOW() + INTERVAL '1 hour')
    ON CONFLICT (email) 
    DO UPDATE SET 
      code = reset_code,
      expires_at = NOW() + INTERVAL '1 hour',
      created_at = NOW();
      
    -- In a real implementation, this would trigger an email send
    -- For now, we'll just return success
    RETURN TRUE;
  END IF;
  
  -- Return true even if user doesn't exist (for security)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create password_reset_codes table
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Create a function to verify reset codes
CREATE OR REPLACE FUNCTION verify_reset_code(email_address TEXT, reset_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Find the reset code
  SELECT * INTO code_record 
  FROM password_reset_codes 
  WHERE email = email_address AND code = reset_code;
  
  -- Check if code exists and is valid
  IF code_record.id IS NOT NULL AND code_record.expires_at > NOW() AND NOT code_record.used THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to reset password with code
CREATE OR REPLACE FUNCTION reset_password_with_code(email_address TEXT, reset_code TEXT, new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
  user_id UUID;
BEGIN
  -- Verify the code first
  IF NOT verify_reset_code(email_address, reset_code) THEN
    RETURN FALSE;
  END IF;
  
  -- Get the user ID
  SELECT id INTO user_id FROM auth.users WHERE email = email_address;
  
  -- Mark the code as used
  UPDATE password_reset_codes 
  SET used = TRUE 
  WHERE email = email_address AND code = reset_code;
  
  -- In a real implementation, this would update the user's password
  -- For now, we'll just return success
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;