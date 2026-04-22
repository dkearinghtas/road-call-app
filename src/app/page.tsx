import Link from 'next/link';

export default function Home() {
  return (
    <main className="container text-center mt-8">
      <h1 className="mb-4">Tire Service Road Call</h1>
      <p className="mb-8">Select your role to continue</p>

      <div className="dashboard-grid">
        <Link href="/dispatch" className="card">
          <h2>Dispatcher</h2>
          <p>Create new service tickets and generate printable work orders for the technicians.</p>
          <div className="btn btn-primary w-full mt-4">New Ticket</div>
        </Link>

        <div className="card">
          <h2>Technician</h2>
          <p>Technicians: Scan the QR code on your printed ticket to access your active job directly.</p>
          <div className="btn btn-secondary w-full mt-4">Scan QR Code</div>
        </div>
      </div>
    </main>
  );
}
