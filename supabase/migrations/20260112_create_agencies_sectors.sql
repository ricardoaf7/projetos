-- Create agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert initial default data
INSERT INTO agencies (name) VALUES 
('Prefeitura'), 
('Estado'), 
('Governo Federal'), 
('Empresa Privada')
ON CONFLICT (name) DO NOTHING;

INSERT INTO sectors (name) VALUES 
('Obras'), 
('Planejamento'), 
('Finanças'), 
('Jurídico'), 
('Meio Ambiente')
ON CONFLICT (name) DO NOTHING;
