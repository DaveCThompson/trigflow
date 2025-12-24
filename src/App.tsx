import { UnitCircle } from './components/UnitCircle/UnitCircle';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-ui-bg-main text-ui-text transition-all duration-500 flex flex-col items-center justify-center p-4 font-body">
                <header className="mb-12 text-center pt-8 w-full max-w-[1600px] flex flex-col items-center relative">
                    <div className="absolute top-8 right-0 hidden md:block">
                        <ThemeToggle />
                    </div>
                    {/* Mobile Toggle */}
                    <div className="md:hidden absolute top-4 right-4">
                        <ThemeToggle />
                    </div>

                    <h1 className="text-5xl font-heading font-extrabold bg-gradient-to-r from-trig-cos via-trig-sec to-trig-sin bg-clip-text text-transparent mb-3 drop-shadow-sm tracking-tight">
                        TrigFlow
                    </h1>
                    <p className="text-ui-text-muted font-heading font-bold text-lg tracking-wide opacity-80">
                        Interactive Trigonometric Unit Circle
                    </p>
                </header>

                <main className="w-full max-w-[1600px]">
                    <UnitCircle />
                </main>

                <footer className="mt-12 text-ui-text-muted text-sm pb-8 flex items-center gap-2">
                    <span className="font-bold">TrigFlow</span>
                    <span className="opacity-50">•</span>
                    <span>v0.1.0</span>
                </footer>
            </div>
        </ThemeProvider>
    )
}

export default App
