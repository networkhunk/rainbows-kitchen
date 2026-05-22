import { isMock, supabase } from './supabase';

const getApiBase = () => {
  if (window.location.port === '5173' || window.location.port === '5174') {
    return `http://${window.location.hostname}:3000/api`;
  }
  return '/api';
};

export const db = {
  async uploadImage(file) {
    if (isMock) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ data: reader.result, error: null });
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage.from('menu-images').upload(fileName, file);
    if (error) return { data: null, error };
    
    const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName);
    return { data: data.publicUrl, error: null };
  },

  async getCategories() {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/categories`);
        return { data: await res.json(), error: null };
      } catch (e) {
        console.error(e);
        return { data: [], error: null };
      }
    }
    return await supabase.from('categories').select('*').order('sort_order');
  },

  async getMenuItems(all = false) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/menuItems${all ? '?all=true' : ''}`);
        return { data: await res.json(), error: null };
      } catch (e) {
        console.error(e);
        return { data: [], error: null };
      }
    }
    const query = supabase.from('menu_items').select('*');
    return all ? await query : await query.eq('is_available', true);
  },

  async addMenuItem(item) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/menuItems`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(item)
        });
        return { data: await res.json(), error: null };
      } catch(e) { return { data: null, error: e }; }
    }
    return await supabase.from('menu_items').insert([item]).select().single();
  },

  async updateMenuItem(id, updates) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/menuItems/${id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updates)
        });
        return { data: await res.json(), error: null };
      } catch(e) { return { data: null, error: e }; }
    }
    return await supabase.from('menu_items').update(updates).eq('id', id).select().single();
  },

  async deleteMenuItem(id) {
    if (isMock) {
      try {
        await fetch(`${getApiBase()}/menuItems/${id}`, { method: 'DELETE' });
        return { error: null };
      } catch(e) { return { error: e }; }
    }
    return await supabase.from('menu_items').delete().eq('id', id);
  },

  async placeOrder(orderData, itemsData) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: orderData, items: itemsData })
        });
        return { data: await res.json(), error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) return { data: null, error: orderError };

    const formattedItems = itemsData.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(formattedItems);

    return { data: order, error: itemsError };
  },

  async getActiveOrders() {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/orders?active=true`);
        return { data: await res.json(), error: null };
      } catch {
        return { data: [], error: null };
      }
    }
    return await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(name))')
      .in('status', ['pending', 'preparing', 'served'])
      .order('created_at', { ascending: false });
  },

  async getAllOrders() {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/orders`);
        return { data: await res.json(), error: null };
      } catch {
        return { data: [], error: null };
      }
    }
    return await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(name))')
      .order('created_at', { ascending: false });
  },

  async updateOrderStatus(orderId, status) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        return { data: await res.json(), error: null };
      } catch(e) {
        return { data: null, error: e };
      }
    }
    return await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
  },

  async getActiveRequests() {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/requests?active=true`);
        return { data: await res.json(), error: null };
      } catch { return { data: [], error: null }; }
    }
    return { data: [], error: null }; // Supabase impl later if needed
  },

  async addRequest(table_number, type) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table_number, type })
        });
        return { data: await res.json(), error: null };
      } catch (e) { return { data: null, error: e }; }
    }
    return { data: null, error: null };
  },

  async updateRequestStatus(id, status) {
    if (isMock) {
      try {
        const res = await fetch(`${getApiBase()}/requests/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        return { data: await res.json(), error: null };
      } catch (e) { return { data: null, error: e }; }
    }
    return { data: null, error: null };
  }
};
