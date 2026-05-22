import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Pencil, Trash2, Plus, ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem';

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category_id: '', image_url: '' });
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [{ data: menuItems }, { data: cats }] = await Promise.all([
        db.getMenuItems(true),
        db.getCategories()
      ]);
      if (menuItems) setItems(menuItems);
      if (cats) {
        setCategories(cats);
        setNewItem(prev => ({ ...prev, category_id: cats[0]?.id }));
      }
    }
    loadData();
  }, []);

  const handleToggleStock = async (id, current) => {
    await db.updateMenuItem(id, { is_available: !current });
    setItems(items.map(item => item.id === id ? { ...item, is_available: !current } : item));
  };

  const handleToggleBestseller = async (id, current) => {
    await db.updateMenuItem(id, { is_bestseller: !current });
    setItems(items.map(item => item.id === id ? { ...item, is_bestseller: !current } : item));
  };


  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return alert('Name and Price required');
    const { data } = await db.addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      category_id: newItem.category_id,
      image_url: newItem.image_url || null,
      is_available: true,
      is_bestseller: false
    });
    if (data) {
      setItems([...items, data]);
      setIsAdding(false);
      setNewItem({ name: '', price: '', category_id: categories[0]?.id, image_url: '' });
    }
  };

  return (
    <div className="container" style={{paddingTop: '2rem'}}>
      <header className="flex justify-between items-center" style={{marginBottom: '2rem'}}>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="btn btn-icon"><ArrowLeft size={20} /></Link>
          <h1>Menu Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16}/> {isAdding ? 'Cancel' : 'Add Item'}
        </button>
      </header>

      {isAdding && (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="glass-card" style={{flex: 1, background: 'var(--surface-color-light)', height: 'fit-content'}}>
            <h2 style={{fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800}}>Add New Menu Item</h2>
            <div className="flex gap-4 items-end flex-wrap">
              <div style={{flex: 1, minWidth: '100%'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem'}}>Item Name (Live Previewing)</label>
                <input 
                  type="text" 
                  value={newItem.name} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})} 
                  placeholder="e.g. Szechuan Fried Rice"
                  style={{width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid rgba(0,0,0,0.05)', fontSize: '1.1rem', fontWeight: 600}} 
                />
              </div>
              <div style={{flex: 1, minWidth: '45%'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem'}}>Category</label>
                <select 
                  value={newItem.category_id} 
                  onChange={e => setNewItem({...newItem, category_id: e.target.value})}
                  style={{width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid rgba(0,0,0,0.05)', fontSize: '1.1rem'}} 
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{flex: 1, minWidth: '45%'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem'}}>Price (₹)</label>
                <input 
                  type="number" 
                  value={newItem.price} 
                  onChange={e => setNewItem({...newItem, price: e.target.value})} 
                  placeholder="e.g. 250"
                  style={{width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid rgba(0,0,0,0.05)', fontSize: '1.1rem', fontWeight: 600}} 
                />
              </div>
              <div style={{flex: 1, minWidth: '100%', marginTop: '0.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem'}}>Upload Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIsUploading(true);
                      const { data, error } = await db.uploadImage(file);
                      setIsUploading(false);
                      if (error) alert('Failed to upload image: ' + error.message);
                      else setNewItem({...newItem, image_url: data});
                    }
                  }} 
                  style={{width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid rgba(0,0,0,0.05)', fontSize: '1.1rem', background: 'white'}} 
                />
                {isUploading && <span style={{display: 'block', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold'}} className="animate-pulse-glow">Uploading image...</span>}
              </div>
              <button className="btn btn-primary w-full mt-4" onClick={handleAddItem} style={{padding: '1.2rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                Publish to Live Menu
              </button>
            </div>
          </div>

          <div style={{width: '320px', flexShrink: 0, margin: '0 auto'}}>
            <label style={{display: 'block', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Live Customer Preview</label>
            <div style={{
              width: '100%', 
              height: '600px', 
              background: '#0f172a', 
              borderRadius: '40px', 
              border: '12px solid #1e293b', 
              padding: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 4px #000',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* iPhone Notch */}
              <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '25px', background: '#1e293b', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50}}></div>
              
              <div style={{background: 'var(--bg-gradient)', width: '100%', height: '100%', borderRadius: '24px', overflowY: 'auto', padding: '2rem 1rem 1rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', alignContent: 'start', overflowX: 'hidden'}}>
                <MenuItem 
                  item={{
                    name: newItem.name || 'Stunning Dish Name',
                    price: newItem.price || '0',
                    is_bestseller: true,
                    image_url: newItem.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
                  }}
                  quantity={0}
                  onUpdate={() => {}}
                  onClick={() => {}}
                />
                
                <h3 style={{gridColumn: '1 / -1', fontSize: '1rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem'}}>
                  This is exactly how your customers will see it on their phones.
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', minWidth: '700px', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
              <th style={{padding: '1rem', color: 'var(--text-secondary)'}}>Bestseller</th>
              <th style={{padding: '1rem', color: 'var(--text-secondary)'}}>Name</th>
              <th style={{padding: '1rem', color: 'var(--text-secondary)'}}>Category</th>
              <th style={{padding: '1rem', color: 'var(--text-secondary)'}}>Price</th>
              <th style={{padding: '1rem', color: 'var(--text-secondary)'}}>Stock</th>
              <th style={{padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const cat = categories.find(c => c.id === item.category_id)?.name || 'Unknown';
              return (
                <tr key={item.id} style={{borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'var(--transition)'}}>
                  <td style={{padding: '1rem', textAlign: 'center'}}>
                    <button 
                      onClick={() => handleToggleBestseller(item.id, item.is_bestseller)}
                      style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem'}}
                    >
                      <Star size={20} fill={item.is_bestseller ? '#FF416C' : 'none'} color={item.is_bestseller ? '#FF416C' : 'rgba(0,0,0,0.2)'} />
                    </button>
                  </td>
                  <td style={{padding: '1rem', fontWeight: 600}}>{item.name}</td>
                  <td style={{padding: '1rem', color: 'var(--text-secondary)'}}>{cat}</td>
                  <td style={{padding: '1rem', fontWeight: 700}}>₹{item.price}</td>
                  <td style={{padding: '1rem'}}>
                    <button 
                      onClick={() => handleToggleStock(item.id, item.is_available)}
                      className="btn"
                      style={{
                        padding: '0.4rem 1rem', 
                        fontSize: '0.85rem', 
                        background: item.is_available ? 'var(--success)' : 'rgba(239, 68, 68, 0.1)',
                        color: item.is_available ? 'white' : 'var(--danger)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.is_available ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td style={{padding: '1rem', textAlign: 'right'}} className="flex items-center justify-end gap-2">
                    <button className="btn btn-icon" onClick={() => setModalState({ type: 'image', data: item })} style={{background: 'var(--surface-color-light)', color: 'var(--primary)'}} title="Change Image">
                      <ImageIcon size={16} />
                    </button>
                    <button className="btn btn-icon" onClick={() => setModalState({ type: 'price', data: item })} style={{background: 'var(--surface-color-light)'}} title="Edit Price">
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-icon" onClick={() => setModalState({ type: 'delete', data: item })} style={{color: 'var(--danger)', background: 'var(--surface-color-light)'}} title="Delete Item">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Premium Custom Modals */}
      {modalState.type === 'price' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
          <div className="glass-card" style={{padding: '2rem', width: '90%', maxWidth: '400px'}}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.4rem'}}>Edit Price: {modalState.data.name}</h2>
            <input type="number" id="modal-price" defaultValue={modalState.data.price} placeholder="Enter new price" style={{width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', marginBottom: '1.5rem'}} />
            <div className="flex gap-4 justify-end">
              <button className="btn btn-outline" onClick={() => setModalState({type: null})}>Cancel</button>
              <button className="btn btn-primary" onClick={async () => {
                const newPrice = parseFloat(document.getElementById('modal-price').value);
                if (!isNaN(newPrice)) {
                  await db.updateMenuItem(modalState.data.id, { price: newPrice });
                  setItems(items.map(i => i.id === modalState.data.id ? { ...i, price: newPrice } : i));
                }
                setModalState({type: null});
              }}>Save Price</button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === 'image' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
          <div className="glass-card" style={{padding: '2rem', width: '90%', maxWidth: '500px'}}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.4rem'}}>Update Image: {modalState.data.name}</h2>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  setIsUploading(true);
                  const { data, error } = await db.uploadImage(file);
                  setIsUploading(false);
                  if (error) {
                    alert('Failed to upload image: ' + error.message);
                  } else {
                    await db.updateMenuItem(modalState.data.id, { image_url: data });
                    setItems(items.map(i => i.id === modalState.data.id ? { ...i, image_url: data } : i));
                    setModalState({type: null});
                  }
                }
              }} 
              style={{width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', marginBottom: '1.5rem', background: 'white'}} 
            />
            {isUploading && <p style={{color: 'var(--primary)', fontWeight: 'bold'}} className="animate-pulse-glow">Uploading image to database...</p>}
            
            <div className="flex gap-4 justify-end">
              <button className="btn btn-outline" onClick={() => setModalState({type: null})}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'}}>
          <div className="glass-card" style={{padding: '2rem', width: '90%', maxWidth: '400px'}}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.4rem', color: 'var(--danger)'}}>Delete {modalState.data.name}?</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>Are you absolutely sure? This action cannot be undone and will instantly remove it from the live menu.</p>
            <div className="flex gap-4 justify-end">
              <button className="btn btn-outline" onClick={() => setModalState({type: null})}>Cancel</button>
              <button className="btn" style={{backgroundColor: 'var(--danger)', color: 'white', border: 'none'}} onClick={async () => {
                await db.deleteMenuItem(modalState.data.id);
                setItems(items.filter(i => i.id !== modalState.data.id));
                setModalState({type: null});
              }}>Yes, Delete It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
