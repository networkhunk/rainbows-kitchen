import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function QRCodeGenerator() {
  const tables = Array.from({length: 14}, (_, i) => i + 1);
  const [ipAddress, setIpAddress] = useState(window.location.host);
  const protocol = window.location.protocol;
  
  const baseUrl = `${protocol}//${ipAddress}/menu`;

  return (
    <div className="container" style={{paddingTop: '2rem'}}>
      <header className="flex flex-col gap-4 hide-on-print" style={{marginBottom: '2rem'}}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="btn btn-icon"><ArrowLeft size={20} /></Link>
            <h1 style={{margin: 0}}>Table QR Codes</h1>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16}/> Print QRs
          </button>
        </div>
        
        <div className="glass-card" style={{background: 'var(--warning-light)', padding: '1.5rem', borderLeft: '4px solid var(--warning)'}}>
          <h3 className="flex items-center gap-2" style={{margin: '0 0 1rem 0', color: '#b45309'}}>
            <AlertTriangle size={20} /> Network Configuration
          </h3>
          <p style={{margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)'}}>
            To allow customer phones to scan the menus, the QR code must point to your <b>Network IP</b>, not localhost. Check your terminal running <code>npm run dev</code> for the Network Address.
          </p>
          <div className="flex items-center gap-2">
            <span style={{fontWeight: 'bold'}}>{protocol}//</span>
            <input 
              type="text" 
              value={ipAddress} 
              onChange={e => setIpAddress(e.target.value)} 
              placeholder={window.location.hostname === 'localhost' ? "e.g. 192.168.1.5:5173" : "e.g. my-app.vercel.app"}
              style={{padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', width: '250px'}}
            />
            <span style={{fontWeight: 'bold'}}>/menu</span>
          </div>
          {ipAddress.includes('localhost') && (
            <p style={{color: 'var(--danger)', fontSize: '0.85rem', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>
              ⚠️ WARNING: QR codes generated with "localhost" will infinitely load on customer phones!
            </p>
          )}
        </div>
      </header>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '2rem',
        textAlign: 'center'
      }}>
        {tables.map(table => {
          const url = `${baseUrl}?table=${table}`;
          return (
            <div key={table} className="glass-card flex flex-col items-center justify-center p-4">
              <h2 style={{marginBottom: '1rem'}}>Table {table}</h2>
              <div style={{padding: '1rem', background: 'white', borderRadius: '12px'}}>
                <QRCodeSVG value={url} size={150} level="H" />
              </div>
              <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Scan to order</p>
            </div>
          )
        })}
      </div>

      <style>{`
        @media print {
          .hide-on-print { display: none !important; }
          body { background: white; color: black; }
          .glass-card { border: 2px solid #ccc; box-shadow: none; break-inside: avoid; margin-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
}
