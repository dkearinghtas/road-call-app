"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUploader from './PhotoUploader';
import SignaturePad from './SignaturePad';

export default function TechForm({ workorderNumber }: { workorderNumber: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('signatureDataUrl', signatureDataUrl);
      
      const response = await fetch(`/api/tickets/${workorderNumber}/complete`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to complete job. Please try again.');
      }

      alert('Job successfully submitted and uploaded to SharePoint!');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="card" style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem' }}>{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Photos</h2>
        <PhotoUploader label="1. Unit Number" name="photoUnitNumber" />
        <PhotoUploader label="2. License Plate" name="photoLicensePlate" />
        <PhotoUploader label="3. Mileage/Hubometer" name="photoMileage" />
        <PhotoUploader label="4. Off Tire" name="photoOffTire" />
        <PhotoUploader label="5. DOT Number" name="photoDOT" />
        <PhotoUploader label="6. Damage" name="photoDamage" />
        <PhotoUploader label="7. Replacement Tire Type" name="photoReplacementType" />
        <PhotoUploader label="8. Work Complete" name="photoWorkComplete" />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Post-Job Info</h2>
        <div className="card" style={{ padding: '1rem' }}>
          
          <div className="form-group">
            <label htmlFor="causeOfFailure">Cause of Failure</label>
            <input type="text" id="causeOfFailure" name="causeOfFailure" required />
          </div>

          <div className="form-group">
            <label htmlFor="scrapTire">Off Tire Scrap?</label>
            <select id="scrapTire" name="scrapTire" required>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="remaining32nds">Off Tire Remaining 32nds</label>
            <input type="text" id="remaining32nds" name="remaining32nds" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="removeInstallVehicleQty">Remove/Install Veh QTY</label>
              <input type="number" id="removeInstallVehicleQty" name="removeInstallVehicleQty" defaultValue="1" />
            </div>
            <div className="form-group">
              <label htmlFor="dismountMountTireQty">Dismount/Mount Tire QTY</label>
              <input type="number" id="dismountMountTireQty" name="dismountMountTireQty" defaultValue="1" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aluminumValveQty">Aluminum Valve Stem QTY</label>
              <input type="number" id="aluminumValveQty" name="aluminumValveQty" defaultValue="0" />
            </div>
            <div className="form-group">
              <label htmlFor="brassValveQty">Brass Valve Stem QTY</label>
              <input type="number" id="brassValveQty" name="brassValveQty" defaultValue="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flowThroughCapQty">Flow Through Cap QTY</label>
              <input type="number" id="flowThroughCapQty" name="flowThroughCapQty" defaultValue="0" />
            </div>
            <div className="form-group">
              <label htmlFor="rollTime">Roll Time</label>
              <input type="text" id="rollTime" name="rollTime" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalItems">Additional Service Items</label>
            <textarea id="additionalItems" name="additionalItems" rows={2} />
          </div>

          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea id="comments" name="comments" rows={3} />
          </div>

        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <SignaturePad onSign={setSignatureDataUrl} />
      </div>

      <div style={{ paddingBottom: '3rem' }}>
        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '1rem', fontSize: '1.25rem' }}>
          {loading ? 'Uploading safely to SharePoint...' : 'Complete Job & Upload'}
        </button>
      </div>
    </form>
  );
}
