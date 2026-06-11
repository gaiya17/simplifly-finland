'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, FileText, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface PdfUploadProps {
  value?: string;        // current URL stored in DB
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function PdfUpload({ value, onChange, onRemove, className = '' }: PdfUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filename = value ? value.split('/').pop() : null;

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('PDF must be under 20 MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url);
        toast.success('PDF uploaded successfully!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value || !onRemove) return;
    const fn = value.split('/').pop();
    if (fn) {
      try {
        const token = localStorage.getItem('auth_token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${API_URL}/documents/upload`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ filename: fn }),
        });
      } catch {
        // ignore deletion errors — the field is cleared regardless
      }
    }
    onRemove();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative rounded-[16px] overflow-hidden border border-[#e4eaf2] group h-[160px] flex items-center justify-center bg-[#f8fafc]">
          <div className="flex flex-col items-center gap-3 text-[#041d3c]">
            <div className="w-14 h-14 rounded-[14px] bg-rose-50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-rose-500" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-[#041d3c] max-w-[200px] truncate">{filename}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">PDF Document — ready to download</p>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#041d3c] rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-[#1a84ff] hover:text-white transition-all shadow-lg"
            >
              <Pencil className="w-3.5 h-3.5" />
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-rose-500 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all shadow-lg"
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
            dragOver ? 'border-rose-400 bg-rose-50' : 'border-[#e4eaf2] hover:border-rose-300 hover:bg-rose-50/40'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-rose-500 font-semibold text-[13px]">Uploading PDF...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-[#041d3c] font-bold text-[13px]">
                Drop PDF here or <span className="text-rose-500">browse</span>
              </p>
              <p className="text-gray-400 text-[11px]">PDF only · Max 20 MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
