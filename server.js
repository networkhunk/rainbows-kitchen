import express from 'express';
import cors from 'cors';
import { categories, menuItems } from './src/lib/mockData.js';

const app = express();
app.use(cors());
app.use(express.json());

let mockOrders = [];
let mockOrderItems = [];

app.get('/api/categories', (req, res) => res.json(categories));
app.get('/api/menuItems', (req, res) => {
  const all = req.query.all === 'true';
  res.json(all ? menuItems : menuItems.filter(i => i.is_available));
});

app.post('/api/menuItems', (req, res) => {
  const newItem = {
    id: `i-${Date.now()}`,
    ...req.body,
    is_available: true,
    is_bestseller: false
  };
  menuItems.push(newItem);
  res.json(newItem);
});

app.patch('/api/menuItems/:id', (req, res) => {
  const item = menuItems.find(i => i.id === req.params.id);
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else res.status(404).json({ error: 'Not found' });
});

app.delete('/api/menuItems/:id', (req, res) => {
  const idx = menuItems.findIndex(i => i.id === req.params.id);
  if (idx > -1) {
    const deleted = menuItems.splice(idx, 1);
    res.json(deleted[0]);
  } else res.status(404).json({ error: 'Not found' });
});

app.post('/api/orders', (req, res) => {
  const { order, items } = req.body;
  const orderId = `order-${Date.now()}`;
  const newOrder = { ...order, id: orderId, created_at: new Date().toISOString(), status: 'pending' };
  mockOrders.push(newOrder);

  items.forEach((item, index) => {
    mockOrderItems.push({
      id: `oi-${Date.now()}-${index}`,
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
      created_at: new Date().toISOString()
    });
  });

  res.json(newOrder);
});

let mockRequests = [];

app.get('/api/requests', (req, res) => {
  const activeOnly = req.query.active === 'true';
  res.json(activeOnly ? mockRequests.filter(r => r.status === 'active') : mockRequests);
});

app.post('/api/requests', (req, res) => {
  const newReq = {
    id: `req-${Date.now()}`,
    table_number: req.body.table_number,
    type: req.body.type, // 'water', 'waiter', 'bill'
    status: 'active',
    created_at: new Date().toISOString()
  };
  mockRequests.push(newReq);
  res.json(newReq);
});

app.patch('/api/requests/:id/status', (req, res) => {
  const reqItem = mockRequests.find(r => r.id === req.params.id);
  if (reqItem) {
    reqItem.status = req.body.status;
    res.json(reqItem);
  } else res.status(404).json({ error: 'Not found' });
});

app.get('/api/orders', (req, res) => {
  const activeOnly = req.query.active === 'true';
  let filtered = mockOrders;
  if (activeOnly) {
    filtered = mockOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  }
  
  // Attach order_items with menu_items names nested inside
  const fullOrders = filtered.map(order => {
    const items = mockOrderItems.filter(oi => oi.order_id === order.id).map(oi => {
       const menuItem = menuItems.find(m => m.id === oi.menu_item_id);
       return { ...oi, menu_items: { name: menuItem?.name } };
    });
    return { ...order, order_items: items };
  });

  res.json(fullOrders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = mockOrders.find(o => o.id === id);
  if (order) {
    order.status = status;
    res.json({ id, status });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Mock sync server running on port 3000 (0.0.0.0) for cross-device visibility');
});

export default app;
