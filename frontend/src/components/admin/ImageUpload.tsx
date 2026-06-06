import { useState, useRef } from 'react';
import { Upload, X, Loader2, Pencil, FileText } from 'lucide-react';
import { cloudinaryUrl } from '../../lib/cloudinary';

import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;           // full url or publicId depending on usage, but we'll accept publicId or URL
  publicId?: string;        // publicId for display
  folder?: string;          // e.g. "simplifly/tours"
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
  className?: string;
  acceptPdf?: boolean;      // allows PDF
  requireLandscape?: boolean; // strictly landscape images only
}

export function ImageUpload({ value, publicId, folder = 'simplifly/general', onChange, onRemove, className = '', acceptPdf = true, requireLandscape = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = publicId && !value?.startsWith('http') ? cloudinaryUrl(publicId, { width: 800 }) : value;
  const isPdf = displayUrl?.toLowerCase().endsWith('.pdf');

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (requireLandscape && file.type.startsWith('image/')) {
      const isLandscape = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve(img.width > img.height);
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve(true); // if it fails to load here, let server handle or fail later
        };
        img.src = URL.createObjectURL(file);
      });

      if (!isLandscape) {
        toast.error("Please upload a landscape image (width must be greater than height).");
        return;
      }
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('image', file);

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url, data.publicId);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {displayUrl ? (
        <div className="relative rounded-[16px] overflow-hidden border border-[#e4eaf2] group h-[200px] flex items-center justify-center bg-[#f8fafc]">
          {isPdf ? (
            <div className="flex flex-col items-center gap-3 text-[#041d3c]">
              <FileText className="w-16 h-16 text-rose-500" />
              <span className="text-[13px] font-bold max-w-[80%] text-center truncate">Document (PDF)</span>
            </div>
          ) : (
            <img src={displayUrl} alt="Uploaded" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#041d3c] rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-[#1a84ff] hover:text-white transition-all shadow-lg transform hover:scale-105"
            >
              <Pencil className="w-3.5 h-3.5" />
              Change
            </button>
            
            {onRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-rose-500 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all shadow-lg transform hover:scale-105"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[16px] p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-[#1a84ff] bg-[#eef6ff]'
              : 'border-[#e4eaf2] hover:border-[#1a84ff] hover:bg-[#f8fafc]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
              <p className="text-[#1a84ff] font-semibold text-[13px]">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#1a84ff]/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#1a84ff]" />
              </div>
              <p className="text-[#041d3c] font-bold text-[13px]">
                Drop {acceptPdf ? 'file' : 'image'} here or <span className="text-[#1a84ff]">browse</span>
              </p>
              <p className="text-gray-400 text-[11px]">JPG, WebP, PNG{acceptPdf ? ', PDF' : ''} · Max 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={`image/jpeg,image/jpg,image/webp,image/png${acceptPdf ? ',application/pdf' : ''}`}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />
    </div>
  );
}
