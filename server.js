/* ============================================
   Barkat Pharmacy — Backend Server (Express)
   Local development only. On Netlify the same
   API is provided by netlify/functions.
   ============================================ */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { CATALOG, normalizeOrder } = require('./netlify/functions/_shared/core.js');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

/* ---------- Helpers ---------- */

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: [] }, null, 2));
}

function readOrders() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (err) {
    return { orders: [] };
  }
}

function writeOrders(data) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
}

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const seq = readOrders().orders.length + 1;
  return 'BP-' + year + '-' + String(seq).padStart(5, '0');
}

/* ---------- Static Middleware ---------- */

app.use(express.json());

// Serve the static website (index.html, styles.css, script.js)
app.use(express.static(__dirname));

/* ---------- API: Products ---------- */

app.get('/api/products', (req, res) => {
  res.json({ success: true, data: CATALOG });
});

/* ---------- API: Orders ---------- */

app.get('/api/orders/:orderNumber', (req, res) => {
  const orderNumber = String(req.params.orderNumber).toUpperCase();
  const db = readOrders();
  const order = db.orders.find(o => o.orderNumber === orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const result = normalizeOrder(req.body);

  if (!result.ok) {
    return res.status(result.status).json({ success: false, field: result.field, message: result.message });
  }

  const order = Object.assign({}, result.order, {
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString()
  });

  const db = readOrders();
  db.orders.push(order);
  writeOrders(db);

  res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
});

/* ---------- API: Health ---------- */

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Barkat Pharmacy API is running', version: '1.0.0' });
});

/* ---------- Start ---------- */

app.listen(PORT, () => {
  ensureDataDir();
  console.log('=========================================');
  console.log('  Barkat Pharmacy Backend is running');
  console.log('  Site:      http://localhost:' + PORT);
  console.log('  API:       http://localhost:' + PORT + '/api/health');
  console.log('  Orders:    ' + ORDERS_FILE);
  console.log('=========================================');
});