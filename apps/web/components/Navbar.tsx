import Link from "next/link";
import { useRouter } from "next/router";
import { Database, BookOpen, Newspaper } from "lucide-react"; // Replaced BoxInitialsIcon with Database
import { ComponentType } from "react";

// Helper for icons
const Icon = ({ component: C, className }: { component: ComponentType<{ className?: string }>; className?: string }) => {
    return <C className={className} />;
};

export default function Navbar() {
    const router = useRouter();

    const isActive = (path: string) => router.pathname.startsWith(path);

    return (
        <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm supports-[backdrop-filter]:bg-white/60">
                <div className="flex justify-between h-16 px-4 sm:px-6">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white transition-opacity hover:opacity-80">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Icon component={Database} className="w-5 h-5" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                IronBackend
                            </span>
                        </Link>

                        <div className="hidden sm:flex sm:space-x-1">
                            <a
                                href="http://localhost:5173"
                                target="_blank"
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/docs')
                                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                <Icon component={BookOpen} className="w-4 h-4 mr-2" />
                                Docs
                            </a>
                            <Link
                                href="/tools/architecture-selector"
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/tools')
                                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                <Icon component={Database} className="w-4 h-4 mr-2" />
                                Tools
                            </Link>
                            <Link
                                href="/blog"
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/blog')
                                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                    }`}
                            >
                                <Icon component={Newspaper} className="w-4 h-4 mr-2" />
                                Blog
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {/* Initial CTA or placeholder for auth/search */}
                        <a
                            href="https://github.com/ironbackend/ironbackend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
