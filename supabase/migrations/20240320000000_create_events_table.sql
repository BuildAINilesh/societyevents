-- Create enum for event types
CREATE TYPE event_type AS ENUM (
  'CULTURAL',
  'FITNESS',
  'SOCIAL',
  'EXHIBITION',
  'WORKSHOP'
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  registered_count INTEGER DEFAULT 0 CHECK (registered_count >= 0),
  price DECIMAL(10,2) DEFAULT 0 CHECK (price >= 0),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  type event_type NOT NULL,
  stalls_available INTEGER DEFAULT 0 CHECK (stalls_available >= 0),
  stalls_booked INTEGER DEFAULT 0 CHECK (stalls_booked >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add indexes for better query performance
CREATE INDEX events_society_id_idx ON events(society_id);
CREATE INDEX events_type_idx ON events(type);
CREATE INDEX events_start_date_idx ON events(start_date);
CREATE INDEX events_end_date_idx ON events(end_date);

-- Add RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for viewing events (anyone can view)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

-- Policy for inserting events (authenticated users only)
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for updating events (only the creator or society admin)
CREATE POLICY "Creator or society admin can update events"
  ON events FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM societies
      WHERE societies.id = events.society_id
      AND societies.admin_id = auth.uid()
    )
  );

-- Policy for deleting events (only the creator or society admin)
CREATE POLICY "Creator or society admin can delete events"
  ON events FOR DELETE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM societies
      WHERE societies.id = events.society_id
      AND societies.admin_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 