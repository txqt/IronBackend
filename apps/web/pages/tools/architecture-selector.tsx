
import Head from 'next/head';
import { useState } from 'react';
import { ArrowRight, Check, RefreshCw, Layers, Box, Cpu, Server } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    options: Option[];
}

interface Option {
    id: string;
    text: string;
    points: Record<ArchitectureType, number>;
}

type ArchitectureType = 'monolith' | 'modular_monolith' | 'microservices' | 'serverless';

interface ArchitectureResult {
    type: ArchitectureType;
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    icon: React.ElementType;
}

const ARCHITECTURES: Record<ArchitectureType, ArchitectureResult> = {
    monolith: {
        type: 'monolith',
        name: 'Layered Monolith',
        description: 'A traditional unified codebase where all components are tightly coupled and deployed together.',
        pros: ['Simple to develop and deploy', 'Easy debugging and testing', 'No distributed system complexity'],
        cons: ['Hard to scale teams', 'Tight coupling over time', 'Single point of failure'],
        icon: Box
    },
    modular_monolith: {
        type: 'modular_monolith',
        name: 'Modular Monolith',
        description: 'A monolithic deployment where code is structured into independent modules with strict boundaries.',
        pros: ['Best balance of simplicity and structure', 'Easy to refactor to microservices later', 'Type safety across modules'],
        cons: ['Requires discipline to maintain boundaries', 'Still a single deployment unit'],
        icon: Layers
    },
    microservices: {
        type: 'microservices',
        name: 'Microservices',
        description: 'Independent services communicating over a network, each with its own database and deployment lifecycle.',
        pros: ['Independent scaling and deployment', 'Technology agnostic per service', 'Fault isolation'],
        cons: ['High operational complexity', 'Distributed data consistency issues', 'Network latency'],
        icon: Server
    },
    serverless: {
        type: 'serverless',
        name: 'Serverless / FaaS',
        description: 'Event-driven functions deployed to a managed platform (AWS Lambda, Vercel Functions).',
        pros: ['Infinite scaling', 'Pay on demand', 'No server management'],
        cons: ['Cold starts', 'Vendor lock-in', 'Difficult local testing'],
        icon: Cpu
    }
};

const QUESTIONS: Question[] = [
    {
        id: 'team_size',
        text: 'How big is your backend engineering team?',
        options: [
            { id: 'small', text: '1-3 developers', points: { monolith: 5, modular_monolith: 3, microservices: 0, serverless: 3 } },
            { id: 'medium', text: '4-10 developers', points: { monolith: 2, modular_monolith: 5, microservices: 1, serverless: 3 } },
            { id: 'large', text: '10+ developers', points: { monolith: 0, modular_monolith: 3, microservices: 5, serverless: 2 } }
        ]
    },
    {
        id: 'complexity',
        text: 'What is the domain complexity of your application?',
        options: [
            { id: 'simple', text: 'Simple CRUD (e.g., Blog, Todo App)', points: { monolith: 5, modular_monolith: 1, microservices: 0, serverless: 5 } },
            { id: 'moderate', text: 'Moderate logic (e.g., E-commerce, Workflow)', points: { monolith: 2, modular_monolith: 5, microservices: 2, serverless: 3 } },
            { id: 'complex', text: 'High complexity (e.g., Banking, Enterprise ERP)', points: { monolith: 0, modular_monolith: 4, microservices: 5, serverless: 1 } }
        ]
    },
    {
        id: 'scale',
        text: 'What are your expected scaling requirements?',
        options: [
            { id: 'low', text: 'Low to Predictable traffic', points: { monolith: 5, modular_monolith: 5, microservices: 0, serverless: 3 } },
            { id: 'variable', text: 'Spiky / Unpredictable traffic', points: { monolith: 1, modular_monolith: 2, microservices: 3, serverless: 5 } },
            { id: 'high', text: 'Massive global scale (millions of users)', points: { monolith: 0, modular_monolith: 2, microservices: 5, serverless: 4 } }
        ]
    }
];

export default function ArchitectureSelector() {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<Record<ArchitectureType, number>>({
        monolith: 0,
        modular_monolith: 0,
        microservices: 0,
        serverless: 0
    });
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (option: Option) => {
        // Update scores
        const newScores = { ...scores };
        (Object.keys(option.points) as ArchitectureType[]).forEach((key) => {
            newScores[key] += option.points[key];
        });
        setScores(newScores);

        // Advance step or show result
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowResult(true);
        }
    };

    const getWinner = (): ArchitectureResult => {
        let maxScore = -1;
        let winner: ArchitectureType = 'monolith';

        (Object.entries(scores) as [ArchitectureType, number][]).forEach(([key, score]) => {
            if (score > maxScore) {
                maxScore = score;
                winner = key;
            }
        });

        return ARCHITECTURES[winner];
    };

    const reset = () => {
        setCurrentStep(0);
        setScores({ monolith: 0, modular_monolith: 0, microservices: 0, serverless: 0 });
        setShowResult(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <Head>
                <title>Architecture Selector | IronBackend</title>
                <meta name="description" content="Find the best backend architecture style for your project." />
            </Head>

            <div className="w-full max-w-4xl py-12 px-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                    Architecture Style Selector
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 text-center max-w-2xl mx-auto">
                    Answer {QUESTIONS.length} questions to find the perfect architecture for your next AI-assisted project.
                </p>

                {!showResult ? (
                    <div className="max-w-2xl mx-auto">
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-8">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
                                {QUESTIONS[currentStep].text}
                            </h2>
                            <div className="space-y-3">
                                {QUESTIONS[currentStep].options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option)}
                                        className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                            {option.text}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-500">
                        {/* Result View */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                                        Recommended Architecture
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        {getWinner().name}
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                                        {getWinner().description}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                                                <span className="mr-2">👍</span> Pros
                                            </h3>
                                            <ul className="space-y-2">
                                                {getWinner().pros.map((pro, i) => (
                                                    <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                                                        <Check className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center">
                                                <span className="mr-2">⚠️</span> Cons
                                            </h3>
                                            <ul className="space-y-2">
                                                {getWinner().cons.map((con, i) => (
                                                    <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2 mt-1.5 shrink-0"></div>
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-64 shrink-0 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                                    {/* Dynamic Icon */}
                                    {(() => {
                                        const Icon = getWinner().icon;
                                        return <Icon className="w-24 h-24 text-blue-600 dark:text-blue-400 mb-4 stroke-[1.5]" />;
                                    })()}
                                    <div className="text-center text-sm text-slate-500">
                                        Best fit for your constraints based on team size and complexity.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                <button
                                    onClick={reset}
                                    className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

