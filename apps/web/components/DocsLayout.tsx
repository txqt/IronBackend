import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const MENU_ITEMS = [
    {
        category: 'Introduction',
        items: [
            { title: 'Getting Started', href: '/docs/getting-started' },
            { title: 'Philosophy', href: '/docs/philosophy' },
        ]
    },
    {
        category: 'Architecture Styles',
        items: [
            { title: 'Overview', href: '/docs/architecture-styles' },
            { title: 'Layered Monolith', href: '/docs/architecture-styles/monolith' },
            { title: 'Modular Monolith', href: '/docs/architecture-styles/modular-monolith' },
            { title: 'Microservices', href: '/docs/architecture-styles/microservices' },
        ]
    },
    {
        category: 'Features',
        items: [
            { title: 'Design Rules', href: '/docs/design-rules' },
            { title: 'Prompting', href: '/docs/prompting' },
            { title: 'CLI', href: '/docs/cli' },
        ]
    }
];

interface DocsLayoutProps {
    children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
    const router = useRouter();

    return (
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Sidebar - Desktop */}
            <aside className="w-64 hidden md:block shrink-0 pr-8 border-r border-slate-200 dark:border-slate-800">
                <nav className="sticky top-24">
                    {MENU_ITEMS.map((section) => (
                        <div key={section.category} className="mb-8">
                            <h5 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                {section.category}
                            </h5>
                            <ul className="space-y-2">
                                {section.items.map((item) => {
                                    const isActive = router.pathname === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`block text-sm transition-colors ${isActive
                                                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 md:pl-12">
                {/* Mobile Menu Trigger could go here */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {children}
                </div>
            </main>
        </div>
    );
}
