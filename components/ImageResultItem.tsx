
import React, { useState } from 'react';
import { ImageFileState, ProcessingStatus } from '../types';
import { CopyIcon, CheckIcon, ExclamationIcon, ClockIcon } from './icons';

interface ImageResultItemProps {
  item: ImageFileState;
}

const StatusIndicator: React.FC<{ status: ProcessingStatus }> = ({ status }) => {
  switch (status) {
    case ProcessingStatus.PENDING:
      return (
        <div className="flex items-center space-x-2 text-slate-500">
          <ClockIcon className="w-5 h-5" />
          <span>Pending</span>
        </div>
      );
    case ProcessingStatus.PROCESSING:
      return (
        <div className="flex items-center space-x-2 text-brand-secondary">
          <svg className="animate-spin h-5 w-5 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      );
    case ProcessingStatus.SUCCESS:
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckIcon className="w-5 h-5" />
          <span>Success</span>
        </div>
      );
    case ProcessingStatus.ERROR:
      return (
        <div className="flex items-center space-x-2 text-red-600">
          <ExclamationIcon className="w-5 h-5" />
          <span>Error</span>
        </div>
      );
    default:
      return null;
  }
};


const ImageResultItem: React.FC<ImageResultItemProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item.resultText) {
      navigator.clipboard.writeText(item.resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start gap-4 transition-all duration-300">
      <img src={item.previewUrl} alt={item.file.name} className="w-32 h-32 object-cover rounded-md border" />
      <div className="flex-1">
        <p className="font-semibold text-brand-dark truncate" title={item.file.name}>{item.file.name}</p>
        <div className="mt-2">
          <StatusIndicator status={item.status} />
        </div>
        {item.status === ProcessingStatus.SUCCESS && item.resultText && (
          <div className="mt-3 bg-slate-50 p-3 rounded-md relative">
            <p className="text-brand-dark font-mono whitespace-pre-wrap break-words">{item.resultText}</p>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-200 hover:bg-brand-accent/50 text-slate-600 hover:text-brand-dark transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
            </button>
          </div>
        )}
        {item.status === ProcessingStatus.ERROR && item.error && (
          <div className="mt-3 bg-red-50 p-3 rounded-md text-red-700">
            <p className="font-mono text-sm">{item.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResultItem;
