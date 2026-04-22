"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      style={{ 
        padding: '10px 20px', 
        cursor: 'pointer', 
        background: 'var(--primary)', 
        color: 'white', 
        border: 'none', 
        borderRadius: 'var(--radius-md)',
        fontSize: '1rem',
        fontWeight: 600
      }} 
      className="print-hide"
    >
      Print Worksheet
    </button>
  );
}
