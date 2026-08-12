INSERT INTO public.profiles (user_id, email, name, role)
VALUES ('4f990582-50e8-47cf-8d47-6770f96c7512', 'mattis@avargo.no', 'Mattis', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;