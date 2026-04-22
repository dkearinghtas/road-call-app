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
        <label className="photo-dropzone" style={{ cursor: 'pointer' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <span>Tap to Capture or Select Photo</span>
          <input 
            type="file" 
            accept="image/*" 
            name={name}
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: '0',
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              borderWidth: '0',
              opacity: 0
            }}
          />
        </label>
      )}
    </div>
  );
}
