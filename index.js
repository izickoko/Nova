/* =============================================
   NOVATRADE — index.js (Landing Page logic)
============================================= */

// ── Build market highlight cards ──
function buildHighlights() {
  const grid = document.getElementById('highlights-grid');
  if (!grid) return;

  // Pick top 4 by absolute % change
  const top = [...MARKET_DATA]
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 4);

  grid.innerHTML = top.map(a => `
    <div class="highlight-card fade-up" onclick="window.location='markets.html'">
      <div class="hc-top">
        <div class="hc-asset">
          <div class="hc-icon">${a.logo}</div>
          <div>
            <div class="hc-name">${a.name}</div>
            <div class="hc-sym">${a.symbol}</div>
          </div>
        </div>
        <div class="badge ${a.change >= 0 ? 'badge-up' : 'badge-down'}">
          ${changeArrow(a.change)} ${Math.abs(a.change).toFixed(2)}%
        </div>
      </div>
      <div class="hc-price">${formatPrice(a.price)}</div>
      <div class="hc-vol">Vol: $${a.volume}</div>
    </div>
  `).join('');

  // Re-init fade observer for new elements
  initFadeUp();
}

// ── Mini SVG chart (random walk path) ──
function buildHeroChart() {
  const line = document.getElementById('chart-line');
  const area = document.getElementById('chart-area');
  if (!line || !area) return;

  const W = 320, H = 90;
  const points = 40;

  function makePath() {
    let y = H * 0.55;
    const pts = [];
    for (let i = 0; i < points; i++) {
      y += (Math.random() - 0.47) * 8;
      y = Math.max(8, Math.min(H - 8, y));
      pts.push({ x: (i / (points - 1)) * W, y });
    }
    return pts;
  }

  function ptsToD(pts) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }

  function render() {
    const pts = makePath();
    const d = ptsToD(pts);
    line.setAttribute('d', d);
    area.setAttribute('d', `${d} L${W},${H} L0,${H} Z`);
  }

  render();
  setInterval(render, 3000);
}

// ── Live price update on hero card ──
function updateHeroPrice() {
  const btc = MARKET_DATA.find(a => a.id === 'btc');
  if (!btc) return;

  const priceEl  = document.getElementById('hero-btc-price');
  const changeEl = document.getElementById('hero-btc-change');
  if (priceEl)  priceEl.textContent  = formatPrice(btc.price);
  if (changeEl) {
    changeEl.textContent  = `${changeArrow(btc.change)} ${Math.abs(btc.change).toFixed(2)}%`;
    changeEl.className    = `badge ${btc.change >= 0 ? 'badge-up' : 'badge-down'}`;
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  buildHighlights();
  buildHeroChart();
  simulatePrices(() => {
    updateHeroPrice();
    buildTicker();   // refresh ticker with new prices
  });
});
