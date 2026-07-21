CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_path VARCHAR(255), -- Changé de image_url à image_path
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy pour permettre la lecture à tout le monde
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);

-- RLS Policy pour permettre l'insertion de produits (à ajuster si vous voulez restreindre l'accès à l'admin)
CREATE POLICY "Allow products to be inserted by authenticated users" ON public.products FOR INSERT WITH CHECK (true);

-- Pour l'upload d'images, vous devez créer un bucket de stockage dans Supabase:
-- Nom du bucket: product_images
-- Et définir une politique de sécurité (Policy) pour ce bucket:
-- Par exemple, pour permettre à tout le monde d'uploader (pour ce cas simple d'admin):
-- Nom: "Allow authenticated users to upload product images"
-- Opérations: insert
-- Utiliser une expression: (bucket_id = 'product_images')

-- Et pour permettre la lecture des images uploadées:
-- Nom: "Allow public access to product images"
-- Opérations: select
-- Utiliser une expression: (bucket_id = 'product_images')