CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exemple de données à insérer (facultatif)
INSERT INTO public.products (name, description, price, image_url) VALUES
('Vokatra 1', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra.', 25000.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06f2ae?fit=crop&w=400&h=300'),
('Vokatra 2', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra. Misy loko sy habe samihafa.', 50000.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?fit=crop&w=400&h=300'),
('Vokatra 3', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra. Misy loko sy habe samihafa.', 15000.00, 'https://images.unsplash.com/photo-1526178613543-cca577d6118d?fit=crop&w=400&h=300'),
('Vokatra 4', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra. Misy loko sy habe samihafa.', 30000.00, 'https://images.unsplash.com/photo-1585386959984-a4155225270d?fit=crop&w=400&h=300'),
('Vokatra 5', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra. Misy loko sy habe samihafa.', 45000.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?fit=crop&w=400&h=300'),
('Vokatra 6', 'Famaritana fohy momba ilay vokatra. Tsara kalitao sy maharitra. Misy loko sy habe samihafa.', 20000.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?fit=crop&w=400&h=300');

-- RLS Policy pour permettre la lecture à tout le monde
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);
