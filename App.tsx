
import React, { useState, useCallback } from 'react';
import { ImageFileState, ProcessingStatus } from './types';
import { getGranthaFromImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageResultItem from './components/ImageResultItem';
import ProgressBar from './components/ProgressBar';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const App: React.FC = () => {
    const [imageFiles, setImageFiles] = useState<ImageFileState[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        const newImageFiles: ImageFileState[] = files
            .filter(file => file.type.startsWith('image/'))
            .map(file => ({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
                previewUrl: URL.createObjectURL(file),
                status: ProcessingStatus.PENDING,
                resultText: null,
                error: null,
            }));
        setImageFiles(prev => [...prev, ...newImageFiles]);
    };

    const handleProcessImages = useCallback(async () => {
        const filesToProcess = imageFiles.filter(f => f.status === ProcessingStatus.PENDING);
        if (filesToProcess.length === 0) {
            return;
        }

        setIsProcessing(true);

        const processingPromises = filesToProcess.map(async (imageFile) => {
            try {
                setImageFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: ProcessingStatus.PROCESSING } : f));
                
                const base64Image = await fileToBase64(imageFile.file);
                const resultText = await getGranthaFromImage(base64Image, imageFile.file.type);

                if (resultText.startsWith('API Error:')) {
                     throw new Error(resultText);
                }
                
                setImageFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: ProcessingStatus.SUCCESS, resultText } : f));

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
                setImageFiles(prev => prev.map(f => f.id === imageFile.id ? { ...f, status: ProcessingStatus.ERROR, error: errorMessage } : f));
            }
        });
        
        await Promise.all(processingPromises);

        setIsProcessing(false);
    }, [imageFiles]);
    
    const handleClearAll = () => {
        imageFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
        setImageFiles([]);
    };
    
    const processedCount = imageFiles.filter(f => f.status === ProcessingStatus.SUCCESS || f.status === ProcessingStatus.ERROR).length;
    const pendingCount = imageFiles.filter(f => f.status === ProcessingStatus.PENDING).length;

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-brand-primary">Grantha Script OCR Converter</h1>
                    <p className="mt-1 text-slate-600">Upload images to recognize text and convert it to Tamil Grantha script.</p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <section className="mb-8">
                        <ImageUploader onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
                    </section>
                    
                    {imageFiles.length > 0 && (
                        <section>
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                <h2 className="text-2xl font-semibold text-brand-dark">Processing Queue ({imageFiles.length})</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleClearAll}
                                        disabled={isProcessing}
                                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={handleProcessImages}
                                        disabled={isProcessing || pendingCount === 0}
                                        className="px-6 py-2 font-semibold text-white bg-brand-secondary rounded-lg hover:bg-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        {isProcessing ? 'Processing...' : `Start Processing (${pendingCount})`}
                                    </button>
                                </div>
                            </div>
                            
                            <ProgressBar processed={processedCount} total={imageFiles.length} />

                            <div className="space-y-4">
                                {imageFiles.map((item) => (
                                    <ImageResultItem key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
