
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  }, [onFilesSelected]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300
        ${isDragging ? 'border-brand-accent bg-amber-50' : 'border-brand-secondary/50 bg-white hover:border-brand-accent'}
        ${isProcessing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-brand-dark">
        <UploadIcon className="w-12 h-12 text-brand-secondary" />
        <p className="text-lg font-semibold">
          <span className="text-brand-secondary">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-slate-500">Maximum 600 images (PNG, JPG, etc.)</p>
      </div>
    </div>
  );
};

export default ImageUploader;
