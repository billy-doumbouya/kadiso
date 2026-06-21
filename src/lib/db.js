import { createClient } from "@libsql/client";
import { hashPassword } from "@/lib/password";
import { seedData } from "@/lib/seed-data";

// Initialisation du client Turso avec les variables d'environnement
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * Initialisation des tables et du Seed (Asynchrone)
 */
export async function initDatabase() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL,
      accent TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      unit TEXT NOT NULL,
      image TEXT,
      tagline TEXT,
      description TEXT,
      details_json TEXT NOT NULL DEFAULT '[]',
      in_stock INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT,
      content_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS delivery_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone TEXT NOT NULL,
      fee TEXT NOT NULL,
      delay TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      zone TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'en_attente',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS resellers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      rccm TEXT NOT NULL,
      ifu TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'en_attente',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      region TEXT NOT NULL,
      crop TEXT NOT NULL,
      estimated_volume TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'en_attente',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      products TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'nouveau',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'nouveau',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS impact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_amount INTEGER NOT NULL,
      note TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const checkProducts = await db.execute("SELECT COUNT(*) AS count FROM products");
  const count = checkProducts.rows[0]?.count;
  
  if (count > 0) return;

  for (const c of seedData.categories) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO categories (id, name, description, icon, accent) VALUES (?, ?, ?, ?, ?)",
      args: [c.id, c.name, c.description, c.icon, c.accent]
    });
  }

  for (const p of seedData.products) {
    await db.execute({
      sql: `INSERT INTO products (slug, name, category, price, unit, image, tagline, description, details_json, in_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.slug, p.name, p.category, p.price, p.unit, p.image || null,
        p.tagline, p.description, JSON.stringify(p.details || []), p.inStock ? 1 : 0
      ]
    });
  }

  for (const b of seedData.blogPosts) {
    await db.execute({
      sql: `INSERT INTO blog_posts (slug, title, excerpt, category, date, image, content_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [b.slug, b.title, b.excerpt, b.category, b.date, b.image || null, JSON.stringify(b.content || [])]
    });
  }

  for (const z of seedData.deliveryZones) {
    await db.execute({
      sql: "INSERT INTO delivery_zones (zone, fee, delay) VALUES (?, ?, ?)",
      args: [z.zone, z.fee, z.delay]
    });
  }

  await db.execute({
    sql: "INSERT INTO impact (total_amount, note) VALUES (?, ?)",
    args: [284500000, "Montant initial repris du compteur affiché sur le site."]
  });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@kadiso.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  await db.execute({
    sql: "INSERT OR IGNORE INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)",
    args: [adminEmail, hashPassword(adminPassword), "Administrateur Kadi'so"]
  });
}

// Helpers utilitaires pour formater les réponses
function rowToProduct(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    unit: row.unit,
    image: row.image || undefined,
    tagline: row.tagline,
    description: row.description,
    details: JSON.parse(row.details_json || "[]"),
    inStock: !!row.in_stock,
  };
}

function rowToPost(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    image: row.image || undefined,
    content: JSON.parse(row.content_json || "[]"),
  };
}

/**
 * EXPORTS DES SERVICES API (Vanilla JS)
 */

export const Categories = {
  all: async () => {
    const res = await db.execute("SELECT * FROM categories");
    return res.rows;
  },
};

export const Products = {
  all: async () => {
    const res = await db.execute("SELECT * FROM products ORDER BY created_at DESC");
    return res.rows.map(rowToProduct);
  },
  bySlug: async (slug) => {
    const res = await db.execute({ sql: "SELECT * FROM products WHERE slug = ?", args: [slug] });
    return rowToProduct(res.rows[0]);
  },
  byId: async (id) => {
    const res = await db.execute({ sql: "SELECT * FROM products WHERE id = ?", args: [id] });
    return rowToProduct(res.rows[0]);
  },
  byCategory: async (category) => {
    const res = await db.execute({ sql: "SELECT * FROM products WHERE category = ? ORDER BY created_at DESC", args: [category] });
    return res.rows.map(rowToProduct);
  },
  create: async (p) => {
    const result = await db.execute({
      sql: `INSERT INTO products (slug, name, category, price, unit, image, tagline, description, details_json, in_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.slug, p.name, p.category, p.price, p.unit, p.image || null, p.tagline || "", p.description || "", JSON.stringify(p.details || []), p.inStock === false ? 0 : 1]
    });
    return Products.byId(Number(result.lastInsertRowid));
  },
  update: async (id, p) => {
    await db.execute({
      sql: `UPDATE products SET slug=?, name=?, category=?, price=?, unit=?, image=?, tagline=?, description=?, details_json=?, in_stock=? WHERE id=?`,
      args: [p.slug, p.name, p.category, p.price, p.unit, p.image || null, p.tagline || "", p.description || "", JSON.stringify(p.details || []), p.inStock === false ? 0 : 1, id]
    });
    return Products.byId(id);
  },
  remove: async (id) => {
    await db.execute({ sql: "DELETE FROM products WHERE id = ?", args: [id] });
  },
};

export const BlogPosts = {
  all: async () => {
    const res = await db.execute("SELECT * FROM blog_posts ORDER BY date DESC");
    return res.rows.map(rowToPost);
  },
  bySlug: async (slug) => {
    const res = await db.execute({ sql: "SELECT * FROM blog_posts WHERE slug = ?", args: [slug] });
    return rowToPost(res.rows[0]);
  },
  byId: async (id) => {
    const res = await db.execute({ sql: "SELECT * FROM blog_posts WHERE id = ?", args: [id] });
    return rowToPost(res.rows[0]);
  },
  create: async (b) => {
    const result = await db.execute({
      sql: `INSERT INTO blog_posts (slug, title, excerpt, category, date, image, content_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [b.slug, b.title, b.excerpt || "", b.category, b.date, b.image || null, JSON.stringify(b.content || [])]
    });
    return BlogPosts.byId(Number(result.lastInsertRowid));
  },
  update: async (id, b) => {
    await db.execute({
      sql: `UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, date=?, image=?, content_json=? WHERE id=?`,
      args: [b.slug, b.title, b.excerpt || "", b.category, b.date, b.image || null, JSON.stringify(b.content || []), id]
    });
    return BlogPosts.byId(id);
  },
  remove: async (id) => {
    await db.execute({ sql: "DELETE FROM blog_posts WHERE id = ?", args: [id] });
  },
};

export const DeliveryZones = {
  all: async () => {
    const res = await db.execute("SELECT * FROM delivery_zones ORDER BY id ASC");
    return res.rows;
  },
  create: async (z) => {
    const result = await db.execute({
      sql: "INSERT INTO delivery_zones (zone, fee, delay) VALUES (?, ?, ?)",
      args: [z.zone, z.fee, z.delay]
    });
    const res = await db.execute({ sql: "SELECT * FROM delivery_zones WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
  update: async (id, z) => {
    await db.execute({
      sql: "UPDATE delivery_zones SET zone=?, fee=?, delay=? WHERE id=?",
      args: [z.zone, z.fee, z.delay, id]
    });
    const res = await db.execute({ sql: "SELECT * FROM delivery_zones WHERE id = ?", args: [id] });
    return res.rows[0];
  },
  remove: async (id) => {
    await db.execute({ sql: "DELETE FROM delivery_zones WHERE id = ?", args: [id] });
  },
};

export const Orders = {
  all: async () => {
    const res = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
    return res.rows.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json || "[]"),
    }));
  },
  create: async (o) => {
    const result = await db.execute({
      sql: `INSERT INTO orders (order_number, full_name, phone, email, address, zone, payment_method, items_json, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      args: [o.orderNumber, o.fullName, o.phone, o.email, o.address, o.zone, o.paymentMethod, JSON.stringify(o.items || []), o.totalAmount]
    });
    const res = await db.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
  updateStatus: async (id, status) => {
    await db.execute({ sql: "UPDATE orders SET status=? WHERE id=?", args: [status, id] });
    const res = await db.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [id] });
    return res.rows[0];
  },
  byOrderNumber: async (orderNumber) => {
    const res = await db.execute({ sql: "SELECT * FROM orders WHERE order_number = ?", args: [orderNumber] });
    return res.rows[0];
  },
};

export const Resellers = {
  all: async () => {
    const res = await db.execute("SELECT * FROM resellers ORDER BY created_at DESC");
    return res.rows;
  },
  create: async (r) => {
    const result = await db.execute({
      sql: `INSERT INTO resellers (company_name, contact_name, email, phone, city, rccm, ifu, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      args: [r.companyName, r.contactName, r.email, r.phone, r.city, r.rccm, r.ifu, r.message || ""]
    });
    const res = await db.execute({ sql: "SELECT * FROM resellers WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
  updateStatus: async (id, status) => {
    await db.execute({ sql: "UPDATE resellers SET status=? WHERE id=?", args: [status, id] });
    const res = await db.execute({ sql: "SELECT * FROM resellers WHERE id = ?", args: [id] });
    return res.rows[0];
  },
};

export const Suppliers = {
  all: async () => {
    const res = await db.execute("SELECT * FROM suppliers ORDER BY created_at DESC");
    return res.rows;
  },
  create: async (s) => {
    const result = await db.execute({
      sql: `INSERT INTO suppliers (full_name, phone, email, region, crop, estimated_volume, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      args: [s.fullName, s.phone, s.email, s.region, s.crop, s.estimatedVolume, s.message || ""]
    });
    const res = await db.execute({ sql: "SELECT * FROM suppliers WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
  updateStatus: async (id, status) => {
    await db.execute({ sql: "UPDATE suppliers SET status=? WHERE id=?", args: [status, id] });
    const res = await db.execute({ sql: "SELECT * FROM suppliers WHERE id = ?", args: [id] });
    return res.rows[0];
  },
};

export const Quotes = {
  all: async () => {
    const res = await db.execute("SELECT * FROM quotes ORDER BY created_at DESC");
    return res.rows;
  },
  create: async (q) => {
    const result = await db.execute({
      sql: `INSERT INTO quotes (company_name, email, phone, location, products, quantity, status) VALUES (?, ?, ?, ?, ?, ?, 'nouveau')`,
      args: [q.companyName, q.email, q.phone, q.location, q.products, q.quantity]
    });
    const res = await db.execute({ sql: "SELECT * FROM quotes WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
};

export const Messages = {
  all: async () => {
    const res = await db.execute("SELECT * FROM messages ORDER BY created_at DESC");
    return res.rows;
  },
  create: async (m) => {
    const result = await db.execute({
      sql: `INSERT INTO messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'nouveau')`,
      args: [m.name, m.email, m.phone || "", m.subject, m.message]
    });
    const res = await db.execute({ sql: "SELECT * FROM messages WHERE id = ?", args: [Number(result.lastInsertRowid)] });
    return res.rows[0];
  },
  updateStatus: async (id, status) => {
    await db.execute({ sql: "UPDATE messages SET status=? WHERE id=?", args: [status, id] });
    const res = await db.execute({ sql: "SELECT * FROM messages WHERE id = ?", args: [id] });
    return res.rows[0];
  },
};

export const Newsletter = {
  create: async (email) => {
    await db.execute({ sql: "INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)", args: [email] });
  },
  count: async () => {
    const res = await db.execute("SELECT COUNT(*) AS count FROM newsletter_subscribers");
    return Number(res.rows[0]?.count || 0);
  },
};

export const Impact = {
  current: async () => {
    const res = await db.execute("SELECT * FROM impact ORDER BY id DESC LIMIT 1");
    return res.rows[0];
  },
  set: async (totalAmount, note) => {
    await db.execute({ sql: "INSERT INTO impact (total_amount, note) VALUES (?, ?)", args: [totalAmount, note || null] });
    return Impact.current();
  },
};

export const PageViews = {
  record: async (path) => {
    await db.execute({ sql: "INSERT INTO page_views (path) VALUES (?)", args: [path] });
  },
  countSince: async (isoDate) => {
    const res = await db.execute({ sql: "SELECT COUNT(*) AS count FROM page_views WHERE created_at >= ?", args: [isoDate] });
    return Number(res.rows[0]?.count || 0);
  },
  total: async () => {
    const res = await db.execute("SELECT COUNT(*) AS count FROM page_views");
    return Number(res.rows[0]?.count || 0);
  },
};

export const AdminUsers = {
  byEmail: async (email) => {
    const res = await db.execute({ sql: "SELECT * FROM admin_users WHERE email = ?", args: [email] });
    return res.rows[0];
  },
};

export const Stats = {
  summary: async () => {
    const orders = await Orders.all();
    const resellers = await Resellers.all();
    const suppliers = await Suppliers.all();
    const messages = await Messages.all();
    const newsletterCount = await Newsletter.count();
    const viewsCount = await PageViews.total();

    const revenue = orders
      .filter((o) => o.status !== "annulee")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const soldCounts = new Map();
    for (const order of orders) {
      for (const item of (order.items || [])) {
        const key = item.name || item.productId || "Produit";
        soldCounts.set(key, (soldCounts.get(key) || 0) + (item.quantity || 1));
      }
    }
    const topProducts = [...soldCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    return {
      ordersCount: orders.length,
      revenue,
      pendingOrders: orders.filter((o) => o.status === "en_attente").length,
      pendingResellers: resellers.filter((r) => r.status === "en_attente").length,
      pendingSuppliers: suppliers.filter((s) => s.status === "en_attente").length,
      newMessages: messages.filter((m) => m.status === "nouveau").length,
      newsletterSubscribers: newsletterCount,
      pageViews: viewsCount,
      topProducts,
    };
  },
};

export default db;