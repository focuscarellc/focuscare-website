import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
}

/**
 * Parse a blog markdown file to extract metadata
 */
function parseMarkdown(content: string, slug: string): BlogPost {
  const lines = content.split('\n');
  
  // Extract title (first h1)
  const titleLine = lines.find(line => line.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : slug;
  
  // Extract date (looks for **Date:** pattern)
  const dateLine = lines.find(line => line.includes('**Date:**'));
  const dateMatch = dateLine?.match(/\*\*Date:\*\*\s*(.+)/);
  const date = dateMatch ? dateMatch[1].trim() : '';
  
  // Extract featured image
  const imageLine = lines.find(line => line.includes('![') && line.includes('/images/blog/'));
  const imageMatch = imageLine?.match(/\((\/images\/blog\/[^)]+)\)/);
  const image = imageMatch ? imageMatch[1] : '/images/blog/placeholder.png';
  
  // Extract category from image alt or default
  const categoryMatch = imageLine?.match(/!\[.*?:\s*([^\]]+)\]/);
  const category = categoryMatch ? categoryMatch[1].split(':')[0].trim() : 'Insights';
  
  // Extract excerpt (first paragraph after the image, skip headers)
  let excerpt = '';
  let foundImage = false;
  for (const line of lines) {
    if (line.includes('![')) {
      foundImage = true;
      continue;
    }
    if (foundImage && line.trim() && !line.startsWith('#') && !line.startsWith('**Date')) {
      excerpt = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      if (excerpt.length > 20) break;
    }
  }
  
  // Truncate excerpt if too long
  if (excerpt.length > 160) {
    excerpt = excerpt.substring(0, 157) + '...';
  }
  
  return { slug, title, date, excerpt, image, category };
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
        return parseMarkdown(content, slug);
      })
    );
    
    // Sort by date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * Get the latest blog post
 */
export async function getLatestPost(): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Get the N most recent blog posts
 */
export async function getRecentPosts(count: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}
