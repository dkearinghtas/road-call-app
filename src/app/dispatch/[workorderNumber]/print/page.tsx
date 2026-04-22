import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import QRCodeClient from '@/components/QRCodeClient';
import PrintButton from '@/components/PrintButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PrintSheetPage({ params }: { params: Promise<{ workorderNumber: string }> }) {
  const resolvedParams = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { workorderNumber: resolvedParams.workorderNumber }
  });

  if (!ticket) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', backgroundColor: 'white', color: 'black' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid black', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Tire Service Road Call</h1>
          <p style={{ margin: '5px 0' }}><strong>Workorder Number:</strong> {ticket.workorderNumber}</p>
          <p style={{ margin: '5px 0' }}><strong>Ticket Number:</strong> {ticket.ticketNumber || 'N/A'}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <QRCodeClient path={`/tech/${ticket.workorderNumber}`} />
          <p style={{ fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>Scan to open Tech Form</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem', fontSize: '14px' }}>
        <div>
          <p style={{margin: '0 0 5px'}}><strong>Dispatcher:</strong> {ticket.dispatcher}</p>
          <p style={{margin: '0 0 5px'}}><strong>Customer:</strong> {ticket.customer}</p>
          <p style={{margin: '0 0 5px'}}><strong>National Account Number:</strong> {ticket.nationalAccount || 'N/A'}</p>
          <p style={{margin: '0 0 5px'}}><strong>Call Time:</strong> {ticket.callTime ? new Date(ticket.callTime).toLocaleString() : 'N/A'}</p>
          <p style={{margin: '0 0 5px'}}><strong>Truck/Trailer:</strong> {ticket.truckOrTrailer}</p>
          <p style={{margin: '0 0 5px'}}><strong>Unit Number:</strong> {ticket.unitNumber}</p>
        </div>
        <div>
          <p style={{margin: '0 0 5px'}}><strong>Tire Position:</strong> {ticket.tirePosition}</p>
          <p style={{margin: '0 0 5px'}}><strong>Tire Size:</strong> {ticket.tireSize}</p>
          <p style={{margin: '0 0 5px'}}><strong>Location:</strong> {ticket.location}</p>
          <p style={{margin: '0 0 5px'}}><strong>Driver Name:</strong> {ticket.driverName || 'N/A'}</p>
          <p style={{margin: '0 0 5px'}}><strong>Driver Phone:</strong> {ticket.driverNumber || 'N/A'}</p>
          <p style={{margin: '0 0 5px'}}><strong>Dispatch Phone:</strong> {ticket.dispatchPhone}</p>
        </div>
      </div>

      <div style={{ paddingBottom: '1rem', borderBottom: '2px solid black', marginBottom: '2rem', fontSize: '14px' }}>
        <p style={{margin: '0 0 5px'}}><strong>Rim Damage:</strong> {ticket.rimDamage || 'None specified'}</p>
        <p style={{margin: '0 0 5px'}}><strong>Mud Flap Damage:</strong> {ticket.mudFlapDamage || 'None specified'}</p>
        <p style={{margin: '0 0 5px'}}><strong>Replacement Model Requested:</strong> {ticket.replacementModel || 'None specified'}</p>
      </div>

      <h2 style={{ fontSize: '18px', marginBottom: '1rem' }}>Technician Backup Worksheet</h2>
      <p style={{fontSize: '12px', color: '#666', marginBottom: '1rem'}}>(Fill manually if app is unavailable)</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '14px' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '10px', width: '50%' }}><strong>Cause of Failure:</strong></td>
            <td style={{ border: '1px solid black', padding: '10px', width: '50%' }}><strong>Off Tire Scrap? (Y/N):</strong></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Remaining 32nds:</strong></td>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Remove & Install QTY:</strong></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Dismount & Mount QTY:</strong></td>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Aluminum Valve QTY:</strong></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Brass Valve QTY:</strong></td>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Flow Through Cap QTY:</strong></td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: '1px solid black', padding: '10px', height: '60px', verticalAlign: 'top' }}><strong>Additional Items:</strong></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Roll Time:</strong></td>
            <td style={{ border: '1px solid black', padding: '10px' }}><strong>Signature Line:</strong></td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: '1px solid black', padding: '10px', height: '80px', verticalAlign: 'top' }}><strong>Comments:</strong></td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center' }} className="print-hide">
        <PrintButton />
        <br/><br/>
        <Link href="/dispatch" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Return to Dispatch Form</Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .print-hide { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
        }
      `}} />
    </div>
  );
}
