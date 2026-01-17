import Link from 'next/link';

export const components = {
    h1: (props: any) => (
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mt-10 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4" {...props} />
    ),
    p: (props: any) => (
        <p className="leading-7 text-slate-600 dark:text-slate-300 mb-6" {...props} />
    ),
    ul: (props: any) => (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-slate-600 dark:text-slate-300" {...props} />
    ),
    code: (props: any) => (
        <code className="relative rounded bg-slate-100 dark:bg-slate-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:text-slate-200" {...props} />
    ),
    pre: (props: any) => (
        <div className="overflow-hidden rounded-xl bg-slate-900 dark:bg-black/50 border border-slate-800 mb-6">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
            </div>
            <pre className="overflow-x-auto p-4 text-sm text-slate-50" {...props} />
        </div>
    ),
    a: (props: any) => (
        <Link className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 hover:decoration-blue-600 transition-all dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400" {...props} />
    ),
    blockquote: (props: any) => (
        <blockquote className="mt-6 border-l-4 border-blue-600 pl-6 italic text-slate-700 dark:text-slate-300" {...props} />
    ),
};
