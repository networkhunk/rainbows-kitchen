export const categories = [
  { id: 'cat-1', name: 'Chats', sort_order: 1 },
  { id: 'cat-2', name: 'Soups', sort_order: 2 },
  { id: 'cat-3', name: 'Starters', sort_order: 3 },
  { id: 'cat-4', name: 'Paneer', sort_order: 4 },
  { id: 'cat-5', name: 'Mushroom', sort_order: 5 },
  { id: 'cat-6', name: 'Baby Corn', sort_order: 6 },
  { id: 'cat-7', name: 'Indian Bread', sort_order: 7 },
  { id: 'cat-8', name: 'Curries', sort_order: 8 },
  { id: 'cat-9', name: 'Chinese', sort_order: 9 },
  { id: 'cat-10', name: 'Rice', sort_order: 10 },
  { id: 'cat-11', name: 'Combo Meals', sort_order: 11 },
  { id: 'cat-12', name: 'Drinks', sort_order: 12 },
  { id: 'cat-13', name: 'Desserts', sort_order: 13 },
  { id: 'cat-14', name: 'Pizza', sort_order: 14 },
  { id: 'cat-15', name: 'Burger', sort_order: 15 },
  { id: 'cat-16', name: 'Pasta', sort_order: 16 },
  { id: 'cat-17', name: 'Sandwich', sort_order: 17 },
  { id: 'cat-18', name: 'Mojito', sort_order: 18 },
  { id: 'cat-19', name: 'Sizzlers', sort_order: 19 }
];

const rawItems = [
  // Chats
  { id: 'i-1', category_id: 'cat-1', name: 'Pani Puri', price: 30, is_available: true },
  { id: 'i-2', category_id: 'cat-1', name: 'Vada Pav', price: 30, is_available: true },
  { id: 'i-3', category_id: 'cat-1', name: 'Dahi Puri', price: 60, is_available: true },
  { id: 'i-4', category_id: 'cat-1', name: 'Masala Puri', price: 50, is_available: true },
  { id: 'i-5', category_id: 'cat-1', name: 'Cheese Vada Pav', price: 50, is_available: true },
  { id: 'i-6', category_id: 'cat-1', name: 'Pav Bhaji', price: 70, is_available: true },
  
  // Soups
  { id: 'i-7', category_id: 'cat-2', name: 'Hot & Sour Soup', price: 100, is_available: true },
  { id: 'i-8', category_id: 'cat-2', name: 'Sweet Corn Soup', price: 100, is_available: true },
  { id: 'i-9', category_id: 'cat-2', name: 'Tomato Soup', price: 100, is_available: true },
  { id: 'i-10', category_id: 'cat-2', name: 'Veg Manchow Soup', price: 100, is_available: true },
  { id: 'i-11', category_id: 'cat-2', name: 'Lemon Coriander Soup', price: 100, is_available: true },
  { id: 'i-12', category_id: 'cat-2', name: 'Mushroom Soup', price: 100, is_available: true },

  // Starters (Gobi, Veg, etc)
  { id: 'i-13', category_id: 'cat-3', name: 'Gobi Manchurian', price: 140, is_available: true },
  { id: 'i-14', category_id: 'cat-3', name: 'Gobi 65', price: 140, is_available: true },
  { id: 'i-15', category_id: 'cat-3', name: 'Gobi Golden', price: 140, is_available: true },
  { id: 'i-16', category_id: 'cat-3', name: 'Gobi Pepper', price: 140, is_available: true },
  { id: 'i-17', category_id: 'cat-3', name: 'Gobi Chilli', price: 140, is_available: true },
  { id: 'i-18', category_id: 'cat-3', name: 'Masala Papad', price: 40, is_available: true },
  { id: 'i-19', category_id: 'cat-3', name: 'Veg Manchurian', price: 150, is_available: true },
  { id: 'i-20', category_id: 'cat-3', name: 'Crispy Corn', price: 180, is_available: true },
  { id: 'i-21', category_id: 'cat-3', name: 'Onion Rings', price: 150, is_available: true },

  // Paneer
  { id: 'i-22', category_id: 'cat-4', name: 'Paneer Majestic', price: 200, is_available: true },
  { id: 'i-23', category_id: 'cat-4', name: 'Paneer Manchurian', price: 200, is_available: true },
  { id: 'i-24', category_id: 'cat-4', name: 'Paneer 65', price: 200, is_available: true },
  { id: 'i-25', category_id: 'cat-4', name: 'Paneer Pepper', price: 200, is_available: true },
  { id: 'i-26', category_id: 'cat-4', name: 'Paneer Chilli', price: 200, is_available: true },
  { id: 'i-27', category_id: 'cat-4', name: 'Paneer Paps', price: 200, is_available: true },
  { id: 'i-28', category_id: 'cat-4', name: 'Paneer Tikka Regular', price: 250, is_available: true },
  { id: 'i-29', category_id: 'cat-4', name: 'Paneer Achari Tikka', price: 250, is_available: true },
  { id: 'i-30', category_id: 'cat-4', name: 'Paneer Malai Tikka', price: 250, is_available: true },

  // Baby Corn
  { id: 'i-31', category_id: 'cat-6', name: 'Baby Corn Majestic', price: 200, is_available: true },
  { id: 'i-32', category_id: 'cat-6', name: 'Baby Corn Manchurian', price: 200, is_available: true },
  { id: 'i-33', category_id: 'cat-6', name: 'Baby Corn 65', price: 200, is_available: true },
  { id: 'i-34', category_id: 'cat-6', name: 'Baby Corn Golden', price: 200, is_available: true },
  { id: 'i-35', category_id: 'cat-6', name: 'Baby Corn Pepper', price: 200, is_available: true },

  // Mushroom
  { id: 'i-36', category_id: 'cat-5', name: 'Mushroom Manchurian', price: 200, is_available: true },
  { id: 'i-37', category_id: 'cat-5', name: 'Mushroom 65', price: 200, is_available: true },
  { id: 'i-38', category_id: 'cat-5', name: 'Mushroom Golden', price: 200, is_available: true },
  { id: 'i-39', category_id: 'cat-5', name: 'Mushroom Pepper', price: 200, is_available: true },
  { id: 'i-40', category_id: 'cat-5', name: 'Mushroom Chilli', price: 200, is_available: true },
  { id: 'i-41', category_id: 'cat-5', name: 'Creamy Mushroom', price: 200, is_available: true },

  // Indian Bread
  { id: 'i-42', category_id: 'cat-7', name: 'Special Malai Roti', price: 100, is_available: true },
  { id: 'i-43', category_id: 'cat-7', name: 'Tandoori Roti', price: 25, is_available: true },
  { id: 'i-44', category_id: 'cat-7', name: 'Butter Tandoori Roti', price: 30, is_available: true },
  { id: 'i-45', category_id: 'cat-7', name: 'Plain Kulcha', price: 30, is_available: true },
  { id: 'i-46', category_id: 'cat-7', name: 'Plain Naan', price: 35, is_available: true },
  { id: 'i-47', category_id: 'cat-7', name: 'Butter Naan', price: 40, is_available: true },
  { id: 'i-48', category_id: 'cat-7', name: 'Butter Kulcha', price: 40, is_available: true },
  { id: 'i-49', category_id: 'cat-7', name: 'Garlic Naan', price: 50, is_available: true },
  { id: 'i-50', category_id: 'cat-7', name: 'Paneer Kheema Naan', price: 90, is_available: true },

  // Curries
  { id: 'i-51', category_id: 'cat-8', name: 'Dal Tadka', price: 140, is_available: true },
  { id: 'i-52', category_id: 'cat-8', name: 'Dal Fry', price: 140, is_available: true },
  { id: 'i-53', category_id: 'cat-8', name: 'Jeera Dal', price: 140, is_available: true },
  { id: 'i-54', category_id: 'cat-8', name: 'Aloo Tomato Masala', price: 140, is_available: true },
  { id: 'i-55', category_id: 'cat-8', name: 'Aloo Gobi Masala', price: 150, is_available: true },
  { id: 'i-56', category_id: 'cat-8', name: 'Veg Kadai', price: 160, is_available: true },
  { id: 'i-57', category_id: 'cat-8', name: 'Veg Kurma', price: 160, is_available: true },
  { id: 'i-58', category_id: 'cat-8', name: 'Veg Kolhapuri', price: 150, is_available: true },
  { id: 'i-59', category_id: 'cat-8', name: 'Aloo Matar Paneer', price: 160, is_available: true },
  { id: 'i-60', category_id: 'cat-8', name: 'Palak Paneer', price: 200, is_available: true },
  { id: 'i-61', category_id: 'cat-8', name: 'Paneer Butter Masala', price: 200, is_available: true },
  { id: 'i-62', category_id: 'cat-8', name: 'Mushroom Masala', price: 200, is_available: true },
  { id: 'i-63', category_id: 'cat-8', name: 'Kaju Masala', price: 220, is_available: true },

  // Rice
  { id: 'i-64', category_id: 'cat-10', name: 'Jeera Rice', price: 120, is_available: true },
  { id: 'i-65', category_id: 'cat-10', name: 'Curd Rice', price: 100, is_available: true },
  { id: 'i-66', category_id: 'cat-10', name: 'Masala Rice', price: 120, is_available: true },
  { id: 'i-67', category_id: 'cat-10', name: 'Veg Pulao', price: 140, is_available: true },
  { id: 'i-68', category_id: 'cat-10', name: 'Veg Biryani', price: 180, is_available: true },
  { id: 'i-69', category_id: 'cat-10', name: 'Triple Fried Rice', price: 180, is_available: true },
  { id: 'i-70', category_id: 'cat-10', name: 'Paneer Biryani', price: 200, is_available: true },
  { id: 'i-71', category_id: 'cat-10', name: 'Mushroom Biryani', price: 200, is_available: true },
  { id: 'i-72', category_id: 'cat-10', name: 'Kaju Biryani', price: 220, is_available: true },

  // Combo Meals
  { id: 'i-73', category_id: 'cat-11', name: 'Paratha + Curd + Pickle Combo', price: 100, is_available: true },
  { id: 'i-74', category_id: 'cat-11', name: 'Tandoori Roti + Curry Combo', price: 120, is_available: true },
  { id: 'i-75', category_id: 'cat-11', name: 'Fried Rice + Gobi Manchurian', price: 180, is_available: true },
  { id: 'i-76', category_id: 'cat-11', name: 'Chinese Combo', price: 180, is_available: true },

  // Chinese Main Course
  { id: 'i-77', category_id: 'cat-9', name: 'Veg Hakka Noodles', price: 140, is_available: true },
  { id: 'i-78', category_id: 'cat-9', name: 'Schezwan Noodles', price: 140, is_available: true },
  { id: 'i-79', category_id: 'cat-9', name: 'Chilli Garlic Noodles', price: 140, is_available: true },
  { id: 'i-80', category_id: 'cat-9', name: 'Veg Fried Rice', price: 140, is_available: true },
  { id: 'i-81', category_id: 'cat-9', name: 'Schezwan Fried Rice', price: 140, is_available: true },

  // Drinks & Coolers
  { id: 'i-82', category_id: 'cat-12', name: 'Masala Buttermilk', price: 40, is_available: true },
  { id: 'i-83', category_id: 'cat-12', name: 'Fresh Lime Soda', price: 40, is_available: true },
  { id: 'i-84', category_id: 'cat-12', name: 'Sweet Lassi', price: 50, is_available: true },
  { id: 'i-85', category_id: 'cat-12', name: 'Mango Lassi', price: 70, is_available: true },

  // Desserts
  { id: 'i-86', category_id: 'cat-13', name: 'Fruit Salad with Ice Cream', price: 120, is_available: true },
  { id: 'i-87', category_id: 'cat-13', name: 'Gajar Halwa with Vanilla', price: 140, is_available: true },
  { id: 'i-88', category_id: 'cat-13', name: 'Sizzling Brownie', price: 180, is_available: true },

  // Sizzlers
  { id: 'i-89', category_id: 'cat-19', name: 'Veg Sizzler', price: 220, is_available: true },
  { id: 'i-90', category_id: 'cat-19', name: 'Chinese Sizzler', price: 220, is_available: true },
  { id: 'i-91', category_id: 'cat-19', name: 'Paneer Sizzler', price: 250, is_available: true },

  // Pizza
  { id: 'p-1', category_id: 'cat-14', name: 'Corn Cheese Pizza', price: 150, is_available: true },
  { id: 'p-2', category_id: 'cat-14', name: 'Margherita Pizza', price: 160, is_available: true },
  { id: 'p-3', category_id: 'cat-14', name: 'Paneer Pizza (Cottage Cheese)', price: 200, is_available: true },
  { id: 'p-4', category_id: 'cat-14', name: 'Veg BBQ Pizza', price: 220, is_available: true },
  { id: 'p-5', category_id: 'cat-14', name: 'Mushroom Pizza', price: 200, is_available: true },
  { id: 'p-6', category_id: 'cat-14', name: 'Double Sauce Pizza', price: 210, is_available: true },
  { id: 'p-7', category_id: 'cat-14', name: 'Plain Cheese Pizza', price: 150, is_available: true },
  { id: 'p-8', category_id: 'cat-14', name: 'Italian Pizza', price: 200, is_available: true },
  { id: 'p-9', category_id: 'cat-14', name: 'Asian Special Pizza', price: 250, is_available: true },
  { id: 'p-10', category_id: 'cat-14', name: 'Exotic Pizza', price: 250, is_available: true },

  // Burger
  { id: 'b-1', category_id: 'cat-15', name: 'American Veg Burger', price: 130, is_available: true },
  { id: 'b-2', category_id: 'cat-15', name: 'Paneer Burger', price: 150, is_available: true },
  { id: 'b-3', category_id: 'cat-15', name: 'American Burger with Cheese', price: 160, is_available: true },
  { id: 'b-4', category_id: 'cat-15', name: 'Whopper Veg Burger', price: 150, is_available: true },

  // Pasta
  { id: 'ps-1', category_id: 'cat-16', name: 'Alfredo Penne Pasta', price: 120, is_available: true },
  { id: 'ps-2', category_id: 'cat-16', name: 'Alfredo Macaroni Pasta', price: 140, is_available: true },

  // Sandwich
  { id: 'sd-1', category_id: 'cat-17', name: 'Veg Grilled Sandwich', price: 80, is_available: true },
  { id: 'sd-2', category_id: 'cat-17', name: 'Paneer Toast Sandwich', price: 120, is_available: true },
  { id: 'sd-3', category_id: 'cat-17', name: 'Capsicum & Corn Sandwich', price: 100, is_available: true },
  { id: 'sd-4', category_id: 'cat-17', name: 'Bombay Sandwich', price: 100, is_available: true },
  { id: 'sd-5', category_id: 'cat-17', name: 'Cheese Chilli Toast', price: 100, is_available: true },
  { id: 'sd-6', category_id: 'cat-17', name: 'Garlic Bread', price: 100, is_available: true },

  // Mojito
  { id: 'mj-1', category_id: 'cat-18', name: 'Classic Mint Mojito', price: 70, is_available: true },
  { id: 'mj-2', category_id: 'cat-18', name: 'Kala Khatta Punch Mojito', price: 90, is_available: true },
  { id: 'mj-3', category_id: 'cat-18', name: 'Blue Lagoon Mojito', price: 90, is_available: true },
  { id: 'mj-4', category_id: 'cat-18', name: 'Virgin Mojito', price: 80, is_available: true },
];

const getFoodishUrl = (type, seed) => {
  const counts = {
    'burger': 87, 'butter-chicken': 22, 'dessert': 36, 'dosa': 8,
    'idly': 73, 'pasta': 34, 'pizza': 96, 'rice': 35, 'samosa': 22
  };
  const max = counts[type] || 10;
  const num = (seed % max) + 1;
  return `https://foodish-api.com/images/${type}/${type}${num}.jpg`;
};

const getAccurateImage = (name, cid, seed) => {
  const n = name.toLowerCase();
  
  // Safe fallbacks from foodish API
  if (n.includes('gobi') || n.includes('manchurian') || n.includes('65') || n.includes('corn') || n.includes('mushroom')) return getFoodishUrl('butter-chicken', seed);
  if (n.includes('burger')) return getFoodishUrl('burger', seed);
  if (n.includes('pizza')) return getFoodishUrl('pizza', seed);
  if (n.includes('pasta') || n.includes('noodles')) return getFoodishUrl('pasta', seed);
  if (n.includes('biryani') || n.includes('pulao') || n.includes('rice')) return getFoodishUrl('rice', seed);
  if (n.includes('paneer') || n.includes('dal') || n.includes('masala')) return getFoodishUrl('butter-chicken', seed);
  if (n.includes('brownie') || n.includes('ice cream') || n.includes('halwa')) return getFoodishUrl('dessert', seed);
  
  if (cid === 'cat-1') return getFoodishUrl('samosa', seed); // Chats
  if (cid === 'cat-8') return getFoodishUrl('butter-chicken', seed); // Curries
  
  // Bulletproof fallback for breads, soups, mojitos, and anything else missing
  return `https://placehold.co/400x300/FFEFEB/FF416C?text=${encodeURIComponent(name)}`;
};

export const menuItems = rawItems.map((item, index) => {
  // Check for specific newly uploaded images first
  const specificImages = {
    'Pani Puri': '/panipuri.jpeg',
    'Vada Pav': '/vada-pav-3.jpg',
    'Cheese Vada Pav': '/cheesevadapav.jpg',
    'Veg Kurma': '/VegKurma.jpg',
    'Baby Corn Majestic': '/babycornmajestic.jpg',
    'Masala Buttermilk': '/buttermilk.jpg',
    'Masala Puri': '/masalapuri.jpeg',
    'Dahi Puri': '/dahipuri.jpg',
    'Hot & Sour Soup': '/hot and sour soup.jpg'
  };

  let image_url = specificImages[item.name];
  
  if (!image_url) {
    // Use the local images downloaded by the user, residing in public/menu_images/
    // Format is "Item Name food photography/Image_1.jpg"
    const folderName = `${item.name} food photography`;
    image_url = `/menu_images/${encodeURIComponent(folderName)}/Image_1.jpg`;
  }

  const fallback_image_url = getAccurateImage(item.name, item.category_id, index + 1);
  
  return { ...item, image_url, fallback_image_url };
});

export let mockOrders = [];
export let mockOrderItems = [];

export const addMockOrder = (order, items) => {
  const orderId = `order-${Date.now()}`;
  const newOrder = {
    ...order,
    id: orderId,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
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

  return newOrder;
};

export const updateMockOrderStatus = (orderId, status) => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
  }
};
