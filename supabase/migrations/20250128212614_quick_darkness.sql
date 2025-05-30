/*
  # Sample Blog Data

  1. Content
    - Add sample author
    - Add sample articles for each category
    
  2. Notes
    - All articles are set as published
    - Each article has realistic content
*/

-- Insert a sample author
INSERT INTO authors (id, name, bio, avatar_url) VALUES (
  'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
  'John Doe',
  'Senior Technology Writer with 10+ years of experience in software development and AI.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
);

-- Insert sample articles
INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author_id,
  category_id,
  published,
  published_at
) VALUES
-- Development Article
(
  'Modern Web Development Trends 2024',
  'modern-web-development-trends-2024',
  'Explore the latest trends shaping web development in 2024, from new frameworks to development methodologies.',
  E'The landscape of web development continues to evolve at a rapid pace. In 2024, we''re seeing several key trends that are reshaping how we build and deploy web applications.\n\nServerless Architecture\nServerless computing has moved beyond being just a buzzword. More developers are embracing serverless solutions for their applications, appreciating the scalability and cost-effectiveness these solutions offer.\n\nWeb Assembly\nWebAssembly is gaining significant traction, enabling high-performance code execution in browsers. This technology is particularly valuable for compute-intensive applications that previously couldn''t run effectively in browsers.\n\nMicro-Frontends\nThe micro-frontend architecture pattern continues to grow in popularity, allowing teams to build and deploy parts of their applications independently.',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
  (SELECT id FROM categories WHERE slug = 'development'),
  true,
  now()
),
-- AI Article
(
  'The Impact of Large Language Models on Software Development',
  'impact-llm-software-development',
  'How large language models are transforming the way we write and maintain code.',
  E'Large Language Models (LLMs) are revolutionizing software development in ways we couldn''t have imagined just a few years ago.\n\nCode Generation\nAI-powered code generation has become increasingly sophisticated, helping developers write boilerplate code faster and suggesting optimizations for existing code.\n\nCode Review\nLLMs are now capable of performing initial code reviews, identifying potential bugs, and suggesting improvements before human reviewers get involved.\n\nDocumentation\nAutomatic documentation generation has improved significantly, with AI systems capable of creating detailed and accurate documentation from codebases.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
  (SELECT id FROM categories WHERE slug = 'ai'),
  true,
  now()
),
-- No-Code Article
(
  'Building Complex Applications Without Code',
  'building-complex-applications-without-code',
  'Discover how no-code platforms are enabling non-developers to create sophisticated applications.',
  E'No-code development platforms have matured significantly, enabling the creation of complex applications without traditional programming.\n\nVisual Development\nModern no-code platforms offer sophisticated visual development environments that can handle complex business logic and data relationships.\n\nIntegration Capabilities\nNo-code tools now offer robust integration capabilities, allowing connections with various APIs and services without coding.\n\nScalability\nMany no-code platforms now generate optimized code behind the scenes, ensuring applications can scale effectively.',
  'https://images.unsplash.com/photo-1551434678-e076c223a692',
  'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
  (SELECT id FROM categories WHERE slug = 'no-code'),
  true,
  now()
),
-- Low-Code Article
(
  'The Rise of Low-Code Development Platforms',
  'rise-of-low-code-development',
  'How low-code platforms are bridging the gap between traditional development and no-code solutions.',
  E'Low-code development platforms are becoming increasingly popular as organizations seek to accelerate their development processes while maintaining flexibility.\n\nDeveloper Productivity\nLow-code platforms significantly increase developer productivity by automating repetitive tasks while still allowing custom code when needed.\n\nEnterprise Adoption\nMore enterprises are adopting low-code platforms for internal tools and customer-facing applications, recognizing the balance they offer between speed and control.\n\nCustomization\nModern low-code platforms provide extensive customization options, allowing developers to extend functionality with custom code when needed.',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
  (SELECT id FROM categories WHERE slug = 'low-code'),
  true,
  now()
);