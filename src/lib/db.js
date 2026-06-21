import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { hashPassword } from "@/lib/password";
import { seedData } from "@/lib/seed-data";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "kadiso.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// A single shared connection — Next.js keeps server modules as singletons
// per process, which is exactly what a synchronous SQLite handle wants.
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
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

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM products").get();
  if (count > 0) return;

  const insertCategory = db.prepare(
    "INSERT OR IGNORE INTO categories (id, name, description, icon, accent) VALUES (?, ?, ?, ?, ?)"
  );
  for (const c of seedData.categories) {
    insertCategory.run(c.id, c.name, c.description, c.icon, c.accent);
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (slug, name, category, price, unit, image, tagline, description, details_json, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of seedData.products) {
    insertProduct.run(
      p.slug,
      p.name,
      p.category,
      p.price,
      p.unit,
      p.image || null,
      p.tagline,
      p.description,
      JSON.stringify(p.details || []),
      p.inStock ? 1 : 0
    );
  }

  const insertPost = db.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, category, date, image, content_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const b of seedData.blogPosts) {
    insertPost.run(b.slug, b.title, b.excerpt, b.category, b.date, b.image || null, JSON.stringify(b.content || []));
  }

  const insertZone = db.prepare("INSERT INTO delivery_zones (zone, fee, delay) VALUES (?, ?, ?)");
  for (const z of seedData.deliveryZones) {
    insertZone.run(z.zone, z.fee, z.delay);
  }

  db.prepare("INSERT INTO impact (total_amount, note) VALUES (?, ?)").run(
    284500000,
    "Montant initial repris du compteur affiché sur le site."
  );

  const adminEmail = process.env.ADMIN_EMAIL || "admin@kadiso.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  db.prepare("INSERT OR IGNORE INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)").run(
    adminEmail,
    hashPassword(adminPassword),
    "Administrateur Kadi'so"
  );

  if (!process.env.ADMIN_PASSWORD) {
    // eslint-disable-next-line no-console
    console.warn(
      `\n[Kadi'so] Aucun ADMIN_PASSWORD défini — compte admin créé avec ${adminEmail} / changeme123.\n` +
        "Définissez ADMIN_EMAIL et ADMIN_PASSWORD dans .env.local puis supprimez data/kadiso.db pour regénérer.\n"
    );
  }
}

seedIfEmpty();

function rowToProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
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
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    image: row.image || undefined,
    content: JSON.parse(row.content_json || "[]"),
  };
}

export const Categories = {
  all: () => db.prepare("SELECT * FROM categories").all(),
};

export const Products = {
  all: () => db.prepare("SELECT * FROM products ORDER BY created_at DESC").all().map(rowToProduct),
  bySlug: (slug) => rowToProduct(db.prepare("SELECT * FROM products WHERE slug = ?").get(slug)),
  byId: (id) => rowToProduct(db.prepare("SELECT * FROM products WHERE id = ?").get(id)),
  byCategory: (category) =>
    db.prepare("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC").all(category).map(rowToProduct),
  create: (p) => {
    const result = db
      .prepare(
        `INSERT INTO products (slug, name, category, price, unit, image, tagline, description, details_json, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        p.slug,
        p.name,
        p.category,
        p.price,
        p.unit,
        p.image || null,
        p.tagline || "",
        p.description || "",
        JSON.stringify(p.details || []),
        p.inStock === false ? 0 : 1
      );
    return Products.byId(Number(result.lastInsertRowid));
  },
  update: (id, p) => {
    db.prepare(
      `UPDATE products SET slug=?, name=?, category=?, price=?, unit=?, image=?, tagline=?, description=?, details_json=?, in_stock=?
       WHERE id=?`
    ).run(
      p.slug,
      p.name,
      p.category,
      p.price,
      p.unit,
      p.image || null,
      p.tagline || "",
      p.description || "",
      JSON.stringify(p.details || []),
      p.inStock === false ? 0 : 1,
      id
    );
    return Products.byId(id);
  },
  remove: (id) => db.prepare("DELETE FROM products WHERE id = ?").run(id),
};

export const BlogPosts = {
  all: () => db.prepare("SELECT * FROM blog_posts ORDER BY date DESC").all().map(rowToPost),
  bySlug: (slug) => rowToPost(db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug)),
  byId: (id) => rowToPost(db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id)),
  create: (b) => {
    const result = db
      .prepare(
        `INSERT INTO blog_posts (slug, title, excerpt, category, date, image, content_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(b.slug, b.title, b.excerpt || "", b.category, b.date, b.image || null, JSON.stringify(b.content || []));
    return BlogPosts.byId(Number(result.lastInsertRowid));
  },
  update: (id, b) => {
    db.prepare(
      `UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, date=?, image=?, content_json=? WHERE id=?`
    ).run(b.slug, b.title, b.excerpt || "", b.category, b.date, b.image || null, JSON.stringify(b.content || []), id);
    return BlogPosts.byId(id);
  },
  remove: (id) => db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id),
};

export const DeliveryZones = {
  all: () => db.prepare("SELECT * FROM delivery_zones ORDER BY id ASC").all(),
  create: (z) => {
    const result = db.prepare("INSERT INTO delivery_zones (zone, fee, delay) VALUES (?, ?, ?)").run(
      z.zone,
      z.fee,
      z.delay
    );
    return db.prepare("SELECT * FROM delivery_zones WHERE id = ?").get(Number(result.lastInsertRowid));
  },
  update: (id, z) => {
    db.prepare("UPDATE delivery_zones SET zone=?, fee=?, delay=? WHERE id=?").run(z.zone, z.fee, z.delay, id);
    return db.prepare("SELECT * FROM delivery_zones WHERE id = ?").get(id);
  },
  remove: (id) => db.prepare("DELETE FROM delivery_zones WHERE id = ?").run(id),
};

export const Orders = {
  all: () => db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all().map((o) => ({
    ...o,
    items: JSON.parse(o.items_json || "[]"),
  })),
  create: (o) => {
    const result = db
      .prepare(
        `INSERT INTO orders (order_number, full_name, phone, email, address, zone, payment_method, items_json, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`
      )
      .run(
        o.orderNumber,
        o.fullName,
        o.phone,
        o.email,
        o.address,
        o.zone,
        o.paymentMethod,
        JSON.stringify(o.items || []),
        o.totalAmount
      );
    return db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(result.lastInsertRowid));
  },
  updateStatus: (id, status) => {
    db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
    return db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  },
  byOrderNumber: (orderNumber) => db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber),
};

export const Resellers = {
  all: () => db.prepare("SELECT * FROM resellers ORDER BY created_at DESC").all(),
  create: (r) => {
    const result = db
      .prepare(
        `INSERT INTO resellers (company_name, contact_name, email, phone, city, rccm, ifu, message, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`
      )
      .run(r.companyName, r.contactName, r.email, r.phone, r.city, r.rccm, r.ifu, r.message || "");
    return db.prepare("SELECT * FROM resellers WHERE id = ?").get(Number(result.lastInsertRowid));
  },
  updateStatus: (id, status) => {
    db.prepare("UPDATE resellers SET status=? WHERE id=?").run(status, id);
    return db.prepare("SELECT * FROM resellers WHERE id = ?").get(id);
  },
};

export const Suppliers = {
  all: () => db.prepare("SELECT * FROM suppliers ORDER BY created_at DESC").all(),
  create: (s) => {
    const result = db
      .prepare(
        `INSERT INTO suppliers (full_name, phone, email, region, crop, estimated_volume, message, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente')`
      )
      .run(s.fullName, s.phone, s.email, s.region, s.crop, s.estimatedVolume, s.message || "");
    return db.prepare("SELECT * FROM suppliers WHERE id = ?").get(Number(result.lastInsertRowid));
  },
  updateStatus: (id, status) => {
    db.prepare("UPDATE suppliers SET status=? WHERE id=?").run(status, id);
    return db.prepare("SELECT * FROM suppliers WHERE id = ?").get(id);
  },
};

export const Quotes = {
  all: () => db.prepare("SELECT * FROM quotes ORDER BY created_at DESC").all(),
  create: (q) => {
    const result = db
      .prepare(
        `INSERT INTO quotes (company_name, email, phone, location, products, quantity, status)
         VALUES (?, ?, ?, ?, ?, ?, 'nouveau')`
      )
      .run(q.companyName, q.email, q.phone, q.location, q.products, q.quantity);
    return db.prepare("SELECT * FROM quotes WHERE id = ?").get(Number(result.lastInsertRowid));
  },
};

export const Messages = {
  all: () => db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all(),
  create: (m) => {
    const result = db
      .prepare(
        `INSERT INTO messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'nouveau')`
      )
      .run(m.name, m.email, m.phone || "", m.subject, m.message);
    return db.prepare("SELECT * FROM messages WHERE id = ?").get(Number(result.lastInsertRowid));
  },
  updateStatus: (id, status) => {
    db.prepare("UPDATE messages SET status=? WHERE id=?").run(status, id);
    return db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
  },
};

export const Newsletter = {
  create: (email) => {
    db.prepare("INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)").run(email);
  },
  count: () => db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count,
};

export const Impact = {
  current: () => db.prepare("SELECT * FROM impact ORDER BY id DESC LIMIT 1").get(),
  set: (totalAmount, note) => {
    db.prepare("INSERT INTO impact (total_amount, note) VALUES (?, ?)").run(totalAmount, note || null);
    return Impact.current();
  },
};

export const PageViews = {
  record: (path) => db.prepare("INSERT INTO page_views (path) VALUES (?)").run(path),
  countSince: (isoDate) =>
    db.prepare("SELECT COUNT(*) AS count FROM page_views WHERE created_at >= ?").get(isoDate).count,
  total: () => db.prepare("SELECT COUNT(*) AS count FROM page_views").get().count,
};

export const AdminUsers = {
  byEmail: (email) => db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email),
};

export const Stats = {
  summary: () => {
    const orders = Orders.all();
    const revenue = orders
      .filter((o) => o.status !== "annulee")
      .reduce((sum, o) => sum + o.total_amount, 0);

    const soldCounts = new Map();
    for (const order of orders) {
      for (const item of order.items) {
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
      pendingResellers: Resellers.all().filter((r) => r.status === "en_attente").length,
      pendingSuppliers: Suppliers.all().filter((s) => s.status === "en_attente").length,
      newMessages: Messages.all().filter((m) => m.status === "nouveau").length,
      newsletterSubscribers: Newsletter.count(),
      pageViews: PageViews.total(),
      topProducts,
    };
  },
};

export default db;
