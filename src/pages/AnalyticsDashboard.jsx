import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/db';
import { ArrowLeft, TrendingUp, IndianRupee, ShoppingBag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsDashboard() {
  const [allOrdersData, setAllOrdersData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await db.getAllOrders();
      if (data) setAllOrdersData(data);
    }
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    // Filter by selected date
    const dailyOrders = allOrdersData.filter(o => {
      // o.created_at looks like "2023-10-25T14:30:00Z"
      return o.created_at && o.created_at.startsWith(selectedDate);
    });

    const completed = dailyOrders.filter(o => o.status === 'completed');
    const totalRevenue = completed.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
    
    const itemCounts = {};
    completed.forEach(order => {
      order.order_items?.forEach(item => {
        const name = item.menu_items?.name || `Item ${item.menu_item_id}`;
        itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalOrders: completed.length,
      totalRevenue,
      popularItems
    };
  }, [allOrdersData, selectedDate]);

  return (
    <div className="container" style={{paddingTop: '2rem'}}>
      <header className="flex flex-wrap justify-between items-center gap-4" style={{marginBottom: '2rem'}}>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="btn btn-icon"><ArrowLeft size={20} /></Link>
          <h1 style={{margin: 0}}>Analytics Dashboard</h1>
        </div>
        
        {/* Date Picker */}
        <div className="glass-card flex items-center gap-3" style={{padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)'}}>
          <Calendar size={18} color="var(--primary)" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem'}}
          />
        </div>
      </header>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div className="glass-card flex items-center gap-4">
          <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-full)'}}>
            <IndianRupee size={32} />
          </div>
          <div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '0.2rem'}}>Daily Revenue</p>
            <h2 style={{fontSize: '2rem', margin: 0}}>₹{stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div style={{padding: '1rem', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-full)'}}>
            <ShoppingBag size={32} />
          </div>
          <div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '0.2rem'}}>Daily Orders</p>
            <h2 style={{fontSize: '2rem', margin: 0}}>{stats.totalOrders}</h2>
          </div>
        </div>
      </div>

      <h2>Menu Insights</h2>
      <div className="glass-card mt-4" style={{padding: '2rem', borderRadius: 'var(--radius-lg)'}}>
        <h3 className="flex items-center gap-2" style={{marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.4rem', letterSpacing: '-0.02em'}}>
          <TrendingUp size={24} /> Most Popular on {new Date(selectedDate).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
        </h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          {stats.popularItems.map(([name, count], index) => {
            const maxCount = stats.popularItems[0]?.[1] || 1;
            const width = `${(count / maxCount) * 100}%`;
            
            return (
              <div key={name} style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                <div className="flex justify-between items-end">
                  <span style={{fontWeight: 600, fontSize: '1.1rem'}}><span style={{color: 'var(--text-tertiary)', marginRight: '0.3rem'}}>#{index + 1}</span> {name}</span>
                  <span style={{fontWeight: 800, color: 'var(--primary)'}}>{count} orders</span>
                </div>
                <div style={{width: '100%', height: '14px', background: 'var(--surface-color-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'}}>
                  <div style={{width: width, height: '100%', background: 'var(--primary-gradient)', borderRadius: 'var(--radius-full)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 10px rgba(255, 65, 108, 0.5)'}}></div>
                </div>
              </div>
            );
          })}
          {stats.popularItems.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No completed orders found for this date.</p>}
        </div>
      </div>
    </div>
  );
}
