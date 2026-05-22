import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ShoppingBag, X, Moon, Sun, BellRing, Droplets, Receipt, UserRound, Languages } from 'lucide-react';
import { db } from '../lib/db';
import MenuItem from '../components/MenuItem';
import Cart from '../components/Cart';
import OrderTracking from '../components/OrderTracking';
import { t } from '../lib/translations';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'kn' : 'en');

  const handleServiceRequest = async (type) => {
    if (!table) return;
    await db.addRequest(table, type);
    setShowServiceMenu(false);
    alert('Request sent to the kitchen instantly!');
  };
  

  const [cartItems, setCartItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      const { data: cats } = await db.getCategories();
      const { data: menu } = await db.getMenuItems();
      setCategories(cats || []);
      setItems(menu || []);
      if (cats && cats.length > 0) setActiveCategory(cats[0].id);
    }
    loadMenu();
  }, []);

  const handleUpdateQuantity = (item, delta) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.menu_item_id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(ci => ci.menu_item_id !== item.id);
        return prev.map(ci => ci.menu_item_id === item.id ? { ...ci, quantity: newQty } : ci);
      }
      if (delta > 0) {
        return [...prev, {
          menu_item_id: item.id,
          name: item.name,
          price_at_time: item.price,
          quantity: 1
        }];
      }
      return prev;
    });
  };

  const handlePlaceOrder = async (customerName) => {
    if (!table) return alert('No table selected! Please scan the QR code from your table.');
    
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
    
    const { data: order, error } = await db.placeOrder({
      table_number: parseInt(table),
      customer_name: customerName,
      total_amount: totalAmount,
    }, cartItems);

    if (error) {
      alert('Failed to place order. Please try again.');
    } else {
      setCartItems([]);
      setActiveOrder(order);
    }
  };

  if (!table) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen" style={{padding: '2rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>{t('Scan QR to Order', language)}</h2>
        <p style={{marginBottom: '1.5rem'}}>Please scan the specific QR code on your table to view the menu.</p>
        <button 
          onClick={() => window.location.href='/menu?table=1'} 
          style={{padding: '12px 24px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
        >
          Simulate Table 1 (Testing)
        </button>
      </div>
    );
  }

  if (activeOrder) {
    return <OrderTracking order={activeOrder} onNewOrder={() => setActiveOrder(null)} />;
  }

  const categoryItems = items.filter(item => item.category_id === activeCategory);
  
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container" style={{paddingBottom: '6rem'}}>
      <header className="animate-fade-in" style={{
        position: 'relative', 
        height: '220px', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80")', // Example stunning food background
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        borderBottomLeftRadius: '2rem',
        borderBottomRightRadius: '2rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '0.5rem',
        overflow: 'hidden'
      }}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1}}></div>
        
        <div className="flex items-end gap-4" style={{position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem', zIndex: 10}}>
            <img src="/logo.jpeg" alt="Rainbows Kitchen" style={{width: '72px', height: '72px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.9)'}} />
            <div style={{flex: 1, paddingBottom: '0.25rem'}}>
              <h1 style={{fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.1}}>Rainbows Kitchen</h1>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem'}}>
                <span style={{fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.6rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>Table {table}</span>
                <span className="animate-pulse-glow" style={{fontSize: '0.8rem', color: '#10b981', fontWeight: 800, textShadow: '0 1px 4px rgba(0,0,0,0.9)', display: 'inline-block', borderRadius: '50%'}}>• Accepting Orders</span>
              </div>
            </div>
        </div>
        
        <div style={{position: 'absolute', top: '1.25rem', right: '8.5rem', zIndex: 10, cursor: 'pointer', background: 'var(--surface-color)', backdropFilter: 'blur(10px)', padding: '0.6rem 0.8rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--text-primary)'}} onClick={toggleLanguage}>
            <Languages size={18} color="var(--primary)" />
            <span style={{fontSize: '0.8rem'}}>{language === 'en' ? 'EN' : 'ಕನ್ನಡ'}</span>
        </div>

        <div style={{position: 'absolute', top: '1.25rem', right: '4.5rem', zIndex: 10, cursor: 'pointer', background: 'var(--surface-color)', backdropFilter: 'blur(10px)', padding: '0.6rem', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={22} color="#f59e0b" /> : <Moon size={22} color="#3b82f6" />}
        </div>

        <div style={{position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, cursor: 'pointer', background: 'var(--surface-color)', backdropFilter: 'blur(10px)', padding: '0.6rem', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}>
            <ShoppingBag size={22} color="var(--text-primary)" />
            {totalCartItems > 0 && (
              <span className="animate-breathe" style={{position: 'absolute', top: '-6px', right: '-6px', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 800, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white'}}>
                {totalCartItems}
              </span>
            )}
        </div>
      </header>

      {/* Sticky Horizontal Categories */}
      <div style={{position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-gradient)', paddingTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'}}>
        <div className="category-tabs" style={{padding: '0 1.25rem'}}>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {t(cat.name, language)}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding: '1.25rem 1rem'}}>
        <h2 style={{fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 800}}>
          {t(categories.find(c => c.id === activeCategory)?.name || '', language)} ({categoryItems.length})
        </h2>
        
        <div className="animate-fade-in" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          {categoryItems.map((item) => {
            const cartItem = cartItems.find(c => c.menu_item_id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <MenuItem 
                key={item.id}
                item={{...item, name: t(item.name, language)}} 
                quantity={quantity} 
                onUpdate={(delta) => handleUpdateQuantity(item, delta)} 
                onClick={() => setSelectedDish(item)}
              />
            );
          })}
        </div>
      </div>

      {cartItems.length > 0 && (
        <Cart items={cartItems} onPlaceOrder={handlePlaceOrder} onUpdateQuantity={handleUpdateQuantity} />
      )}

      {/* Floating Service Bell */}
      <button 
        onClick={() => setShowServiceMenu(true)}
        className="animate-pulse-glow"
        style={{
          position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 40,
          background: 'var(--surface-color)', color: 'var(--text-primary)', border: '2px solid var(--glass-border)',
          width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-floating)', backdropFilter: 'blur(10px)'
        }}
      >
        <BellRing size={28} color="var(--primary)" />
      </button>

      {/* Service Request Modal */}
      {showServiceMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
          <div className="glass-card" style={{width: '90%', maxWidth: '340px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div className="flex justify-between items-center mb-2">
              <h3 style={{fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)'}}>{t('Service Bell', language)}</h3>
              <button onClick={() => setShowServiceMenu(false)} className="btn btn-icon"><X size={20}/></button>
            </div>
            <button onClick={() => handleServiceRequest('water')} className="btn btn-outline" style={{padding: '1rem', fontSize: '1.1rem'}}><Droplets size={20} style={{marginRight: '0.5rem', color: '#3b82f6'}} /> {t('Need Water', language)}</button>
            <button onClick={() => handleServiceRequest('onion_lemon')} className="btn btn-outline" style={{padding: '1rem', fontSize: '1.1rem'}}><span style={{marginRight: '0.5rem', fontSize: '1.2rem'}}>🧅🍋</span> {t('Need Onion & Lemon', language)}</button>
            <button onClick={() => handleServiceRequest('waiter')} className="btn btn-outline" style={{padding: '1rem', fontSize: '1.1rem'}}><UserRound size={20} style={{marginRight: '0.5rem', color: '#10b981'}} /> {t('Call Waiter', language)}</button>
            <button onClick={() => handleServiceRequest('bill')} className="btn btn-outline" style={{padding: '1rem', fontSize: '1.1rem'}}><Receipt size={20} style={{marginRight: '0.5rem', color: '#f59e0b'}} /> {t('Request Bill', language)}</button>
          </div>
        </div>
      )}

      {/* Full Screen Cinematic Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex flex-col animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)'}}>
          <div style={{position: 'relative', width: '100%', height: '50vh'}}>
             <img src={selectedDish.image_url || selectedDish.fallback_image_url || ''} alt={selectedDish.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
             <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)'}}></div>
             <button onClick={() => setSelectedDish(null)} style={{position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', padding: '0.6rem', backdropFilter: 'blur(10px)', cursor: 'pointer'}}>
               <span style={{fontSize: '1.2rem', fontWeight: 900, lineHeight: 1}}>✕</span>
             </button>
          </div>
          <div style={{flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', marginTop: '-32px', zIndex: 10, boxShadow: '0 -10px 30px rgba(0,0,0,0.4)'}}>
             <div className="flex justify-between items-start mb-4">
               <h2 style={{fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0, paddingRight: '1rem'}}>{t(selectedDish.name, language)}</h2>
               <span style={{fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)'}}>₹{selectedDish.price}</span>
             </div>
             
             <p style={{fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, fontWeight: 500}}>
               {selectedDish.description || "A wildly delicious specialty from Rainbows Kitchen. Freshly prepared upon ordering with the absolute highest quality local ingredients. Indulge in perfection."}
             </p>

             <button 
               className="btn btn-primary w-full animate-pulse-glow" 
               style={{padding: '1.25rem', fontSize: '1.2rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 900, marginTop: '2rem'}}
               onClick={() => {
                 handleUpdateQuantity(selectedDish, 1);
                 setSelectedDish(null);
               }}
             >
               {t('Add to Order', language)}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
