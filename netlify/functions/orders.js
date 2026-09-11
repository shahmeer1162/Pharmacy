/* ============================================
   Barkat Pharmacy — Netlify Function: Orders
   POST /api/orders          -> create an order
   GET  /api/orders          -> list all orders
   GET  /api/orders/:number  -> find one order
   Data is persisted in Netlify Blobs.
   ============================================ */

import { getStore } from '@netlify/blobs';
import { normalizeOrder } from './_shared/core.js';

const STORE_NAME = 'barkat-orders';
const TIMEOUT_MS = 8000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(label + ' timed out')), ms)
    )
  ]);
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function readBody(req) {
  const text = await req.text();
  try { return JSON.parse(text); } catch { return {}; }
}

async function listEntries(store) {
  try {
    const listing = await withTimeout(store.list({ prefix: '' }), TIMEOUT_MS, 'List orders');
    return (listing && Array.isArray(listing.entries)) ? listing.entries : [];
  } catch (err) {
    console.error('listEntries fallback:', err.message);
    return [];
  }
}

async function buildOrderNumber(store) {
  const year = new Date().getFullYear();
  try {
    const entries = await listEntries(store);
    const seq = entries.length + 1;
    return 'BP-' + year + '-' + String(seq).padStart(5, '0');
  } catch (err) {
    // Timestamp-based fallback so an order can still be created.
    return 'BP-' + year + '-' + String(Math.floor(Date.now() / 1000) % 100000).padStart(5, '0');
  }
}

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const store = getStore({ name: STORE_NAME });

    if (req.method === 'POST') {
      const body = await readBody(req);
      const result = normalizeOrder(body);

      if (!result.ok) {
        return json({ success: false, field: result.field, message: result.message }, result.status);
      }

      const orderNumber = await buildOrderNumber(store);

      const order = Object.assign({}, result.order, {
        orderNumber,
        createdAt: new Date().toISOString()
      });

      await withTimeout(store.setJSON(orderNumber, order), TIMEOUT_MS, 'Save order');

      return json({ success: true, data: order, message: 'Order placed successfully!' }, 201);
    }

    if (req.method === 'GET') {
      const segments = pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      const isList = lastSegment === 'orders';

      if (isList) {
        const required = process.env.ADMIN_CODE;
        if (!required) {
          return json({ success: false, message: 'ADMIN_CODE is not set in Netlify environment variables.' }, 500);
        }
        const provided = req.headers.get('X-Admin-Code') || '';
        if (provided !== required) {
          return json({ success: false, message: 'Unauthorized' }, 401);
        }
        const entries = await listEntries(store);
        const orders = [];
        for (const entry of entries) {
          const order = await withTimeout(store.get(entry.key, { type: 'json' }), TIMEOUT_MS, 'Get order ' + entry.key);
          if (order) orders.push(order);
        }
        return json({ success: true, data: orders });
      }

      const orderNumber = lastSegment.toUpperCase();
      const order = await withTimeout(store.get(orderNumber, { type: 'json' }), TIMEOUT_MS, 'Get order');
      if (!order) {
        return json({ success: false, message: 'Order not found' }, 404);
      }
      return json({ success: true, data: order });
    }

    return json({ success: false, message: 'Method not allowed' }, 405);

  } catch (err) {
    console.error('Orders function error:', err);
    return json({ success: false, message: 'Server error: ' + err.message }, 500);
  }
}

export const config = {
  path: ['/api/orders', '/api/orders/*']
};