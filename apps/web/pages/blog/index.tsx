import Head from 'next/head';
import { promises as fs } from 'fs';
import path from 'path';
import PostCard from '../../components/PostCard';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
}

interface BlogIndexProps {
    posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <Head>
                <title>Blog | IronBackend</title>
                <meta name="description" content="Insights on backend architecture, AI engineering, and software design." />
            </Head>

            <div className="w-full max-w-4xl py-12 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Engineering <span className="text-blue-600">Insights</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Deep dives into backend architecture, system design, and the future of AI-assisted coding.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post) => (
                        <PostCard key={post.slug} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const blogDir = path.join(process.cwd(), 'pages/blog');
    const filenames = await fs.readdir(blogDir);

    const posts = await Promise.all(
        filenames
            .filter((name) => name.endsWith('.mdx'))
            .map(async (name) => {
                const filePath = path.join(blogDir, name);
                const fileContent = await fs.readFile(filePath, 'utf8');

                // Simple manual parsing of the export const meta object
                // This avoids needing heavy dependencies like gray-matter or babel-parser for now
                // since we know the exact format we are using.
                // simple manual parsing of the export const meta object
                const metaMatch = fileContent.match(/export const meta = ({[\s\S]*?})/);

                interface BlogMeta {
                    title?: string;
                    description?: string;
                    date?: string;
                    author?: string;
                    [key: string]: unknown;
                }

                let meta: BlogMeta = {};

                if (metaMatch && metaMatch[1]) {
                    try {
                        // Dangerous but acceptable for build-time local content
                        // We convert the JS object string to JSON to parse it safely-ish
                        const metaString = metaMatch[1]
                            .replace(/(\w+):/g, '"$1":') // Quote keys
                            .replace(/'/g, '"') // Replace single quotes with double
                            .replace(/,\s*}/g, '}'); // Remove trailing comma if any

                        meta = JSON.parse(metaString);
                    } catch (e) {
                        console.error(`Failed to parse meta for ${name}`, e);
                    }
                }

                return {
                    slug: name.replace('.mdx', ''),
                    title: meta.title || 'Untitled',
                    description: meta.description || '',
                    date: meta.date || '',
                    author: meta.author || 'IronBackend Team'
                };
            })
    );

    // Sort by date desc
    posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return {
        props: {
            posts
        }
    };
}
