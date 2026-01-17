import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>IronBackend - Backend Architecture Intelligence for AI | Open Source</title>
        <meta
          name="description"
          content="Open-source backend architecture knowledge base for AI coding assistants. Support Cursor, Claude, GitHub Copilot with production-grade patterns."
        />
        <meta name="keywords" content="backend architecture, AI coding assistant, cursor AI, clean architecture, hexagonal architecture, NestJS, microservices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="IronBackend - AI Backend Architecture Assistant" />
        <meta property="og:description" content="Teach your AI assistant backend architecture patterns" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://ironbackend.dev" />
        <meta property="og:type" content="website" />

        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            "name": "IronBackend",
            "description": "Backend Architecture Intelligence for AI Coding Assistants",
            "programmingLanguage": "TypeScript",
            "codeRepository": "https://github.com/ironbackend/ironbackend",
            "author": {
              "@type": "Organization",
              "name": "IronBackend Contributors"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Head>

      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          v1.0 Public Beta
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Backend Architecture <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligence for AI
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10">
          Stop your AI from writing bad backend code.
          Inject production-grade architecture patterns into valid Cursor, Claude, and GitHub Copilot workflows.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="https://github.com/txqt/IronBackend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            View on GitHub
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Clean Architecture</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Enforce hexagonal, clean, or modular monolith patterns automatically in your AI generated code.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">AI-Native Rules</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Optimized context files (`.cursor/rules`) designed specifically for LLM consumption.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Production Ready</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Security best practices, validation patterns, and error handling baked into every suggestion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
