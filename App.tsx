import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';

// Icon Components (defined outside App to avoid re-creation on render)
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('una casa unifamiliar a cuatro vientos de color blanco, moderna con grandes ventanas, puertas de madera, tejado plano, un garaje para dos coches, un jardín con césped cuidado y una palmera alta y esbelta.');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = useCallback(async () => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, isLoading]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8">
            <header className="w-full max-w-5xl text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                    Visión Arquitectónica AI
                </h1>
                <p className="text-slate-400 mt-2">
                    Convierte tus ideas en diseños fotorrealistas. Describe la casa de tus sueños y deja que la IA la haga realidad.
                </p>
            </header>

            <main className="w-full max-w-5xl flex-grow flex flex-col md:flex-row gap-8">
                {/* Controls Section */}
                <section className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex-grow flex flex-col">
                        <label htmlFor="prompt" className="text-lg font-semibold text-slate-300 mb-2">
                            Descripción de la casa
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej: una casa moderna con piscina infinita y vistas al mar..."
                            className="w-full flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
                            rows={10}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleGenerateImage}
                        disabled={isLoading || !prompt}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-6 w-6" />
                                Generar Imagen
                            </>
                        )}
                    </button>
                </section>

                {/* Image Display Section */}
                <section className="w-full md:w-2/3 bg-slate-800 p-4 rounded-lg shadow-lg flex items-center justify-center aspect-video">
                    {isLoading && (
                         <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                             <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg font-semibold">Creando la imagen de tus sueños...</p>
                            <p className="text-sm">Esto puede tardar un momento.</p>
                         </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 p-4">
                            <h3 className="text-xl font-bold mb-2">Error</h3>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && !imageUrl && (
                        <div className="text-center text-slate-500">
                            <PhotoIcon className="h-24 w-24 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">Tu imagen aparecerá aquí</h3>
                            <p>Escribe una descripción y haz clic en "Generar Imagen".</p>
                        </div>
                    )}
                    {imageUrl && (
                        <img 
                            src={imageUrl} 
                            alt="Casa generada por IA" 
                            className="w-full h-full object-contain rounded-md shadow-inner" 
                        />
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;