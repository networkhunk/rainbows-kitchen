import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { Clock, AlertTriangle, BellRing, Check } from 'lucide-react';

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const prevOrdersLen = useRef(0);

  useEffect(() => {
    async function loadAll() {
      const { data: activeOrders } = await db.getActiveOrders();

      if (activeOrders) {
        const active = activeOrders.filter(o => ['pending', 'preparing'].includes(o.status));
        setOrders(active);
        
        if (active.length > prevOrdersLen.current && prevOrdersLen.current !== 0) {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        }
        prevOrdersLen.current = active.length;
      }
    }
    
    loadAll();
    const loadInterval = setInterval(loadAll, 3000);
    const timeInterval = setInterval(() => setNow(Date.now()), 1000);
    
    return () => { clearInterval(loadInterval); clearInterval(timeInterval); };
  }, []);

  const updateStatus = async (orderId, status) => {
    await db.updateOrderStatus(orderId, status);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    if (status !== 'served') {
       const audio = new Audio('https://actions.google.com/sounds/v1/impacts/wood_plank_drop.ogg');
       audio.play().catch(() => {});
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e, orderId) => { e.dataTransfer.setData('orderId', orderId); e.target.style.opacity = '0.5'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; };
  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; };
  const handleDragLeave = (e) => { e.currentTarget.style.backgroundColor = 'transparent'; };
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'transparent';
    const orderId = e.dataTransfer.getData('orderId');
    const order = orders.find(o => String(o.id) === String(orderId));
    if (order && order.status !== newStatus) {
      updateStatus(order.id, newStatus);
    }
  };

  const getWaitTime = (createdAt) => {
    if (!createdAt) return { text: '00:00', isLate: false };
    const diff = Math.floor((now - new Date(createdAt).getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return { text: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`, isLate: m >= 10 };
  };

  const renderColumn = (title, statusId, color, darkColor) => {
    const columnOrders = orders.filter(o => o.status === statusId);
    return (
      <div 
        style={{flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', borderRadius: '16px', border: `2px solid ${darkColor}`, overflow: 'hidden'}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, statusId)}
      >
        <div style={{backgroundColor: darkColor, padding: '1rem', borderBottom: `2px solid ${color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <h2 style={{fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0}}>{title}</h2>
           <span style={{background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontWeight: 800}}>{columnOrders.length}</span>
        </div>
        
        <div style={{padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {columnOrders.map(order => {
             const wait = getWaitTime(order.created_at);
             const isWarning = wait.isLate && statusId === 'pending';
             return (
               <div 
                 key={order.id} 
                 draggable
                 onDragStart={(e) => handleDragStart(e, order.id)}
                 onDragEnd={handleDragEnd}
                 className={isWarning ? 'animate-pulse-glow' : ''}
                 style={{
                   backgroundColor: isWarning ? '#7f1d1d' : '#1e293b',
                   border: `2px solid ${isWarning ? '#ef4444' : color}`,
                   borderRadius: '12px',
                   padding: '1.25rem',
                   cursor: 'grab',
                   boxShadow: isWarning ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 4px 6px rgba(0,0,0,0.3)',
                   transition: 'all 0.2s ease'
                 }}
               >
                 <div className="flex justify-between items-center" style={{marginBottom: '0.75rem'}}>
                   <h3 style={{fontSize: '2rem', fontWeight: 900, margin: 0, color: 'white'}}>TBL {order.table_number}</h3>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '8px', color: isWarning ? '#fca5a5' : 'white'}}>
                     {isWarning ? <AlertTriangle size={18} /> : <Clock size={18} />}
                     <span style={{fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace'}}>{wait.text}</span>
                   </div>
                 </div>
                 
                 <div style={{fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem'}}>Order #{order.id} {order.customer_name ? `• ${order.customer_name}` : ''}</div>

                 <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                   {order.order_items?.map((item, i) => (
                     <li key={i} className="flex gap-3 items-start" style={{fontSize: '1.1rem', fontWeight: 700}}>
                       <span style={{background: color, color: '#000', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', flexShrink: 0}}>{item.quantity}</span>
                       <span style={{color: '#f8fafc', lineHeight: 1.3}}>{item.menu_items?.name || `Item ${item.menu_item_id}`}</span>
                     </li>
                   ))}
                 </ul>
                 
                 {statusId === 'preparing' && (
                   <button 
                     onClick={() => updateStatus(order.id, 'served')}
                     style={{width: '100%', marginTop: '1.5rem', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase'}}
                   >
                     Mark Served (✓)
                   </button>
                 )}
               </div>
             )
          })}
          {columnOrders.length === 0 && (
            <div style={{textAlign: 'center', color: '#475569', fontWeight: 800, padding: '3rem 0', fontSize: '1.2rem', textTransform: 'uppercase'}}>Drag Orders Here</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{padding: '1.5rem', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#020617', color: '#f8fafc'}}>
      <header className="flex justify-between items-center" style={{marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1e293b'}}>
        <div className="flex items-center gap-3">
           <div style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981'}}></div>
           <h1 style={{fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '0.05em'}}>KITCHEN COMMAND</h1>
        </div>
        <div style={{fontSize: '2rem', fontWeight: 900, fontFamily: 'monospace', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
           {new Date(now).toLocaleTimeString()}
        </div>
      </header>

      <div style={{display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0}}>
        {renderColumn('Pending', 'pending', '#f59e0b', '#78350f')}
        {renderColumn('Preparing (Cooking)', 'preparing', '#3b82f6', '#1e3a8a')}
      </div>
    </div>
  );
}
