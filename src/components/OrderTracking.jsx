import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { CheckCircle, Clock, Utensils, Coffee, Bell } from 'lucide-react';
import Confetti from 'react-confetti';

export default function OrderTracking({ order, onNewOrder }) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after a glorious moment
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Poll for order status updates
    const interval = setInterval(async () => {
      const { data } = await db.getAllOrders();
      if (data) {
        const updated = data.find(o => o.id === currentOrder.id);
        if (updated && updated.status !== currentOrder.status) {
          setCurrentOrder(updated);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentOrder.id, currentOrder.status]);

  const steps = [
    { status: 'pending', label: 'Order Received', icon: Clock, color: 'var(--warning)', desc: 'We are reviewing your choices.' },
    { status: 'preparing', label: 'Preparing', icon: Utensils, color: 'var(--primary)', desc: 'Your food is in the kitchen.' },
    { status: 'served', label: 'Served', icon: CheckCircle, color: 'var(--success)', desc: 'Enjoy your meal!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === currentOrder.status) >= 0 
    ? steps.findIndex(s => s.status === currentOrder.status) 
    : (currentOrder.status === 'completed' ? 3 : 0);

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen animate-fade-in" style={{padding: '2rem'}}>
      {showConfetti && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          recycle={false} 
          numberOfPieces={600} 
          gravity={0.15} 
          initialVelocityY={20}
          colors={['#FF416C', '#FF4B2B', '#10b981', '#f59e0b', '#3b82f6', '#f8fafc']} 
          style={{position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none'}} 
        />
      )}
      
      <div className="glass-card" style={{width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative', overflow: 'hidden'}}>
        {/* Animated background blob for tracking */}
        <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: currentStepIndex === 0 ? 'var(--warning)' : currentStepIndex === 1 ? 'var(--primary)' : 'var(--success)', filter: 'blur(60px)', opacity: 0.2, transition: 'all 1s ease', borderRadius: '50%'}}></div>

        <div style={{textAlign: 'center', marginBottom: '2.5rem', zIndex: 1, position: 'relative'}}>
          <div style={{display: 'inline-flex', padding: '1rem', background: 'var(--surface-color)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem'}}>
             {currentStepIndex === 2 ? <CheckCircle size={40} color="var(--success)" /> : <Coffee size={40} color="var(--primary)" />}
          </div>
          <h2 style={{fontSize: '1.8rem', letterSpacing: '-0.03em', margin: 0}}>Order Placed</h2>
          <p style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', margin: '0.25rem 0 0 0'}}>Table {currentOrder.table_number} • <span style={{color: 'var(--text-primary)'}}>₹{currentOrder.total_amount}</span></p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            marginTop: '1rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            border: '1px solid rgba(255, 65, 108, 0.15)'
          }}>
            ⏱️ Your order will take 15 mins
          </div>
        </div>

        <div style={{position: 'relative', paddingLeft: '1rem', marginBottom: '3rem', zIndex: 1}}>
          {/* Vertical progress line */}
          <div style={{position: 'absolute', top: '20px', bottom: '20px', left: '33px', width: '3px', background: 'var(--glass-border)', zIndex: -1}}></div>
          
          <div style={{position: 'absolute', top: '20px', left: '33px', width: '3px', background: 'var(--primary-gradient)', zIndex: 0, height: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%', transition: 'height 0.8s ease'}}></div>

          <div className="flex flex-col gap-6" style={{textAlign: 'left'}}>
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={step.status} className="flex items-center gap-4" style={{opacity: isActive || isPast ? 1 : 0.4, transition: 'opacity 0.4s ease'}}>
                  <div style={{position: 'relative'}}>
                    {/* Pulsing ring for active step */}
                    {isActive && (
                      <div style={{position: 'absolute', top: 0, left: 0, width: '48px', height: '48px', borderRadius: '50%', background: step.color, opacity: 0.2, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
                    )}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isPast ? step.color : (isActive ? step.color : 'var(--surface-color)'),
                      color: isActive || isPast ? 'white' : 'var(--text-secondary)',
                      boxShadow: isActive ? `0 0 20px ${step.color}66` : 'var(--shadow-sm)',
                      border: isPast || isActive ? 'none' : '2px solid var(--glass-border)',
                      position: 'relative', zIndex: 2,
                      transition: 'all 0.4s ease'
                    }}>
                      <step.icon size={22} />
                    </div>
                  </div>
                  <div style={{flex: 1}}>
                    <h4 style={{margin: 0, fontSize: '1.2rem', fontWeight: 800, color: isActive ? 'var(--text-primary)' : (isPast ? 'var(--text-secondary)' : 'var(--text-tertiary)')}}>
                      {step.label}
                    </h4>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0', fontWeight: 500}}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button className="btn btn-outline w-full" onClick={onNewOrder} style={{padding: '1rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)'}}>
          <Bell size={18} style={{marginRight: '0.5rem'}} /> Call Waiter / Add More
        </button>

        <style>{`
          @keyframes ping {
            75%, 100% { transform: scale(1.5); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
