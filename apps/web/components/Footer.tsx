export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">IronBackend</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} IronBackend. Open Source.
                    </p>
                </div>
            </div>
        </footer>
    );
}
