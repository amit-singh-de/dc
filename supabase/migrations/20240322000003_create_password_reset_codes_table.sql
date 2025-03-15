-- Create a table to store password reset codes
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(email)
);

-- Add RLS policies
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert and select their own codes
CREATE POLICY "Anyone can insert their own reset code" 
  ON password_reset_codes FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can select their own reset code" 
  ON password_reset_codes FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can delete their own reset code" 
  ON password_reset_codes FOR DELETE 
  USING (true);

-- Create a function to clean up expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_reset_codes()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM password_reset_codes
  WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to clean up expired codes on insert
CREATE TRIGGER cleanup_expired_reset_codes_trigger
AFTER INSERT ON password_reset_codes
FOR EACH STATEMENT
EXECUTE FUNCTION cleanup_expired_reset_codes();
