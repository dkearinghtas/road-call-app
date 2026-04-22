"use client";

import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignaturePad({ onSign }: { onSign: (dataUrl: string) => void }) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(true);

  // Responsive canvas handling
  useEffect(() => {
    const handleResize = () => {
      if (sigCanvas.current && containerRef.current) {
        // resize logic if needed
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    sigCanvas.current?.clear();
    setEmpty(true);
    onSign('');
  };

  const handleEnd = () => {
    if (sigCanvas.current?.isEmpty()) {
      setEmpty(true);
      onSign('');
    } else {
      setEmpty(false);
      onSign(sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || '');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }} ref={containerRef}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Driver Signature</label>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Please sign inside the box</p>
      
      <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: '#fcfcfc', overflow: 'hidden' }}>
        <SignatureCanvas 
          ref={sigCanvas} 
          penColor="black"
          canvasProps={{ className: 'sigCanvas', style: { width: '100%', height: '200px', touchAction: 'none' } }}
          onEnd={handleEnd}
        />
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <button type="button" onClick={clear} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Clear Signature
        </button>
      </div>
    </div>
  );
}
