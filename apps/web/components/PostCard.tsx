import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface PostCardProps {
    slug: string;
    title: string;
    description: string;
    date: string;
    author?: string;
}

export default function PostCard({ slug, title, description, date, author }: PostCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="block group">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time dateTime={date}>{date}</time>
                    {author && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{author}</span>
                        </>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 line-clamp-3">
                    {description}
                </p>

                <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    Read Article &rarr;
                </div>
            </div>
        </Link>
    );
}
