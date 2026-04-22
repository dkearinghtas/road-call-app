"use client";

import { useState, useRef } from 'react';

type PhotoUploaderProps = {
  label: string;
  name: string;
  onPhotoCapture?: (file: File | null) => void;
};

export default function PhotoUploader({ label, name, onPhotoCapture }: PhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    if (onPhotoCapture) {
      onPhotoCapture(file);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</label>
      
      {previewUrl ? (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <img src={previewUrl} alt={label} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
              Retake Photo
            </button>
          </div>
        </div>
      ) : (
        <div 
          style={{ 
            border: '2px dashed var(--border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '2rem 1rem', 
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--background)'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
           <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Tap to Capture Photo</span>
        </div>
      )}

      {/* Actual file input hidden from view */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        name={name}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
