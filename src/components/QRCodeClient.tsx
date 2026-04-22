"use client";

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function QRCodeClient({ path }: { path: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  if (!url) return <div style={{width: 150, height: 150, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading QR...</div>;

  return <QRCodeSVG value={url} size={150} />;
}
