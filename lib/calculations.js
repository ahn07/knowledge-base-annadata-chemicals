export function calculateProfit(sellingPrice, costPrice, qty) {
  const sp = Number(sellingPrice);
  const cp = Number(costPrice);
  const quantity = Number(qty);

  if (!Number.isFinite(sp) || !Number.isFinite(cp) || !Number.isFinite(quantity)) {
    return 0;
  }

  return quantity * (sp - cp);
}

export function calculateTotalCost(cost, transport) {
  const c = Number(cost);
  const t = Number(transport);

  if (!Number.isFinite(c) || !Number.isFinite(t)) {
    return 0;
  }

  return c + t;
}

export function updateStockOnPurchase(currentStock, purchasedQty) {
  const stock = Number(currentStock);
  const qty = Number(purchasedQty);

  if (!Number.isFinite(stock) || !Number.isFinite(qty)) {
    return currentStock;
  }

  return stock + qty;
}

export function updateStockOnSale(currentStock, soldQty) {
  const stock = Number(currentStock);
  const qty = Number(soldQty);

  if (!Number.isFinite(stock) || !Number.isFinite(qty)) {
    return currentStock;
  }

  const newStock = stock - qty;
  return newStock < 0 ? 0 : newStock;
}
