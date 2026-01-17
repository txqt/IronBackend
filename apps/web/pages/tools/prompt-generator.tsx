import Head from 'next/head';

export default function PromptGenerator() {
    return (
        <div className="flex flex-col items-center">
            <Head>
                <title>Prompt Generator | IronBackend</title>
                <meta name="description" content="Generate custom system prompts for your AI coding assistant." />
            </Head>

            <div className="w-full max-w-4xl py-12 px-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    AI Prompt Generator
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                    Configure the perfect system prompt for Cursor, Claude, or GitHub Copilot.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-semibold mb-4">Architecture Style</h3>
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-semibold mb-4">Tech Stack</h3>
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
