-- ==============================================================================
-- SCHEMA SQL DE SUPABASE - KAL DISCOBAR
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase
-- ==============================================================================

-- 1. Tabla de Estado del Sistema y Configuraciones Generales
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  subscription_status TEXT DEFAULT 'active', -- 'active' | 'unpaid'
  loading_screen_enabled BOOLEAN DEFAULT true,
  admin_theme TEXT DEFAULT 'kall-dark',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO system_settings (id, subscription_status, loading_screen_enabled, admin_theme)
VALUES ('global', 'active', true, 'kall-dark')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Platos y Artículos de la Carta
CREATE TABLE IF NOT EXISTS dishes (
  id TEXT PRIMARY KEY,
  name_es TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  price_cop NUMERIC NOT NULL,
  description_es TEXT,
  description_en TEXT,
  image TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_es TEXT NOT NULL,
  name_en TEXT,
  subtitle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla de Comandas / Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_num TEXT NOT NULL,
  table_id TEXT NOT NULL,
  type TEXT DEFAULT 'table', -- 'table' | 'pickup'
  customer_name TEXT,
  phone TEXT,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_cop NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending' | 'preparing' | 'served' | 'billed'
  payment_method TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabla de Sesiones de Mesa
CREATE TABLE IF NOT EXISTS table_sessions (
  table_id TEXT PRIMARY KEY,
  is_active BOOLEAN DEFAULT false,
  orders JSONB DEFAULT '[]'::jsonb,
  total_cop NUMERIC DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Tabla de Cierres de Caja (Historial Contable)
CREATE TABLE IF NOT EXISTS cash_closes (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  opened_at TIMESTAMP WITH TIME ZONE,
  initial_float NUMERIC DEFAULT 200000,
  total_sales NUMERIC DEFAULT 0,
  total_cash NUMERIC DEFAULT 0,
  total_digital NUMERIC DEFAULT 0,
  total_bancolombia NUMERIC DEFAULT 0,
  total_nequi NUMERIC DEFAULT 0,
  total_daviplata NUMERIC DEFAULT 0,
  total_datafono NUMERIC DEFAULT 0,
  total_wompi NUMERIC DEFAULT 0,
  total_orders_count INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'closed' -- 'closed' | 'reopened'
);

-- 7. Tabla de Reservas VIP
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  table_requested TEXT,
  event_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- Permite lectura pública a la carta y operaciones de comanda
-- ==============================================================================

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_closes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública
CREATE POLICY "Lectura pública system_settings" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Lectura pública dishes" ON dishes FOR SELECT USING (true);
CREATE POLICY "Lectura pública categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Lectura pública orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Lectura pública table_sessions" ON table_sessions FOR SELECT USING (true);
CREATE POLICY "Lectura pública cash_closes" ON cash_closes FOR SELECT USING (true);
CREATE POLICY "Lectura pública reservations" ON reservations FOR SELECT USING (true);

-- Políticas de Escritura (Inserción / Actualización)
CREATE POLICY "Escritura pública orders" ON orders FOR ALL USING (true);
CREATE POLICY "Escritura pública reservations" ON reservations FOR ALL USING (true);
CREATE POLICY "Escritura pública table_sessions" ON table_sessions FOR ALL USING (true);
CREATE POLICY "Escritura pública system_settings" ON system_settings FOR ALL USING (true);
CREATE POLICY "Escritura pública dishes" ON dishes FOR ALL USING (true);
CREATE POLICY "Escritura pública categories" ON categories FOR ALL USING (true);
CREATE POLICY "Escritura pública cash_closes" ON cash_closes FOR ALL USING (true);
