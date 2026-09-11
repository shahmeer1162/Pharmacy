/* ============================================
   Barkat Pharmacy — Netlify Function: Products
   GET /api/products -> product catalog
   ============================================ */

import { CATALOG } from './_shared/core.js';

export default async function handler() {
  return Response.json({ success: true, data: CATALOG });
}

export const config = {
  path: '/api/products'
};