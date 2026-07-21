CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_path VARCHAR(255), -- Chemin vers l'image dans le storage Supabase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy pour permettre la lecture à tout le monde
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);

-- RLS Policy pour permettre l'insertion de produits (à n'autoriser que pour l'admin si nécessaire)
-- Pour un usage simple avec un code d'activation, on peut laisser `true` ici.
-- Si vous avez un système d'authentification admin plus robuste, adaptez la condition.
CREATE POLICY "Allow products to be inserted by authenticated users" ON public.products FOR INSERT WITH CHECK (true);

-- Pour l'upload d'images, vous devez créer un bucket de stockage dans Supabase:
-- Nom du bucket: product_images
-- Et définir une politique de sécurité (Policy) pour ce bucket:
-- 1. Pour permettre l'UPLOAD (insertion) d'images par l'admin via le script:
--    Nom: "Allow admin to upload product images"
--    Opérations: insert
--    Utiliser une expression: (bucket_id = 'product_images')
--    (Vous pourriez restreindre davantage si l'admin est authentifié via Supabase Auth)

-- 2. Pour permettre la LECTURE (accès public) aux images uploadées:
--    Nom: "Allow public access to product images"
--    Opérations: select
--    Utiliser une expression: (bucket_id = 'product_images')
