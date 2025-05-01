-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    image TEXT,
    capacity INTEGER NOT NULL,
    registered_count INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    venue_id UUID NOT NULL REFERENCES venues(id),
    type TEXT NOT NULL CHECK (type IN ('CULTURAL', 'FITNESS', 'SOCIAL', 'EXHIBITION', 'WORKSHOP')),
    stalls_available INTEGER DEFAULT 0,
    stalls_booked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
);

-- Add indexes for better query performance
CREATE INDEX events_society_id_idx ON events(venue_id);
CREATE INDEX events_type_idx ON events(type);
CREATE INDEX events_start_date_idx ON events(start_date);
CREATE INDEX events_end_date_idx ON events(end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 