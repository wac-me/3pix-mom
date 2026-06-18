CREATE POLICY "Public can view blog covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated can upload blog covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated can update blog covers"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated can delete blog covers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-covers');