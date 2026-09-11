/* ============================================
   Barkat Pharmacy — Shared Business Logic
   Used by the local Express server AND the
   Netlify Functions so pricing/validation stay
   identical everywhere.
   ============================================ */

const CATALOG = [
  { id: 1, name: 'Panadol Extra (24 Tablets)', cat: 'wellness', catLabel: 'Wellness', price: 3500 },
  { id: 2, name: 'Cetirizine Allergy Relief', cat: 'personal', catLabel: 'Personal Care', price: 6999 },
  { id: 3, name: 'Glucose Monitoring Kit', cat: 'devices', catLabel: 'Devices', price: 12500 },
  { id: 4, name: 'Honey & Lemon Cough Syrup', cat: 'immunity', catLabel: 'Immunity', price: 5100 },
  { id: 5, name: 'Amoxil (Amoxicillin 500mg)', cat: 'prescription', catLabel: 'Prescription', price: 850 },
  { id: 6, name: 'Dettol Liquid Antiseptic 250ml', cat: 'personal', catLabel: 'Personal Care', price: 320 },
  { id: 7, name: 'Multivitamin Gummies Daily', cat: 'wellness', catLabel: 'Wellness', price: 2450 },
  { id: 8, name: 'Digital Thermometer (Non-Contact)', cat: 'devices', catLabel: 'Devices', price: 2800 },
  { id: 9, name: 'Panadol Original (20 Tablets)', cat: 'prescription', catLabel: 'Prescription', price: 290 },
  { id: 10, name: 'Vitamin C 1000mg Effervescent', cat: 'wellness', catLabel: 'Wellness', price: 1450 },
  { id: 11, name: 'Fluconazole 150mg', cat: 'prescription', catLabel: 'Prescription', price: 390 },
  { id: 12, name: 'Omeprazole 20mg', cat: 'prescription', catLabel: 'Prescription', price: 440 },
  { id: 13, name: 'Dispirin 325mg', cat: 'prescription', catLabel: 'Prescription', price: 180 },
  { id: 14, name: 'Calpol Syrup 100ml', cat: 'wellness', catLabel: 'Wellness', price: 260 },
  { id: 15, name: 'Brufen 400mg (20 Tablets)', cat: 'prescription', catLabel: 'Prescription', price: 620 },
  { id: 16, name: 'Sensodyne Toothpaste', cat: 'personal', catLabel: 'Personal Care', price: 950 },
  { id: 17, name: 'Dettol Handwash Pump 500ml', cat: 'personal', catLabel: 'Personal Care', price: 540 },
  { id: 18, name: 'Digital BP Monitor Upper Arm', cat: 'devices', catLabel: 'Devices', price: 8900 },
  { id: 19, name: 'Omega-3 Fish Oil Capsules', cat: 'wellness', catLabel: 'Wellness', price: 3100 },
  { id: 20, name: 'Face Mask Surgical (50 Pack)', cat: 'personal', catLabel: 'Personal Care', price: 750 }
];

const VALID_PAYMENTS = ['cod'];
const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_FEE = 150;
const PROMO_CODES = { BARKAT20: 0.20 };

/**
 * Validate and price an incoming order payload.
 * Returns either:
 *   { ok: true, order: { ...complete order minus orderNumber/createdAt } }
 * or
 *   { ok: false, status, field?, message }
 */
function normalizeOrder(body) {
  const customer = (body && body.customer) || {};
  const items = (body && body.items) || [];
  const paymentMethod = String((body && body.paymentMethod) || '');

  const name = String(customer.name || '').trim();
  const phone = String(customer.phone || '').trim();
  const address = String(customer.address || '').trim();
  const city = String(customer.city || 'Lahore').trim();

  if (!name || name.length < 3) {
    return { ok: false, status: 400, field: 'name', message: 'Please enter your full name.' };
  }

  let digits = phone.replace(/[^\d]/g, '');
  let localNumber = digits;
  if (digits.startsWith('92')) localNumber = '0' + digits.slice(2);
  else if (!digits.startsWith('0')) localNumber = '0' + digits;
  const phoneValid = /^03\d{9}$/.test(localNumber);

  if (!phoneValid) {
    return {
      ok: false,
      status: 400,
      field: 'phone',
      message: 'Please enter a valid Pakistan mobile number (e.g. 03XX-XXXXXXX).'
    };
  }

  if (!address || address.length < 10) {
    return {
      ok: false,
      status: 400,
      field: 'address',
      message: 'Please enter a complete delivery address.'
    };
  }

  if (!VALID_PAYMENTS.includes(paymentMethod)) {
    return {
      ok: false,
      status: 400,
      field: 'paymentMethod',
      message: 'Please choose a valid payment method.'
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, status: 400, message: 'Your cart is empty.' };
  }

  const cleanItems = [];
  for (const it of items) {
    const itemName = String(it.name || '').trim();
    const price = Number(it.price);
    const qty = parseInt(it.qty, 10);
    if (!itemName || isNaN(price) || price <= 0 || isNaN(qty) || qty < 1 || qty > 99) {
      return { ok: false, status: 400, message: 'Invalid item in order.' };
    }
    cleanItems.push({ name: itemName, price, qty, lineTotal: price * qty });
  }

  let subtotal = cleanItems.reduce((sum, it) => sum + it.lineTotal, 0);

  const promoCode = String(body.promoCode || '').trim().toUpperCase();
  const discountRate = PROMO_CODES[promoCode] || 0;
  const discount = Math.round(subtotal * discountRate);
  const delivery = subtotal - discount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal - discount + delivery;

  return {
    ok: true,
    order: {
      status: 'confirmed',
      customer: {
        name,
        phone,
        address,
        city,
        notes: String(customer.notes || '').trim()
      },
      paymentMethod,
      promoCode: discountRate > 0 ? promoCode : null,
      items: cleanItems,
      subtotal,
      discount,
      delivery,
      total,
      currency: 'PKR',
      estimatedDelivery: 'Today (within 2-4 hours) in Lahore'
    }
  };
}

module.exports = {
  CATALOG,
  VALID_PAYMENTS,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  PROMO_CODES,
  normalizeOrder
};