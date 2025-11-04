import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImage(prompt: string): Promise<string> {
    try {
        const enhancedPrompt = `Una fotografía de alta calidad de: ${prompt}. Estilo fotorrealista, arquitectura moderna, iluminación natural diurna, colores nítidos y vibrantes.`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No se generó ninguna imagen. Intenta con una descripción diferente.");
        }
    } catch (error) {
        console.error("Error al generar la imagen con Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Fallo al generar la imagen: ${error.message}`);
        }
        throw new Error("Ocurrió un error desconocido al generar la imagen.");
    }
}
