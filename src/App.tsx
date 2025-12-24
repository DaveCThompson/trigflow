import { UnitCircle } from './components/UnitCircle/UnitCircle';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-page-gradient text-ui-text transition-all duration-500 flex flex-col items-center justify-center p-4 font-body">
                <header className="mb-8 text-center pt-8 w-full max-w-[1600px] flex flex-col items-center relative">
                    <div className="absolute top-8 right-0 hidden md:block">
                        <ThemeToggle />
                    </div>
                    {/* Mobile Toggle */}
                    <div className="md:hidden absolute top-4 right-4">
                        <ThemeToggle />
                    </div>

                    <h1 className="text-4xl font-heading font-extrabold bg-gradient-to-r from-trig-cos to-trig-sec bg-clip-text text-transparent mb-2 drop-shadow-sm">
                        TrigFlow
                    </h1>
                    <p className="text-ui-text-muted font-medium">Interactive Trigonometric Unit Circle</p>
                </header>

                <main className="w-full max-w-[1600px]">
                    <UnitCircle />
                </main>

                <footer className="mt-12 text-slate-400 text-sm pb-8">
                    Modular Canvas Architecture
                </footer>
            </div>
        </ThemeProvider>
    )
}

export default App
