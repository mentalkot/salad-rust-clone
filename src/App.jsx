import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Gamepad2,
  Gift,
  Globe,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Swords,
  TimerReset,
  TrendingUp,
  UserCog,
  Users,
  Zap,
} from 'lucide-react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

const STORAGE_KEY = 'salad-rust-store';
const ADMIN_KEY = 'salad-rust-admin';

const defaultSite = {
  brand: 'SaladRust',
  heroTitle: 'Buy premium Rust services and wipe events with confidence.',
  heroSubtitle:
    'Fast setup, secure payments, and elite support for Rust players, hosting, and wipe plans.',
  ctaPrimary: 'Browse products',
  ctaSecondary: 'View wipes',
  navLinks: ['Products', 'Wipes', 'Support', 'FAQ'],
  trustText: 'Trusted by 1200+ active Rust players',
  contactEmail: 'support@saladrust.gg',
  contactDiscord: 'discord.gg/saladrust',
  socials: {
    discord: 'https://discord.com',
    telegram: 'https://t.me',
    x: 'https://x.com',
  },
};

const defaultProducts = [
  {
    id: 1,
    name: 'Rust Starter Kit',
    type: 'Service',
    price: 24,
    oldPrice: 32,
    stock: 15,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    description: 'Ideal for new players who need a smoother start with optimized Rust setup.',
    features: ['Instant activation', '5 server tips', 'Support included'],
  },
  {
    id: 2,
    name: 'Elite Wipe Bundle',
    type: 'Bundle',
    price: 69,
    oldPrice: 89,
    stock: 8,
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    description: 'Prepared for wipe events with quick deployment and premium items for survival runs.',
    features: ['Full storage access', 'Priority queue', 'Limited Wipe bonus'],
  },
  {
    id: 3,
    name: 'Rust Hosting Pro',
    type: 'Hosting',
    price: 49,
    oldPrice: 64,
    stock: 11,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=900&q=80',
    description: 'Launch your own private sandbox with optimized hosting and admin controls.',
    features: ['24/7 uptime', 'Advanced mods', 'Fast restore'],
  },
  {
    id: 4,
    name: 'VIP Account Boost',
    type: 'Account',
    price: 39,
    oldPrice: 52,
    stock: 13,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    description: 'Boost your account performance with priority support and custom setup guidance.',
    features: ['Fast queue', 'Exclusive benefits', 'Secure transfer'],
  },
];

const defaultWipes = [
  {
    id: 1,
    name: 'Summer Wipe',
    date: '2026-11-02T18:00:00',
    status: 'Live',
    reward: 'Top 10 bonus crate',
    prize: '$150',
  },
  {
    id: 2,
    name: 'Raid Reset',
    date: '2026-11-16T20:00:00',
    status: 'Scheduled',
    reward: 'Free booster pack',
    prize: '$90',
  },
  {
    id: 3,
    name: 'Night Event',
    date: '2026-11-27T21:00:00',
    status: 'Coming soon',
    reward: 'Double front base bonus',
    prize: '$120',
  },
];

const authUser = {
  email: 'admin@saladrust.gg',
  password: 'admin123',
};

function getStoreState() {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) {
    const state = {
      site: defaultSite,
      products: defaultProducts,
      wipes: defaultWipes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }
  return JSON.parse(item);
}

function saveStoreState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem(ADMIN_KEY) || 'false');
    setIsAdmin(Boolean(admin));
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function App() {
  const [site, setSite] = useState(() => getStoreState().site);
  const [products, setProducts] = useState(() => getStoreState().products);
  const [wipes, setWipes] = useState(() => getStoreState().wipes);

  useEffect(() => {
    const nextState = { site, products, wipes };
    saveStoreState(nextState);
  }, [site, products, wipes]);

  const handleProductUpsert = (product) => {
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => (item.id === product.id ? product : item));
      }
      return [product, ...prev];
    });
  };

  const handleProductDelete = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleWipeUpsert = (wipe) => {
    setWipes((prev) => {
      const exists = prev.some((item) => item.id === wipe.id);
      if (exists) {
        return prev.map((item) => (item.id === wipe.id ? wipe : item));
      }
      return [wipe, ...prev];
    });
  };

  const handleWipeDelete = (id) => {
    setWipes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSiteSave = (nextSite) => {
    setSite(nextSite);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage site={site} products={products} wipes={wipes} />}
      />
      <Route path="/product/:id" element={<ProductDetailPage products={products} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard
              site={site}
              products={products}
              wipes={wipes}
              onSaveSite={handleSiteSave}
              onUpsertProduct={handleProductUpsert}
              onDeleteProduct={handleProductDelete}
              onUpsertWipe={handleWipeUpsert}
              onDeleteWipe={handleWipeDelete}
            />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function HomePage({ site, products, wipes }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <Link to="/" className="brand-mark">
            <span className="brand-logo">S</span>
            {site.brand}
          </Link>
          <nav className="nav-links">
            {site.navLinks.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="icon-button" aria-label="Cart">
              <ShoppingCart size={18} />
            </button>
            <Link to="/admin/login" className="btn btn-outline small">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-layout">
            <div className="hero-copy">
              <span className="eyebrow">Premium Rust ecosystem</span>
              <h1>{site.heroTitle}</h1>
              <p>{site.heroSubtitle}</p>
              <div className="hero-actions">
                <Link to="/" className="btn btn-primary">
                  {site.ctaPrimary} <ArrowRight size={18} />
                </Link>
                <Link to="/" className="btn btn-secondary">
                  {site.ctaSecondary}
                </Link>
              </div>
              <div className="trust-row">
                <div className="trust-pill">
                  <ShieldCheck size={18} /> {site.trustText}
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="floating-card feature-card card-left">
                <div className="three-dots">
                  <span /> <span /> <span />
                </div>
                <h4>Instant deployment</h4>
                <p>Set up in under 10 minutes.</p>
              </div>

              <div className="floating-card stats-card">
                <div className="stat-figure">4.9/5</div>
                <div className="stat-label">Average rating</div>
              </div>

              <div className="floating-card product-mini-card">
                <div className="mini-badge">HOT</div>
                <div className="mini-graphic" />
                <div>
                  <strong>Wipe Pack</strong>
                  <small>From $24</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-band">
          <div className="container features-grid">
            {[
              { icon: Zap, title: 'Fast support', text: 'Priority queue for all orders' },
              { icon: ShieldCheck, title: 'Secure checkout', text: 'Encrypted and trusted payment flow' },
              { icon: Gamepad2, title: 'Gamers focused', text: 'Tools built specifically for Rust' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="feature-box">
                <div className="feature-icon">
                  <Icon size={18} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="products section-spacing">
          <div className="container section-head">
            <div>
              <span className="eyebrow">Popular offers</span>
              <h2>Featured products</h2>
            </div>
            <button className="btn btn-secondary small">View all</button>
          </div>

          <div className="container products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.type}</span>
                </div>
                <div className="product-body">
                  <div className="product-meta-row">
                    <span className="stars">★ {product.rating}</span>
                    <span className="stock">{product.stock} in stock</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <Check size={14} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="product-footer">
                    <div className="price-box">
                      <strong>${product.price}</strong>
                      <span>${product.oldPrice}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="btn btn-primary small">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="wipe section-spacing">
          <div className="container section-head">
            <div>
              <span className="eyebrow">Upcoming arena</span>
              <h2>Event wipe schedule</h2>
            </div>
            <button className="btn btn-secondary small">All events</button>
          </div>

          <div className="container wipe-grid">
            {wipes.map((wipe) => (
              <div key={wipe.id} className="wipe-card">
                <div className="wipe-head">
                  <div>
                    <p className="wipe-status">{wipe.status}</p>
                    <h3>{wipe.name}</h3>
                  </div>
                  <TimerReset size={18} className="wipe-icon" />
                </div>
                <div className="wipe-info">
                  <span>{formatDate(wipe.date)}</span>
                  <span>{wipe.reward}</span>
                </div>
                <div className="wipe-prize-row">
                  <strong>{wipe.prize}</strong>
                  <button className="btn btn-primary tiny">Join now</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="faq section-spacing">
          <div className="container faq-box">
            <div className="faq-copy">
              <span className="eyebrow">Why players choose us</span>
              <h2>Built around reliability and instant support.</h2>
            </div>
            <div className="faq-list">
              {[
                'Secure delivery and instant activation after payment.',
                'Curated bundles optimized for wipe events and server progression.',
                'Friendly support team available across Discord and Telegram.',
              ].map((item) => (
                <div key={item} className="faq-item">
                  <Check size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-wrap">
          <div>
            <h3>{site.brand}</h3>
            <p>{site.heroSubtitle}</p>
          </div>
          <div className="footer-links">
            <a href="#">Products</a>
            <a href="#">Wipes</a>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-meta">
            <span>{site.contactEmail}</span>
            <span>{site.contactDiscord}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductDetailPage({ products }) {
  const { id } = useParams();
  const product = products.find((item) => Number(item.id) === Number(id));

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-shell detail-page">
      <header className="detail-header">
        <div className="container detail-head-wrap">
          <Link to="/" className="btn btn-secondary small">Back</Link>
          <span className="eyebrow">Product details</span>
        </div>
      </header>

      <main className="container detail-layout">
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-content">
          <div className="detail-badges">
            <span className="pill">{product.type}</span>
            <span className="pill">★ {product.rating}</span>
          </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <ul className="detail-list">
            {product.features.map((feature) => (
              <li key={feature}><Check size={16} /> {feature}</li>
            ))}
          </ul>

          <div className="detail-price-box">
            <div>
              <strong>${product.price}</strong>
              <span>${product.oldPrice}</span>
            </div>
            <button className="btn btn-primary">Add to cart</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: authUser.email, password: authUser.password });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email === authUser.email && form.password === authUser.password) {
      localStorage.setItem(ADMIN_KEY, 'true');
      navigate('/admin');
      return;
    }
    setError('Invalid credentials');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-logo">S</span>
          <h2>Admin login</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="admin@saladrust.gg"
            />
          </label>

          <label>
            Password
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="admin123"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary full">
            Login to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ site, products, wipes, onSaveSite, onUpsertProduct, onDeleteProduct, onUpsertWipe, onDeleteWipe }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [siteForm, setSiteForm] = useState(site);
  const [productForm, setProductForm] = useState({
    id: Date.now(),
    name: '',
    type: 'Service',
    price: 0,
    oldPrice: 0,
    stock: 0,
    rating: 5,
    description: '',
    image: '',
    features: [''],
  });
  const [wipeForm, setWipeForm] = useState({
    id: Date.now(),
    name: '',
    date: new Date().toISOString(),
    status: 'Scheduled',
    reward: '',
    prize: '',
  });

  useEffect(() => {
    setSiteForm(site);
  }, [site]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate('/admin/login');
  };

  const handleSiteSubmit = (e) => {
    e.preventDefault();
    onSaveSite(siteForm);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    onUpsertProduct({
      ...productForm,
      features: productForm.features.filter(Boolean),
      id: productForm.id || Date.now(),
    });
    setProductForm({
      id: Date.now(),
      name: '',
      type: 'Service',
      price: 0,
      oldPrice: 0,
      stock: 0,
      rating: 5,
      description: '',
      image: '',
      features: [''],
    });
  };

  const handleWipeSubmit = (e) => {
    e.preventDefault();
    onUpsertWipe({ ...wipeForm, id: wipeForm.id || Date.now() });
    setWipeForm({
      id: Date.now(),
      name: '',
      date: new Date().toISOString(),
      status: 'Scheduled',
      reward: '',
      prize: '',
    });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">S</span>
          <div>
            <strong>{site.brand}</strong>
            <small>Control center</small>
          </div>
        </div>

        <nav className="admin-menu">
          {[
            ['overview', 'Overview', TrendingUp],
            ['products', 'Products', Package],
            ['wipes', 'Wipes', Swords],
            ['settings', 'Site settings', Settings],
          ].map(([key, label, Icon]) => (
            <button
              type="button"
              key={key}
              className={activeTab === key ? 'menu-item active' : 'menu-item'}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        {activeTab === 'overview' && (
          <div className="admin-panel">
            <div className="admin-topbar">
              <div>
                <span className="eyebrow">Admin overview</span>
                <h2>Dashboard</h2>
              </div>
              <button className="btn btn-primary small" onClick={() => setActiveTab('settings')}>
                Update site
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-panel">
                <Users size={18} />
                <strong>{products.length}</strong>
                <span>Products</span>
              </div>
              <div className="stat-panel">
                <Package size={18} />
                <strong>{wipes.length}</strong>
                <span>Wipes</span>
              </div>
              <div className="stat-panel">
                <ShoppingCart size={18} />
                <strong>86</strong>
                <span>Orders</span>
              </div>
              <div className="stat-panel">
                <CreditCard size={18} />
                <strong>$12.4k</strong>
                <span>Revenue</span>
              </div>
            </div>

            <div className="overview-grid">
              <div className="card">
                <h3>Recent activity</h3>
                <ul className="activity-list">
                  <li>Rust Starter Kit sold to user #7821</li>
                  <li>Summer Wipe updated in schedule</li>
                  <li>Support Discord newsletter published</li>
                </ul>
              </div>
              <div className="card">
                <h3>Operational health</h3>
                <div className="progress-line">
                  <span style={{ width: '92%' }} />
                </div>
                <p>System uptime: 92% with low latency across all live services.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-panel">
            <div className="admin-topbar">
              <div>
                <span className="eyebrow">Inventory</span>
                <h2>Manage products</h2>
              </div>
            </div>

            <div className="admin-grid two-cols">
              <form onSubmit={handleProductSubmit} className="card form-card">
                <h3>Add / update product</h3>
                <div className="field-grid">
                  <input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Product name"
                  />
                  <input
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                    placeholder="Type"
                  />
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                    placeholder="Old price"
                  />
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    placeholder="Stock"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.rating}
                    onChange={(e) => setProductForm({ ...productForm, rating: Number(e.target.value) })}
                    placeholder="Rating"
                  />
                  <input
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Description"
                  />
                </div>

                <div className="feature-stack">
                  {productForm.features.map((feature, index) => (
                    <input
                      key={index}
                      value={feature}
                      onChange={(e) => {
                        const next = [...productForm.features];
                        next[index] = e.target.value;
                        setProductForm({ ...productForm, features: next });
                      }}
                      placeholder={`Feature ${index + 1}`}
                    />
                  ))}
                </div>

                <button type="button" className="btn btn-secondary small" onClick={() => setProductForm({ ...productForm, features: [...productForm.features, ''] })}>
                  Add feature
                </button>
                <button type="submit" className="btn btn-primary">
                  Save product
                </button>
              </form>

              <div className="card products-list-card">
                <h3>Product catalog</h3>
                <div className="mini-list">
                  {products.map((product) => (
                    <div key={product.id} className="mini-row">
                      <div>
                        <strong>{product.name}</strong>
                        <small>${product.price}</small>
                      </div>
                      <div className="mini-actions">
                        <button
                          type="button"
                          className="btn btn-secondary tiny"
                          onClick={() => setProductForm(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger tiny"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wipes' && (
          <div className="admin-panel">
            <div className="admin-topbar">
              <div>
                <span className="eyebrow">Events</span>
                <h2>Manage wipes</h2>
              </div>
            </div>

            <div className="admin-grid two-cols">
              <form onSubmit={handleWipeSubmit} className="card form-card">
                <h3>Add / update wipe</h3>
                <div className="field-grid">
                  <input
                    value={wipeForm.name}
                    onChange={(e) => setWipeForm({ ...wipeForm, name: e.target.value })}
                    placeholder="Wipe name"
                  />
                  <input
                    type="datetime-local"
                    value={wipeForm.date.slice(0, 16)}
                    onChange={(e) => setWipeForm({ ...wipeForm, date: new Date(e.target.value).toISOString() })}
                  />
                  <input
                    value={wipeForm.status}
                    onChange={(e) => setWipeForm({ ...wipeForm, status: e.target.value })}
                    placeholder="Status"
                  />
                  <input
                    value={wipeForm.reward}
                    onChange={(e) => setWipeForm({ ...wipeForm, reward: e.target.value })}
                    placeholder="Reward"
                  />
                  <input
                    value={wipeForm.prize}
                    onChange={(e) => setWipeForm({ ...wipeForm, prize: e.target.value })}
                    placeholder="Prize"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save wipe</button>
              </form>

              <div className="card products-list-card">
                <h3>Wipe schedule</h3>
                <div className="mini-list">
                  {wipes.map((wipe) => (
                    <div key={wipe.id} className="mini-row">
                      <div>
                        <strong>{wipe.name}</strong>
                        <small>{wipe.status}</small>
                      </div>
                      <div className="mini-actions">
                        <button
                          type="button"
                          className="btn btn-secondary tiny"
                          onClick={() => setWipeForm(wipe)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger tiny"
                          onClick={() => onDeleteWipe(wipe.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-panel">
            <div className="admin-topbar">
              <div>
                <span className="eyebrow">Configuration</span>
                <h2>Site settings</h2>
              </div>
            </div>

            <form onSubmit={handleSiteSubmit} className="card form-card settings-form">
              <div className="field-grid">
                <input
                  value={siteForm.brand}
                  onChange={(e) => setSiteForm({ ...siteForm, brand: e.target.value })}
                  placeholder="Brand name"
                />
                <input
                  value={siteForm.heroTitle}
                  onChange={(e) => setSiteForm({ ...siteForm, heroTitle: e.target.value })}
                  placeholder="Hero title"
                />
                <textarea
                  value={siteForm.heroSubtitle}
                  onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                  placeholder="Hero subtitle"
                />
                <input
                  value={siteForm.ctaPrimary}
                  onChange={(e) => setSiteForm({ ...siteForm, ctaPrimary: e.target.value })}
                  placeholder="Primary CTA"
                />
                <input
                  value={siteForm.ctaSecondary}
                  onChange={(e) => setSiteForm({ ...siteForm, ctaSecondary: e.target.value })}
                  placeholder="Secondary CTA"
                />
                <input
                  value={siteForm.contactEmail}
                  onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                  placeholder="Support email"
                />
                <input
                  value={siteForm.contactDiscord}
                  onChange={(e) => setSiteForm({ ...siteForm, contactDiscord: e.target.value })}
                  placeholder="Discord link"
                />
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
