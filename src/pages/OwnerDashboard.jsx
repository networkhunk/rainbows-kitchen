import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { Bell, BellRing, Check, ChefHat, CheckSquare, Printer, Settings, BarChart, QrCode, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

export default function OwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, preparing, served
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [requests, setRequests] = useState([]);
  const previousOrderCountRef = useRef(0);
  const prevReqsLen = useRef(0);
  const soundEnabledRef = useRef(false);
  const isInitialMount = useRef(true);

  const playNotificationSound = (force = false, isRequest = false) => {
    if (!force && !soundEnabledRef.current) return;
    try {
      if (isRequest) {
        const audio2 = new Audio('https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg');
        audio2.volume = 0.8;
        audio2.play().catch(() => {});
        setTimeout(() => {
          audio2.pause();
          audio2.currentTime = 0;
        }, 1500);
        return;
      }
      // Small beep sound using Web Audio API
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch {
      console.log('Audio notification failed');
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEnabledRef.current = newState;
    if (newState) {
      playNotificationSound(true); // Play a test beep 
    }
  };

  useEffect(() => {
    async function loadAll() {
      const [{ data: activeOrders }, { data: reqs }] = await Promise.all([
        db.getAllOrders(),
        db.getActiveRequests()
      ]);
      
      if (activeOrders) {
        setOrders(activeOrders);
        const pendingCount = activeOrders.filter(o => o.status === 'pending').length;
        if (pendingCount > previousOrderCountRef.current) {
          playNotificationSound();
        }
        previousOrderCountRef.current = pendingCount;
      }
      
      if (reqs) {
        setRequests(reqs);
        if (!isInitialMount.current && reqs.length > prevReqsLen.current) {
          // We got a brand new request after mounting!
          // Force is true here so we reliably alarm them, but browsers might block if no interaction occurred.
          playNotificationSound(true, true); 
        }
        prevReqsLen.current = reqs.length;
      }
      
      isInitialMount.current = false;
    }
    
    loadAll();
    const interval = setInterval(loadAll, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    await db.updateOrderStatus(orderId, status);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const dismissRequest = async (id) => {
    await db.updateRequestStatus(id, 'resolved');
    setRequests(requests.filter(r => r.id !== id));
  };

  const generateBill = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('RAINBOWS KITCHEN', 20, 20);
    doc.setFontSize(14);
    doc.text(`Bill for Table ${order.table_number}`, 20, 30);
    doc.text(`Date & Time: ${new Date(order.created_at).toLocaleString()}`, 20, 40);
    doc.text('---------------------------------------------------------', 20, 50);
    
    let y = 60;
    doc.setFontSize(12);
    order.order_items?.forEach((item) => {
      const itemName = item.menu_items?.name || `Item ${item.menu_item_id}`;
      doc.text(`${item.quantity}x ${itemName}`, 20, y);
      doc.text(`Rs. ${item.price_at_time * item.quantity}`, 160, y);
      y += 10;
    });
    
    doc.text('---------------------------------------------------------', 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Grand Total: Rs. ${order.total_amount}`, 130, y);
    doc.setFontSize(10);
    y += 20;
    doc.text('Thank you for dining with us!', 20, y);
    
    doc.save(`Bill_Table_${order.table_number}_${order.id.slice(-4)}.pdf`);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : filter === 'active' 
      ? orders.filter(o => !['completed', 'cancelled'].includes(o.status))
      : orders.filter(o => o.status === filter);

  return (
    <div className="container" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
      <header className="flex justify-between items-center" style={{marginBottom: '2rem'}}>
        <h1>Owner Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/manage" className="btn btn-icon"><Settings size={20} /></Link>
          <Link to="/analytics" className="btn btn-icon"><BarChart size={20} /></Link>
          <Link to="/qr" className="btn btn-icon"><QrCode size={20} /></Link>
          <button 
            className="btn btn-icon" 
            onClick={toggleSound}
            title={soundEnabled ? "Disable new order sound" : "Enable new order sound"}
            style={{ color: soundEnabled ? 'var(--success)' : 'var(--text-secondary)' }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="flex items-center gap-2" style={{marginLeft: '0.5rem', background: 'var(--surface-color)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)'}}>
            <Bell color="var(--primary)" size={20} />
            <span style={{fontWeight: 600}}>{orders.filter(o => o.status === 'pending').length} New</span>
          </div>
        </div>
      </header>

      {requests.length > 0 && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
          {requests.map(req => (
            <div key={req.id} className="animate-pulse-glow" style={{background: '#ef4444', color: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)', border: '2px solid #fca5a5'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <BellRing size={32} />
                  <div>
                    <h3 style={{fontSize: '1.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase'}}>Table {req.table_number} Service Required</h3>
                    <p style={{fontSize: '1.1rem', margin: '0.25rem 0 0 0', fontWeight: 700}}>Requested: {req.type.toUpperCase()}</p>
                  </div>
               </div>
               <button onClick={() => dismissRequest(req.id)} style={{background: 'white', color: '#ef4444', border: 'none', padding: '0.8rem 1.5rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase'}}>
                 <Check size={20} /> Acknowledge
               </button>
            </div>
          ))}
        </div>
      )}

      <div className="category-tabs" style={{marginBottom: '2rem'}}>
        {['active', 'all', 'pending', 'preparing', 'served', 'completed'].map(f => (
          <button 
            key={f}
            className={`tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            style={{textTransform: 'capitalize'}}
          >
            {f} ({f === 'all' ? orders.length : f === 'active' ? orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length : orders.filter(o => o.status === f).length})
          </button>
        ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem'}}>
        {filteredOrders.map(order => (
          <div key={order.id} className="glass-card flex flex-col justify-between" style={{borderLeft: `4px solid ${order.status === 'pending' ? 'var(--warning)' : order.status === 'preparing' ? 'var(--primary)' : 'var(--success)'}`}}>
            <div>
              <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.2rem', margin: 0}}>Table {order.table_number}</h3>
                <span style={{fontSize: '0.8rem', background: 'var(--surface-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 600}}>
                  {order.status}
                </span>
              </div>
              <p style={{fontSize: '0.9rem', marginBottom: '1rem'}}>{new Date(order.created_at).toLocaleTimeString()}</p>
              
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', fontSize: '0.95rem'}}>
                {order.order_items?.map((item, i) => (
                  <li key={i} className="flex justify-between" style={{marginBottom: '0.5rem', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.5rem'}}>
                    <span>{item.quantity}x {item.menu_items?.name || `Item ${item.menu_item_id}`}</span>
                    <span style={{color: 'var(--text-secondary)'}}>₹{item.price_at_time * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                <span style={{fontWeight: 'bold'}}>Total:</span>
                <span style={{fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)'}}>₹{order.total_amount}</span>
              </div>
              
              <div className="flex gap-2" style={{flexWrap: 'wrap'}}>
                {order.status === 'pending' && (
                  <button className="btn btn-primary" style={{flex: 1}} onClick={() => updateStatus(order.id, 'preparing')}>
                    <Check size={16} /> Accept
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button className="btn" style={{flex: 1, background: 'var(--warning)', color: 'white'}} onClick={() => updateStatus(order.id, 'served')}>
                    <ChefHat size={16} /> Serve
                  </button>
                )}
                {order.status === 'served' && (
                  <button className="btn" style={{flex: 1, background: 'var(--success)', color: 'white'}} onClick={() => updateStatus(order.id, 'completed')}>
                    <CheckSquare size={16} /> Complete
                  </button>
                )}
                {order.status === 'completed' && (
                  <button className="btn" style={{flex: 1, border: '1px solid var(--text-secondary)'}} onClick={() => generateBill(order)}>
                    <Printer size={16} /> Print Bill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
            No orders found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
