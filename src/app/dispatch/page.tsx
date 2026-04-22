"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DispatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }

      const result = await response.json();
      // Redirect to the printable worksheet page
      router.push(`/dispatch/${result.workorderNumber}/print`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1 className="text-center mb-8">Create Dispatch Ticket</h1>
      
      <div className="card">
        {error && <div className="mb-4" style={{ color: 'var(--danger)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workorderNumber">Workorder Number (Required)</label>
              <input type="text" id="workorderNumber" name="workorderNumber" required placeholder="e.g. WO-10024" />
            </div>
            <div className="form-group">
              <label htmlFor="ticketNumber">Ticket Number</label>
              <input type="text" id="ticketNumber" name="ticketNumber" placeholder="e.g. TKT-991" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dispatcher">Dispatcher Name</label>
              <input type="text" id="dispatcher" name="dispatcher" required />
            </div>
            <div className="form-group">
              <label htmlFor="callTime">Call Time</label>
              <input type="datetime-local" id="callTime" name="callTime" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer">Customer</label>
              <input type="text" id="customer" name="customer" required />
            </div>
            <div className="form-group">
              <label htmlFor="nationalAccount">National Account Number</label>
              <input type="text" id="nationalAccount" name="nationalAccount" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="truckOrTrailer">Truck or Trailer</label>
              <select id="truckOrTrailer" name="truckOrTrailer">
                <option value="Truck">Truck</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="unitNumber">Unit Number</label>
              <input type="text" id="unitNumber" name="unitNumber" required />
            </div>
          </div>

          <div className="form-row">
             <div className="form-group">
              <label htmlFor="tirePosition">Tire Position</label>
              <select id="tirePosition" name="tirePosition" required>
                <option value="">Select Position...</option>
                <option value="LF">LF</option>
                <option value="RF">RF</option>
                <option value="LFO">LFO</option>
                <option value="RFO">RFO</option>
                <option value="LFI">LFI</option>
                <option value="RFI">RFI</option>
                <option value="LRO">LRO</option>
                <option value="RRO">RRO</option>
                <option value="LRI">LRI</option>
                <option value="RRI">RRI</option>
                <option value="LMI">LMI</option>
                <option value="LMO">LMO</option>
                <option value="RMI">RMI</option>
                <option value="RMO">RMO</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tireSize">Tire Size</label>
              <input type="text" id="tireSize" name="tireSize" required placeholder="e.g. 295/75R22.5" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="replacementModel">Replacement Model Requested</label>
              <input type="text" id="replacementModel" name="replacementModel" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location of Service</label>
              <input type="text" id="location" name="location" required placeholder="Address or Mile Marker" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driverName">Driver Name</label>
              <input type="text" id="driverName" name="driverName" />
            </div>
            <div className="form-group">
              <label htmlFor="driverNumber">Driver Number</label>
              <input type="tel" id="driverNumber" name="driverNumber" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dispatchPhone">Dispatch Call Back Phone</label>
              <input type="tel" id="dispatchPhone" name="dispatchPhone" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rimDamage">Rim/Wheel Damage Description</label>
              <textarea id="rimDamage" name="rimDamage" rows={2} placeholder="Note any damage..." />
            </div>
            <div className="form-group">
              <label htmlFor="mudFlapDamage">Mud Flap Damage Description</label>
              <textarea id="mudFlapDamage" name="mudFlapDamage" rows={2} placeholder="Note any damage..." />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Creating Ticket...' : 'Create Ticket & Generate Print Sheet'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
