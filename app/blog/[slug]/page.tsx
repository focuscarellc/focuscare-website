import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import FilloutConsultation from '@/components/FilloutConsultation';
import AuthorFooter from '@/components/AuthorFooter';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export const dynamicParams = false;

export async function generateStaticParams() {
  const files = await fs.readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return {
    title: `${title} - FOCUS Care Blog`,
    description: `Read more about ${title}.`,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  let markdownContent: string;
  try {
    markdownContent = await fs.readFile(filePath, 'utf-8');
  } catch {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 prose prose-lg dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
        img: ({ node, ...props }) => (
          <span className="block my-8">
            <img {...props} className="rounded-lg shadow-lg mx-auto" />
          </span>
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold my-6" {...props} />
        ),
      }}>
        {markdownContent}
      </ReactMarkdown>
      <AuthorFooter />
      <FilloutConsultation />
    </article>
  );
}
