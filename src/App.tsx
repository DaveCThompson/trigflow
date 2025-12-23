import { UnitCircle } from './components/UnitCircle/UnitCircle';

function App() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <header className="mb-8 text-center pt-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    TrigFlow
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Interactive Trigonometric Unit Circle</p>
            </header>

            <main className="w-full max-w-[1600px]">
                <UnitCircle />
            </main>

            <footer className="mt-12 text-slate-400 text-sm pb-8">
                Modular Canvas Architecture
            </footer>
        </div>
    )
}

export default App
