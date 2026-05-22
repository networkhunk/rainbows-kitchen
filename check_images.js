import fs from 'fs';
import path from 'path';
import { menuItems } from './src/lib/mockData.js';

const missing = [];
menuItems.forEach(item => {
  const folderName = `${item.name} food photography`;
  const p = path.join('public', 'menu_images', folderName, 'Image_1.jpg');
  if (!fs.existsSync(p)) {
    missing.push(item.name);
  }
});
console.log('MISSING ITEMS:', missing);
