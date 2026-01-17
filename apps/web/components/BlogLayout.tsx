import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BlogLayoutProps {
    children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                href="/blog"
                className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>

            <article className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none">
                {children}
            </article>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Join the IronBackend Newsletter
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Get the latest architecture patterns and AI engineering tips delivered to your inbox.
                    </p>
                    <div className="flex max-w-md mx-auto gap-2">
                        {/* Placeholder form */}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled
                        />
                        <button
                            disabled
                            className="px-6 py-2 bg-slate-900 dark:bg-blue-600 text-white font-medium rounded-lg opacity-70 cursor-not-allowed"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
