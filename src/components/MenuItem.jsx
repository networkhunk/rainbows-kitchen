import { Plus, Minus, Star, Heart } from 'lucide-react';
import { useState } from 'react';

export default function MenuItem({ item, quantity, onUpdate, onClick }) {
  const [isLoved, setIsLoved] = useState(false);
  // Bento Grid Styling Logic
  const isBentoHero = item.is_bestseller;
  
  return (
    <div 
      className="menu-card-hover"
      onClick={onClick}
      style={{
        gridColumn: isBentoHero ? '1 / -1' : 'span 1',
        height: isBentoHero ? '280px' : '220px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'var(--surface-color)'
      }}
    >
      {/* Edge-to-edge Background Image */}
      <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} 
            loading="lazy" 
            className="bento-image"
            onError={(e) => {
              if (item.fallback_image_url && e.currentTarget.src !== item.fallback_image_url) {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = item.fallback_image_url;
              }
            }}
          />
        ) : (
           <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}></div>
        )}
      </div>

      {/* Extreme Glassmorphic Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute', 
        inset: 0, 
        background: isBentoHero 
          ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 80%)', 
        zIndex: 1
      }}></div>

      {/* Floating Action Elements (Hearts, Badges) */}
      <div style={{position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
          <div style={{width: '20px', height: '20px', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)'}}>
            <div style={{width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%'}}></div>
          </div>
          {isBentoHero && (
            <span className="animate-pulse-glow" style={{fontSize: '0.7rem', fontWeight: 900, color: '#f59e0b', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.95)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>
               <span className="shimmer-text">Bestseller</span>
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLoved(!isLoved); }}
          style={{background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', color: isLoved ? 'var(--primary)' : 'white', transition: 'all 0.3s ease'}}
        >
         <Heart size={16} fill={isLoved ? 'var(--primary)' : 'transparent'} />
        </button>
      </div>

      {/* Core Typography & Cart Controls */}
      <div style={{zIndex: 2, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%'}}>
        <div style={{flex: 1, paddingRight: '1rem'}}>
          <h3 style={{fontSize: isBentoHero ? '1.5rem' : '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.4)'}}>
            {item.name}
          </h3>
          <p style={{color: '#f8fafc', fontWeight: '800', fontSize: isBentoHero ? '1.2rem' : '1rem', textShadow: '0 1px 5px rgba(0,0,0,0.5)'}}>₹{item.price}</p>
        </div>
        
        {/* Sleek Add Button */}
        <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
          {quantity > 0 ? (
            <div className="flex items-center justify-between" style={{padding: '0.2rem'}}>
              <button 
                onClick={() => onUpdate(-1)} 
                style={{color: 'var(--text-primary)', backgroundColor: 'transparent', border: 'none', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <Minus size={16} strokeWidth={3}/>
              </button>
              <span style={{fontWeight: '900', fontSize: '0.95rem', color: 'var(--primary)', minWidth: '16px', textAlign: 'center'}}>{quantity}</span>
              <button 
                onClick={() => onUpdate(1)} 
                style={{color: 'var(--text-primary)', backgroundColor: 'transparent', border: 'none', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <Plus size={16} strokeWidth={3}/>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onUpdate(1)} 
              style={{padding: '0.5rem 1.25rem', fontWeight: '800', fontSize: '0.9rem', color: 'var(--primary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'var(--transition)'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 65, 108, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
