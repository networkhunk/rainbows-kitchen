import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function Cart({ items, onPlaceOrder, onUpdateQuantity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const totalAmount = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) {
    return (
      <div className="floating-cart" onClick={() => setIsOpen(true)}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize: '0.8rem', opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em'}}>{totalItems} ITEM{totalItems > 1 ? 'S' : ''} ADDED</span>
          <span style={{fontSize: '1.2rem', fontWeight: 800}}>₹{totalAmount}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)'}}>
          View Cart <ShoppingBag size={20} fill="white" color="var(--primary)"/>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 100}}>
      <div className="glass-card" style={{width: '100%', maxWidth: '600px', maxHeight: '85vh', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, display: 'flex', flexDirection: 'column', marginTop: 'auto', backgroundColor: 'var(--surface-color-light)', padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-floating)'}}>
        
        <div className="flex justify-between items-center" style={{padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'var(--surface-color)', backdropFilter: 'blur(20px)'}}>
          <h2 style={{fontSize: '1.5rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em'}}>Your Order</h2>
          <button className="btn-icon" onClick={() => setIsOpen(false)} style={{background: 'var(--surface-color)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)'}}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', background: 'transparent'}}>
          <div className="glass-card" style={{padding: '0.5rem 1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)'}}>
            {items.map((item, i) => (
              <div key={item.menu_item_id} className="flex justify-between items-center" style={{padding: '1.25rem 0', borderBottom: i === items.length - 1 ? 'none' : '1px dashed rgba(0,0,0,0.1)'}}>
                <div style={{flex: 1}}>
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{width: '14px', height: '14px', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px'}}>
                      <div style={{width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%'}}></div>
                    </div>
                    <h4 style={{fontSize: '1.1rem', margin: 0, fontWeight: 700}}>{item.name}</h4>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600}}>₹{item.price_at_time}</p>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                  <div className="flex items-center" style={{backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)', padding: '0.2rem'}}>
                    <button className="btn-icon" onClick={() => onUpdateQuantity({id: item.menu_item_id}, -1)} style={{width: '32px', height: '32px', background: 'transparent', color: 'var(--primary)', border: 'none'}}>
                      <Minus size={16} strokeWidth={3}/>
                    </button>
                    <span style={{fontWeight: '800', width: '24px', textAlign: 'center', fontSize: '1rem', color: 'var(--primary)'}}>{item.quantity}</span>
                    <button className="btn-icon" onClick={() => onUpdateQuantity({id: item.menu_item_id}, 1)} style={{width: '32px', height: '32px', background: 'transparent', color: 'var(--primary)', border: 'none'}}>
                      <Plus size={16} strokeWidth={3}/>
                    </button>
                  </div>
                  <span style={{fontWeight: '800', fontSize: '1.2rem', minWidth: '60px', textAlign: 'right', color: 'var(--text-primary)'}}>
                    ₹{item.price_at_time * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass-card" style={{padding: '1.5rem', borderRadius: 'var(--radius-lg)'}}>
            <label style={{display: 'block', marginBottom: '0.75rem', fontWeight: '800', fontSize: '1rem'}}>Add Cooking Instructions / Name</label>
            <input 
              type="text" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g. Less spicy, Party Name (Optional)" 
              style={{width: '100%', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '2px solid rgba(0,0,0,0.05)', background: 'var(--surface-color-light)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', transition: 'var(--transition)', fontWeight: 500}}
              onFocus={e => {e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-light)';}}
              onBlur={e => {e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.boxShadow = 'none';}}
            />
          </div>
        </div>
        
        <div style={{padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)'}}>
          <div className="flex justify-between items-center mb-4">
            <span style={{fontWeight: '700', color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Grand Total</span>
            <span style={{fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)'}}>₹{totalAmount}</span>
          </div>
          <button 
            className="btn btn-primary w-full flex items-center justify-center gap-2 animate-pulse-glow" 
            onClick={() => onPlaceOrder(customerName)}
            style={{padding: '1.2rem', fontSize: '1.2rem', borderRadius: 'var(--radius-full)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase'}}
          >
            Place Order <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
