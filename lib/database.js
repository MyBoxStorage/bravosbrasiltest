// Database connection and utilities
// Using a simple in-memory store for MVP
// TODO: Replace with actual database (PostgreSQL, MongoDB, etc)

const db = {
  users: new Map(),
  leads: new Map(),
  estampas: new Map(),
  compras: new Map()
};

// Helper functions
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getUserByEmail(email) {
  for (const [id, user] of db.users.entries()) {
    if (user.email === email) {
      return { id, ...user };
    }
  }
  return null;
}

export function getUserById(id) {
  const user = db.users.get(id);
  return user ? { id, ...user } : null;
}

export function createUser(userData) {
  const id = generateId();
  const user = {
    ...userData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.users.set(id, user);
  return { id, ...user };
}

export function updateUser(id, updates) {
  const user = db.users.get(id);
  if (!user) return null;
  
  const updated = {
    ...user,
    ...updates,
    updated_at: new Date().toISOString()
  };
  db.users.set(id, updated);
  return { id, ...updated };
}

export function createLead(leadData) {
  const id = generateId();
  const lead = {
    ...leadData,
    data_cadastro: new Date().toISOString(),
    status: 'novo'
  };
  db.leads.set(id, lead);
  return { id, ...lead };
}

export function getAllLeads() {
  return Array.from(db.leads.entries()).map(([id, lead]) => ({ id, ...lead }));
}

export function createEstampa(estampaData) {
  const id = generateId();
  const estampa = {
    ...estampaData,
    data_geracao: new Date().toISOString(),
    status: 'gerada'
  };
  db.estampas.set(id, estampa);
  return { id, ...estampa };
}

export function getEstampasByUserId(userId) {
  return Array.from(db.estampas.entries())
    .filter(([id, estampa]) => estampa.user_id === userId)
    .map(([id, estampa]) => ({ id, ...estampa }));
}

export function getEstampaById(id) {
  const estampa = db.estampas.get(id);
  return estampa ? { id, ...estampa } : null;
}

export function updateEstampa(id, updates) {
  const estampa = db.estampas.get(id);
  if (!estampa) return null;
  
  const updated = {
    ...estampa,
    ...updates
  };
  db.estampas.set(id, updated);
  return { id, ...updated };
}

export function createCompra(compraData) {
  const id = generateId();
  const compra = {
    ...compraData,
    data_compra: new Date().toISOString()
  };
  db.compras.set(id, compra);
  return { id, ...compra };
}

export function getCompraByPedidoId(pedidoId) {
  for (const [id, compra] of db.compras.entries()) {
    if (compra.pedido_id_mercadopago === pedidoId) {
      return { id, ...compra };
    }
  }
  return null;
}

export function updateCompra(id, updates) {
  const compra = db.compras.get(id);
  if (!compra) return null;
  
  const updated = {
    ...compra,
    ...updates
  };
  db.compras.set(id, updated);
  return { id, ...updated };
}

// Export database for direct access if needed
export { db };
