import Head from 'next/head';

export default function DesignRulesChecker() {
    return (
        <div className="flex flex-col items-center">
            <Head>
                <title>Design Rules Checker | IronBackend</title>
                <meta name="description" content="Check your code against IronBackend design rules." />
            </Head>

            <div className="w-full max-w-4xl py-12 px-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    Design Rules Checker
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                    Paste your code snippet below to detect violations of standard backend design rules.
                </p>

                <div className="grid gap-6">
                    <textarea
                        className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="// Paste your code here..."
                        disabled
                    ></textarea>

                    <button className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed">
                        Check Code (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
