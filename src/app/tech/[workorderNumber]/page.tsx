import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TechForm from '@/components/TechForm';

export const dynamic = 'force-dynamic';

export default async function TechPage({ params }: { params: Promise<{ workorderNumber: string }> }) {
  const resolvedParams = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { workorderNumber: resolvedParams.workorderNumber }
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="container" style={{ padding: '1rem' }}>
      <h1 className="text-center mb-4">Service Ticket</h1>
      
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Job Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
          <p><strong>Workorder:</strong> {ticket.workorderNumber}</p>
          <p><strong>Customer:</strong> {ticket.customer}</p>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Dispatcher:</strong> {ticket.dispatcher}</p>
          <p style={{ gridColumn: '1 / -1' }}><strong>Unit Number:</strong> {ticket.unitNumber}</p>
          <p style={{ gridColumn: '1 / -1' }}><strong>Tire Size & Pos:</strong> {ticket.tireSize} ({ticket.tirePosition})</p>
        </div>
      </div>

      <TechForm workorderNumber={ticket.workorderNumber} />
    </main>
  );
}
