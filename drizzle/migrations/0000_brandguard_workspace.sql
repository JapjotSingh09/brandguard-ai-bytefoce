CREATE TABLE public.brand_rules (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category text NOT NULL, name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120), pattern text NOT NULL DEFAULT '', replacement text NOT NULL DEFAULT '', severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('critical','warning','info')), explanation text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.brand_rules TO anon,authenticated; GRANT ALL ON public.brand_rules TO service_role;
ALTER TABLE public.brand_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo rules" ON public.brand_rules FOR ALL TO anon,authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.content_submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160), content_type text NOT NULL, content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 50000), status text NOT NULL DEFAULT 'Awaiting review' CHECK (status IN ('Awaiting review','Approved','Rejected','Changes requested')), issues jsonb NOT NULL DEFAULT '[]', rules_snapshot jsonb NOT NULL DEFAULT '[]', reviewer text NOT NULL DEFAULT '', comments text NOT NULL DEFAULT '', reviewed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE ON public.content_submissions TO anon,authenticated; GRANT ALL ON public.content_submissions TO service_role;
ALTER TABLE public.content_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo submissions read" ON public.content_submissions FOR SELECT TO anon,authenticated USING (true);
CREATE POLICY "Public demo submissions create" ON public.content_submissions FOR INSERT TO anon,authenticated WITH CHECK (true);
CREATE POLICY "Public demo submissions review" ON public.content_submissions FOR UPDATE TO anon,authenticated USING (true) WITH CHECK (true);
INSERT INTO public.brand_rules (category,name,pattern,replacement,severity,explanation) VALUES
('Prohibited phrases','Avoid absolute guarantees','guaranteed','designed to','critical','Do not promise guaranteed outcomes.'),
('Approved terminology','Use the official company name','Nova Tech','NovaTech','warning','Our company name is always written as NovaTech.'),
('Approved facts','Company founding year','founded in 2015','founded in 2018','critical','NovaTech was founded in 2018.'),
('Required disclaimers','Product availability disclaimer','','Product availability may vary by region.','warning','Include the availability disclaimer in all marketing content.'),
('Visual identity','Primary brand colours','','Navy #14253D · Blue #3366FF','info','Use the approved navy and blue palette. Visual rules require human review.'),
('Logo guidelines','Protect the NovaTech logo','','Maintain clear space equal to the height of the N.','info','Do not distort or recolour the logo. Logo rules require human review.');
INSERT INTO public.content_submissions (title,content_type,content,status,reviewer,comments,reviewed_at) VALUES
('Meet NovaTech: a smarter way to work','Social Media Post','Meet NovaTech. Built for teams that move ideas forward. Product availability may vary by region.','Approved','Demo reviewer','Approved sample content.',now()),
('November product newsletter','Email','Discover NovaTech, founded in 2018. Product availability may vary by region.','Approved','Demo reviewer','Brand terminology and facts verified.',now()),
('NovaTech product overview','Document','NovaTech helps teams collaborate. Product availability may vary by region.','Awaiting review','','',null),
('Autumn campaign headline','Advertisement','NovaTech delivers guaranteed results. Product availability may vary by region.','Rejected','Demo reviewer','Absolute guarantees are not permitted.',now());