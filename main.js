/* =============================================
   NOVATRADE — Shared JS (main.js)
   Mock data, ticker, utilities
============================================= */

// ── Mock Market Data ──
const MARKET_DATA = [
  { id: 'btc',  name: 'Bitcoin',   symbol: 'BTC',  type: 'crypto', price: 67420.50, change: 2.84,  volume: '38.2B', cap: '1.32T', logo: '₿' },
  { id: 'eth',  name: 'Ethereum',  symbol: 'ETH',  type: 'crypto', price: 3512.80,  change: 1.52,  volume: '18.7B', cap: '421B',  logo: 'Ξ' },
  { id: 'sol',  name: 'Solana',    symbol: 'SOL',  type: 'crypto', price: 184.60,   change: 5.21,  volume: '4.1B',  cap: '83B',   logo: '◎' },
  { id: 'bnb',  name: 'BNB',       symbol: 'BNB',  type: 'crypto', price: 598.40,   change: -0.87, volume: '2.9B',  cap: '89B',   logo: 'B' },
  { id: 'xrp',  name: 'XRP',       symbol: 'XRP',  type: 'crypto', price: 0.6240,   change: -2.13, volume: '1.8B',  cap: '34B',   logo: 'X' },
  { id: 'ada',  name: 'Cardano',   symbol: 'ADA',  type: 'crypto', price: 0.4580,   change: 3.40,  volume: '620M',  cap: '16B',   logo: '₳' },
  { id: 'aapl', name: 'Apple',     symbol: 'AAPL', type: 'stock',  price: 214.32,   change: 0.78,  volume: '62M',   cap: '3.3T',  logo: '🍎' },
  { id: 'tsla', name: 'Tesla',     symbol: 'TSLA', type: 'stock',  price: 248.60,   change: -1.44, volume: '98M',   cap: '790B',  logo: 'T' },
  { id: 'nvda', name: 'NVIDIA',    symbol: 'NVDA', type: 'stock',  price: 875.40,   change: 4.12,  volume: '44M',   cap: '2.1T',  logo: 'N' },
  { id: 'msft', name: 'Microsoft', symbol: 'MSFT', type: 'stock',  price: 418.90,   change: 0.32,  volume: '22M',   cap: '3.1T',  logo: 'M' },
  { id: 'amzn', name: 'Amazon',    symbol: 'AMZN', type: 'stock',  price: 198.75,   change: -0.55, volume: '35M',   cap: '2.0T',  logo: 'A' },
  { id: 'googl',name: 'Alphabet',  symbol: 'GOOGL',type: 'stock',  price: 176.80,   change: 1.20,  volume: '28M',   cap: '2.2T',  logo: 'G' },
];

// ── Format helpers ──
function formatPrice(price) {
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1)    return '$' + price.toFixed(2);
  return '$' + price.toFixed(4);
}

function formatChange(change) {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function changeClass(change) {
  return change >= 0 ? 'up' : 'down';
}

function changeArrow(change) {
  return change >= 0 ? '▲' : '▼';
}

// ── Build & inject the ticker strip ──
function buildTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  // Double items for seamless loop
  const items = [...MARKET_DATA, ...MARKET_DATA];
  track.innerHTML = items.map(a => `
    <div class="ticker-item">
      <span class="t-name">${a.symbol}</span>
      <span class="t-price">${formatPrice(a.price)}</span>
      <span class="t-change ${changeClass(a.change)}">${changeArrow(a.change)} ${Math.abs(a.change).toFixed(2)}%</span>
    </div>
  `).join('');
}

// ── Scroll fade-up observer ──
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ── Fake price simulation (small random walk) ──
function simulatePrices(callback) {
  setInterval(() => {
    MARKET_DATA.forEach(asset => {
      const delta = (Math.random() - 0.49) * asset.price * 0.002;
      asset.price = Math.max(0.001, asset.price + delta);
    });
    if (callback) callback();
  }, 3000);
}

// ── Toast notification ──
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      display: flex; flex-direction: column; gap: 10px;
      z-index: 9999;
    `;
    document.body.appendChild(container);
  }

  const colors = { info: '#00C2FF', success: '#00E5A0', error: '#FF4D6A' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #0D1321;
    border: 1px solid ${colors[type] || colors.info};
    color: #EDF2FF;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 0.875rem;
    box-shadow: 0 0 20px ${colors[type]}33;
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    max-width: 280px;
  `;
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── On DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  initFadeUp();
});
