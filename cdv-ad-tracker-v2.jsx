import { useState, useEffect, useCallback, useMemo } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #070710;
    --bg-card: #0E0E1C;
    --bg-card2: #141428;
    --border: rgba(124,58,237,0.18);
    --border-light: rgba(255,255,255,0.06);
    --violet: #7C3AED;
    --violet-light: #9D6EFF;
    --violet-glow: rgba(124,58,237,0.35);
    --green: #10B981;
    --amber: #F59E0B;
    --red: #EF4444;
    --cyan: #06B6D4;
    --text: #E8E8F0;
    --text-muted: #6B6B90;
    --text-dim: #3A3A5C;
    --gold: #FFD700;
    --whale: #0EA5E9;
    --fat: #22C55E;
    --small: #6B7280;
    --font-ui: 'Outfit', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-ui);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 2px; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── CONNECT SCREEN ── */
  .connect-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .connect-screen::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .connect-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(var(--border-light) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border-light) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%);
  }
  .connect-box {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3rem;
    width: 100%;
    max-width: 540px;
    position: relative;
    box-shadow: 0 0 60px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.6);
  }
  .connect-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 2rem;
  }
  .connect-logo-icon {
    width: 36px; height: 36px;
    background: var(--violet);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .connect-logo span {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--violet-light);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .connect-title {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  .connect-title em {
    font-style: normal;
    color: var(--violet-light);
  }
  .connect-sub {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  .connect-label {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }
  .connect-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 1rem;
  }
  .connect-input:focus {
    border-color: var(--violet);
    box-shadow: 0 0 0 3px var(--violet-glow);
  }
  .connect-input::placeholder { color: var(--text-dim); }
  .btn-primary {
    width: 100%;
    background: var(--violet);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-family: var(--font-ui);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-primary:hover { background: var(--violet-light); box-shadow: 0 0 20px var(--violet-glow); }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .connect-note {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: var(--text-dim);
    text-align: center;
    line-height: 1.5;
  }

  /* ── HEADER ── */
  .header {
    padding: 0 1.5rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light);
    background: rgba(7,7,16,0.9);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .header-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--violet-light);
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.25);
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .header-right { display: flex; align-items: center; gap: 10px; }
  .last-update {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
  }
  .btn-sm {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-light);
    border-radius: 7px;
    color: var(--text);
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    font-family: var(--font-ui);
    transition: background 0.15s, border-color 0.15s;
  }
  .btn-sm:hover { background: rgba(255,255,255,0.09); border-color: var(--border); }
  .btn-sm.danger { border-color: rgba(239,68,68,0.3); }
  .btn-sm.danger:hover { background: rgba(239,68,68,0.08); border-color: var(--red); color: var(--red); }

  /* ── MAIN LAYOUT ── */
  .main { display: flex; flex: 1; overflow: hidden; }
  .content { flex: 1; overflow-y: auto; padding: 1.5rem; }

  /* ── STATS GRID ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border); }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent, var(--violet));
    opacity: 0.6;
  }
  .stat-card .label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .stat-card .value {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-card .sub {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  /* ── FILTERS ── */
  .filters-bar {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-end;
    margin-bottom: 1.5rem;
  }
  .filter-group { display: flex; flex-direction: column; gap: 5px; }
  .filter-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .filter-select, .filter-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-light);
    border-radius: 7px;
    color: var(--text);
    font-family: var(--font-ui);
    font-size: 12px;
    padding: 6px 10px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
    min-width: 130px;
  }
  .filter-select:focus, .filter-input:focus {
    border-color: var(--violet);
  }
  .filter-select option { background: var(--bg-card2); }
  .filter-input { font-family: var(--font-mono); font-size: 11px; }
  .filter-actions { display: flex; gap: 8px; align-items: flex-end; margin-left: auto; }

  /* ── RANKING HEADER ── */
  .ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .ranking-title {
    font-size: 0.8rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .ranking-count {
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  /* ── AD CARDS ── */
  .ad-list { display: flex; flex-direction: column; gap: 8px; }
  .ad-card {
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 12px;
    align-items: center;
  }
  .ad-card:hover { border-color: var(--border); background: var(--bg-card2); transform: translateX(2px); }
  .ad-card.active { border-color: var(--violet); background: rgba(124,58,237,0.06); }
  .ad-rank {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    text-align: center;
  }
  .ad-rank.top1 { color: var(--gold); font-weight: 700; }
  .ad-rank.top2 { color: #C0C0C0; font-weight: 700; }
  .ad-rank.top3 { color: #CD7F32; font-weight: 700; }
  .ad-body { display: flex; flex-direction: column; gap: 8px; }
  .ad-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
    font-family: var(--font-mono);
  }
  .ad-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  .metric-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 5px;
    font-family: var(--font-mono);
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-light);
    color: var(--text-muted);
  }
  .metric-pill.bb { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.3); color: var(--violet-light); }
  .metric-pill.safa { background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.2); color: var(--cyan); }
  .metric-pill.calificado { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); color: var(--green); }
  .metric-pill.whale { background: rgba(14,165,233,0.08); border-color: rgba(14,165,233,0.2); color: var(--whale); }
  .qscore-badge {
    margin-left: auto;
    background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(157,110,255,0.1));
    border: 1px solid rgba(124,58,237,0.4);
    border-radius: 8px;
    padding: 4px 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--violet-light);
    white-space: nowrap;
    min-width: 60px;
    text-align: center;
    align-self: center;
  }

  /* ── SIDE PANEL ── */
  .side-panel {
    width: 380px;
    min-width: 380px;
    border-left: 1px solid var(--border-light);
    overflow-y: auto;
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  }
  .panel-header {
    padding: 1.2rem;
    border-bottom: 1px solid var(--border-light);
    position: sticky;
    top: 0;
    background: var(--bg-card);
    z-index: 10;
  }
  .panel-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 5px;
    float: right;
    transition: color 0.15s;
  }
  .panel-close:hover { color: var(--text); }
  .panel-ad-name {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--violet-light);
    line-height: 1.4;
    margin-top: 8px;
    word-break: break-word;
  }
  .panel-mini-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid var(--border-light);
  }
  .mini-stat {
    text-align: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 8px;
  }
  .mini-stat .v { font-size: 1.2rem; font-weight: 700; }
  .mini-stat .l { font-size: 9px; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  /* composition bar */
  .comp-bar-section { padding: 1rem 1.2rem; border-bottom: 1px solid var(--border-light); }
  .comp-bar-label { font-size: 9px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .comp-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; gap: 1px; }
  .comp-bar-seg { height: 100%; transition: width 0.3s; border-radius: 2px; }
  .comp-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .comp-legend-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-muted); }
  .comp-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* lead list */
  .leads-list { padding: 1rem 1.2rem; display: flex; flex-direction: column; gap: 8px; }
  .lead-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    padding: 10px 12px;
  }
  .lead-card.bb-lead { border-color: rgba(124,58,237,0.3); background: rgba(124,58,237,0.04); }
  .lead-name { font-weight: 600; font-size: 0.82rem; margin-bottom: 4px; }
  .lead-meta { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono); }
  .lead-badges { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
  .badge {
    font-size: 9px;
    font-family: var(--font-mono);
    letter-spacing: 0.5px;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid;
    text-transform: uppercase;
  }
  .badge-bb { background: rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.4); color: var(--violet-light); }
  .badge-safa { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.3); color: var(--cyan); }
  .badge-mega { background: rgba(255,215,0,0.1); border-color: rgba(255,215,0,0.3); color: var(--gold); }
  .badge-whale { background: rgba(14,165,233,0.1); border-color: rgba(14,165,233,0.3); color: var(--whale); }
  .badge-fat { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: var(--fat); }
  .badge-small { background: rgba(107,114,128,0.1); border-color: rgba(107,114,128,0.3); color: #9CA3AF; }
  .badge-agendo { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: var(--green); }
  .lead-detail { font-size: 10px; color: var(--text-muted); line-height: 1.6; }

  /* ── LOADING ── */
  .loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 4rem;
    gap: 1rem;
  }
  .spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--border);
    border-top-color: var(--violet);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }

  /* ── ERROR ── */
  .error-box {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    color: #FCA5A5;
    font-size: 0.82rem;
    margin-bottom: 1rem;
    font-family: var(--font-mono);
  }

  /* ── EMPTY ── */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
  }
  .empty-state .icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .empty-state p { font-size: 0.85rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .main { flex-direction: column; }
    .side-panel { width: 100%; min-width: unset; border-left: none; border-top: 1px solid var(--border-light); max-height: 60vh; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .filter-actions { margin-left: 0; width: 100%; }
    .ad-card { grid-template-columns: 1.8rem 1fr; }
    .qscore-badge { font-size: 11px; }
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const UNIDENTIFIED = "Sin identificar";

function cleanTerm(term) {
  if (!term || term.trim() === "" || term === "{{ad.name}}") return UNIDENTIFIED;
  if (/^\d{10,}$/.test(term.trim())) return UNIDENTIFIED;
  return term.trim();
}

function parseDateStr(s) {
  if (!s) return null;
  // d/mm/yyyy H:mm:ss
  const m = s.match(/^(\d{1,2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6]);
}

function getTier(billing) {
  if (!billing) return "PEZ CHICO";
  const b = billing.toLowerCase();
  if (
    b.includes("más de $100,000 usd") ||
    b.includes("mas de $100,000 usd") ||
    b.includes("más de $50,000 usd") ||
    b.includes("mas de $50,000 usd")
  ) return "MEGA BALLENA";
  if (
    b.includes("entre $10,000 y $50,000") ||
    b.includes("entre $10,000 y $30,000") ||
    b.includes("más de $10.000.000 pesos") ||
    b.includes("mas de $10.000.000 pesos") ||
    b.includes("más de 10 millones") ||
    b.includes("mas de 10 millones")
  ) return "BALLENA";
  if (
    b.includes("entre $5,000 y $10,000 usd") ||
    b.includes("entre $5.000.000 y $10.000.000") ||
    b.includes("entre 5 a 10 millones") ||
    b.includes("entre 5 y 10 millones")
  ) return "PEZ GORDO";
  return "PEZ CHICO";
}

function getTierEmoji(tier) {
  if (tier === "MEGA BALLENA") return "🏆";
  if (tier === "BALLENA") return "🐋";
  if (tier === "PEZ GORDO") return "🐠";
  return "🐟";
}

function getTierColor(tier) {
  if (tier === "MEGA BALLENA") return "var(--gold)";
  if (tier === "BALLENA") return "var(--whale)";
  if (tier === "PEZ GORDO") return "var(--fat)";
  return "var(--small)";
}

function isCalificado(lead) {
  const tier = lead.tier;
  return tier === "MEGA BALLENA" || tier === "BALLENA" || tier === "PEZ GORDO";
}

function getQScore(leads) {
  if (!leads.length) return 0;
  const raw = leads.reduce((acc, l) => {
    const bb = l.calificacion === "BUENA BALA" ? 5 : 0;
    const safa = l.calificacion === "SAFA" ? 3 : 0;
    const calAuto = (!l.calificacion && isCalificado(l)) ? 1.5 : 0;
    const mega = l.tier === "MEGA BALLENA" ? 2 : 0;
    const whale = l.tier === "BALLENA" ? 1 : 0;
    return acc + bb + safa + calAuto + mega + whale;
  }, 0);
  return +(raw / leads.length).toFixed(2);
}

function parseCSV(text) {
  const rows = [];
  let field = "", row = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQ && text[i + 1] === '"') { field += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      row.push(field); field = "";
    } else if ((c === '\n' || c === '\r') && !inQ) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function transformURL(raw) {
  const trimmed = raw.trim();
  // URL de "Publicar en la web" — ya es CSV directo, usarla tal cual
  if (trimmed.includes("/pub?") || trimmed.includes("output=csv") || trimmed.includes("export?format=csv")) {
    return trimmed;
  }
  // URL normal de edición — convertir a export CSV
  if (trimmed.includes("docs.google.com/spreadsheets")) {
    const idM = trimmed.match(/\/d\/([\w-]+)/);
    const gidM = trimmed.match(/gid=(\d+)/);
    if (idM) {
      let url = `https://docs.google.com/spreadsheets/d/${idM[1]}/export?format=csv`;
      if (gidM) url += `&gid=${gidM[1]}`;
      return url;
    }
  }
  return trimmed;
}

function processRows(rows) {
  if (rows.length < 2) return [];
  const header = rows[0].map(h => h.trim().toLowerCase());

  // find column indices dynamically
  const idx = {
    rol: 2,
    submittedAt: 4,
    email: 5,
    nombre: 6,
    telefono: 7,
    vendedores: 8,
    industria: 9,
    facturacion: 10,
    instagram: 11,
    agendo: 12,
    utm_campaign: 13,
    utm_term: 14,
  };

  // find CALIFICACION column
  let calIdx = -1;
  for (let i = 0; i < header.length; i++) {
    if (header[i].includes("calificaci")) { calIdx = i; break; }
  }

  const leads = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < 13) continue;
    const g = (i) => (row[i] || "").trim();

    const nombre = g(idx.nombre);
    if (!nombre) continue;

    const rawTerm = g(idx.utm_term);
    const term = cleanTerm(rawTerm);
    const billing = g(idx.facturacion);
    const tier = getTier(billing);
    const calificacion = calIdx >= 0 ? g(calIdx).toUpperCase() : "";
    const validCal = calificacion === "BUENA BALA" || calificacion === "SAFA" ? calificacion : "";

    leads.push({
      id: r,
      nombre,
      email: g(idx.email),
      telefono: g(idx.telefono),
      rol: g(idx.rol),
      vendedores: g(idx.vendedores),
      industria: g(idx.industria),
      facturacion: billing,
      instagram: g(idx.instagram),
      agendo: g(idx.agendo).toUpperCase() === "SI",
      utm_campaign: g(idx.utm_campaign),
      utm_term: term,
      submittedAt: parseDateStr(g(idx.submittedAt)),
      tier,
      calificacion: validCal,
    });
  }
  return leads;
}

function groupByAd(leads) {
  const map = {};
  for (const lead of leads) {
    const key = lead.utm_term;
    if (!map[key]) map[key] = [];
    map[key].push(lead);
  }
  return map;
}

function buildAdStats(name, leads) {
  const bb = leads.filter(l => l.calificacion === "BUENA BALA").length;
  const safa = leads.filter(l => l.calificacion === "SAFA").length;
  const calAuto = leads.filter(l => !l.calificacion && isCalificado(l)).length;
  const calificados = leads.filter(l => l.calificacion === "BUENA BALA" || l.calificacion === "SAFA" || (!l.calificacion && isCalificado(l))).length;
  const mega = leads.filter(l => l.tier === "MEGA BALLENA").length;
  const whale = leads.filter(l => l.tier === "BALLENA").length;
  const fat = leads.filter(l => l.tier === "PEZ GORDO").length;
  const small = leads.filter(l => l.tier === "PEZ CHICO").length;
  const agendo = leads.filter(l => l.agendo).length;
  const qscore = getQScore(leads);
  return { name, leads, total: leads.length, bb, safa, calAuto, calificados, mega, whale, fat, small, agendo, qscore };
}

const SORT_OPTIONS = [
  { value: "qscore", label: "Q-Score" },
  { value: "bb", label: "BUENA BALA" },
  { value: "calificados", label: "Leads calificados" },
  { value: "pct_cal", label: "% Calificación" },
  { value: "total", label: "Total leads" },
];

const VENDEDORES_OPTIONS = [
  "Todos",
  "Soy solo yo o tengo hasta 2 vendedores",
  "De 3 a 5 vendedores.",
  "De 6 a 15 vendedores",
  "Más de 15 vendedores",
];

const TIER_OPTIONS = ["Todos", "MEGA BALLENA", "BALLENA", "PEZ GORDO", "PEZ CHICO"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [url, setUrl] = useState(() => localStorage.getItem("cdv_url") || "");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allLeads, setAllLeads] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);

  // filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterVendedores, setFilterVendedores] = useState("Todos");
  const [filterAgendo, setFilterAgendo] = useState("Todos");
  const [filterTier, setFilterTier] = useState("Todos");
  const [sortBy, setSortBy] = useState("qscore");

  const fetchData = useCallback(async (rawUrl) => {
    setLoading(true);
    setError("");
    try {
      const fetchUrl = transformURL(rawUrl);
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const rows = parseCSV(text);
      const leads = processRows(rows);
      setAllLeads(leads);
      setLastUpdate(new Date());
      setConnected(true);
      localStorage.setItem("cdv_url", rawUrl);
      localStorage.setItem("cdv_cache", JSON.stringify({ leads, ts: Date.now() }));
    } catch (e) {
      setError(`Error cargando datos: ${e.message}. Verificá que el Sheet sea público y la URL sea correcta.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem("cdv_cache");
    const savedUrl = localStorage.getItem("cdv_url");
    if (cached && savedUrl) {
      try {
        const { leads, ts } = JSON.parse(cached);
        setAllLeads(leads);
        setLastUpdate(new Date(ts));
        setConnected(true);
      } catch {}
    }
  }, []);

  // auto refresh 1h
  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => {
      const savedUrl = localStorage.getItem("cdv_url");
      if (savedUrl) fetchData(savedUrl);
    }, 3600000);
    return () => clearInterval(iv);
  }, [connected, fetchData]);

  const disconnect = () => {
    localStorage.removeItem("cdv_url");
    localStorage.removeItem("cdv_cache");
    setConnected(false);
    setAllLeads([]);
    setSelectedAd(null);
    setUrl("");
    setError("");
  };

  // ── filtered leads ──
  const filteredLeads = useMemo(() => {
    return allLeads.filter(l => {
      if (dateFrom) {
        const from = new Date(dateFrom + "T00:00:00");
        if (!l.submittedAt || l.submittedAt < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo + "T23:59:59");
        if (!l.submittedAt || l.submittedAt > to) return false;
      }
      if (filterVendedores !== "Todos" && l.vendedores !== filterVendedores) return false;
      if (filterAgendo === "Sí" && !l.agendo) return false;
      if (filterAgendo === "No" && l.agendo) return false;
      if (filterTier !== "Todos" && l.tier !== filterTier) return false;
      return true;
    });
  }, [allLeads, dateFrom, dateTo, filterVendedores, filterAgendo, filterTier]);

  // ── global stats ──
  const globalStats = useMemo(() => {
    const total = filteredLeads.length;
    const bb = filteredLeads.filter(l => l.calificacion === "BUENA BALA").length;
    const safa = filteredLeads.filter(l => l.calificacion === "SAFA").length;
    const calificados = filteredLeads.filter(l =>
      l.calificacion === "BUENA BALA" || l.calificacion === "SAFA" || (!l.calificacion && isCalificado(l))
    ).length;
    const agendo = filteredLeads.filter(l => l.agendo).length;
    const grouped = groupByAd(filteredLeads);
    const uniqueAds = Object.keys(grouped).length;
    return { total, bb, safa, calificados, agendo, uniqueAds };
  }, [filteredLeads]);

  // ── ad ranking ──
  const adRanking = useMemo(() => {
    const grouped = groupByAd(filteredLeads);
    const stats = Object.entries(grouped).map(([name, leads]) => buildAdStats(name, leads));
    stats.sort((a, b) => {
      if (sortBy === "qscore") return b.qscore - a.qscore;
      if (sortBy === "bb") return b.bb - a.bb || b.qscore - a.qscore;
      if (sortBy === "calificados") return b.calificados - a.calificados || b.qscore - a.qscore;
      if (sortBy === "pct_cal") {
        const pa = a.total ? a.calificados / a.total : 0;
        const pb = b.total ? b.calificados / b.total : 0;
        return pb - pa || b.qscore - a.qscore;
      }
      if (sortBy === "total") return b.total - a.total;
      return 0;
    });
    return stats;
  }, [filteredLeads, sortBy]);

  const pct = (n, total) => total ? Math.round(n / total * 100) : 0;

  if (!connected) {
    return (
      <>
        <style>{CSS}</style>
        <div className="connect-screen">
          <div className="connect-grid" />
          <div className="connect-box">
            <div className="connect-logo">
              <div className="connect-logo-icon">📊</div>
              <span>CDV · Ad Quality Tracker</span>
            </div>
            <h1 className="connect-title">Rankeá tus <em>anuncios</em><br />por calidad de lead.</h1>
            <p className="connect-sub">
              Pegá la URL pública de tu Google Sheet. La app la transforma al formato correcto, parsea los leads y te muestra qué anuncio trae las ballenas.
            </p>
            <label className="connect-label">URL del Google Sheet o CSV</label>
            <input
              className="connect-input"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && url && fetchData(url)}
            />
            {error && <div className="error-box">{error}</div>}
            <button className="btn-primary" disabled={!url || loading} onClick={() => fetchData(url)}>
              {loading ? "Conectando..." : "Conectar y cargar datos →"}
            </button>
            <p className="connect-note">
              El Sheet debe estar configurado como público ("Cualquiera con el link puede ver").<br />
              La URL se guarda en tu navegador.
            </p>
          </div>
        </div>
      </>
    );
  }

  const selectedAdStats = selectedAd
    ? buildAdStats(selectedAd, (groupByAd(filteredLeads)[selectedAd] || []))
    : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <span style={{ fontSize: 18 }}>📊</span>
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>CDV Ad Quality Tracker</span>
            <span className="header-badge">v1.0</span>
          </div>
          <div className="header-right">
            {lastUpdate && (
              <span className="last-update">
                Actualizado: {lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button className="btn-sm" onClick={() => fetchData(localStorage.getItem("cdv_url"))} disabled={loading}>
              {loading ? "↻ Cargando..." : "↻ Refrescar"}
            </button>
            <button className="btn-sm danger" onClick={disconnect}>Desconectar</button>
          </div>
        </header>

        {error && <div style={{ padding: "0 1.5rem", marginTop: "1rem" }}><div className="error-box">{error}</div></div>}

        <div className="main">
          {/* CONTENT */}
          <div className="content">
            {loading && allLeads.length === 0 ? (
              <div className="loading">
                <div className="spinner" />
                <span className="loading-text">Cargando datos del Sheet...</span>
              </div>
            ) : (
              <>
                {/* GLOBAL STATS */}
                <div className="stats-grid">
                  <div className="stat-card" style={{ "--accent": "var(--violet)" }}>
                    <div className="label">Total leads</div>
                    <div className="value">{globalStats.total.toLocaleString()}</div>
                    <div className="sub">{globalStats.uniqueAds} anuncios únicos</div>
                  </div>
                  <div className="stat-card" style={{ "--accent": "var(--green)" }}>
                    <div className="label">Calificados</div>
                    <div className="value" style={{ color: "var(--green)" }}>{globalStats.calificados}</div>
                    <div className="sub">{pct(globalStats.calificados, globalStats.total)}% del total</div>
                  </div>
                  <div className="stat-card" style={{ "--accent": "var(--violet-light)" }}>
                    <div className="label">BUENA BALA</div>
                    <div className="value" style={{ color: "var(--violet-light)" }}>{globalStats.bb}</div>
                    <div className="sub">{pct(globalStats.bb, globalStats.total)}% del total</div>
                  </div>
                  <div className="stat-card" style={{ "--accent": "var(--cyan)" }}>
                    <div className="label">SAFA</div>
                    <div className="value" style={{ color: "var(--cyan)" }}>{globalStats.safa}</div>
                  </div>
                  <div className="stat-card" style={{ "--accent": "var(--amber)" }}>
                    <div className="label">Agendaron</div>
                    <div className="value" style={{ color: "var(--amber)" }}>{globalStats.agendo}</div>
                    <div className="sub">{pct(globalStats.agendo, globalStats.total)}% del total</div>
                  </div>
                </div>

                {/* FILTERS */}
                <div className="filters-bar">
                  <div className="filter-group">
                    <span className="filter-label">Desde</span>
                    <input className="filter-input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  </div>
                  <div className="filter-group">
                    <span className="filter-label">Hasta</span>
                    <input className="filter-input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  </div>
                  <div className="filter-group">
                    <span className="filter-label">Vendedores</span>
                    <select className="filter-select" value={filterVendedores} onChange={e => setFilterVendedores(e.target.value)}>
                      {VENDEDORES_OPTIONS.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <span className="filter-label">Agendó</span>
                    <select className="filter-select" value={filterAgendo} onChange={e => setFilterAgendo(e.target.value)} style={{ minWidth: 90 }}>
                      <option>Todos</option><option>Sí</option><option>No</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <span className="filter-label">Tier</span>
                    <select className="filter-select" value={filterTier} onChange={e => setFilterTier(e.target.value)}>
                      {TIER_OPTIONS.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="filter-actions">
                    <div className="filter-group">
                      <span className="filter-label">Ordenar por</span>
                      <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <button className="btn-sm" onClick={() => {
                      setDateFrom(""); setDateTo(""); setFilterVendedores("Todos");
                      setFilterAgendo("Todos"); setFilterTier("Todos"); setSortBy("qscore");
                    }}>✕ Limpiar</button>
                  </div>
                </div>

                {/* RANKING */}
                <div className="ranking-header">
                  <span className="ranking-title">Ranking de anuncios</span>
                  <span className="ranking-count">{adRanking.length} anuncios · {filteredLeads.length} leads</span>
                </div>

                {adRanking.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">🔍</div>
                    <p>No hay datos con los filtros actuales.</p>
                  </div>
                ) : (
                  <div className="ad-list">
                    {adRanking.map((ad, i) => {
                      const rankClass = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "";
                      const pctCal = pct(ad.calificados, ad.total);
                      const pctBB = pct(ad.bb, ad.total);
                      return (
                        <div
                          key={ad.name}
                          className={`ad-card${selectedAd === ad.name ? " active" : ""}`}
                          onClick={() => setSelectedAd(selectedAd === ad.name ? null : ad.name)}
                        >
                          <div className={`ad-rank ${rankClass}`}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                          </div>
                          <div className="ad-body">
                            <div className="ad-name">{ad.name}</div>
                            <div className="ad-metrics">
                              <span className="metric-pill">{ad.total} leads</span>
                              {ad.bb > 0 && (
                                <span className="metric-pill bb">⭐ {ad.bb} BB ({pctBB}%)</span>
                              )}
                              {ad.safa > 0 && (
                                <span className="metric-pill safa">◈ {ad.safa} SAFA</span>
                              )}
                              {ad.calificados > 0 && (
                                <span className="metric-pill calificado">✓ {pctCal}% cal.</span>
                              )}
                              {(ad.mega + ad.whale) > 0 && (
                                <span className="metric-pill whale">
                                  {ad.mega > 0 ? `🏆×${ad.mega} ` : ""}{ad.whale > 0 ? `🐋×${ad.whale}` : ""}
                                </span>
                              )}
                              <div className="qscore-badge">Q {ad.qscore}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* SIDE PANEL */}
          {selectedAd && selectedAdStats && (
            <div className="side-panel">
              <div className="panel-header">
                <button className="panel-close" onClick={() => setSelectedAd(null)}>✕</button>
                <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Detalle de anuncio
                </div>
                <div className="panel-ad-name">{selectedAd}</div>
              </div>

              <div className="panel-mini-stats">
                <div className="mini-stat">
                  <div className="v">{selectedAdStats.total}</div>
                  <div className="l">Leads</div>
                </div>
                <div className="mini-stat">
                  <div className="v" style={{ color: "var(--violet-light)" }}>{selectedAdStats.bb}</div>
                  <div className="l">BB</div>
                </div>
                <div className="mini-stat">
                  <div className="v" style={{ color: "var(--green)" }}>{selectedAdStats.calificados}</div>
                  <div className="l">Calificados</div>
                </div>
              </div>

              {/* Composition bar */}
              <div className="comp-bar-section">
                <div className="comp-bar-label">Composición por tier</div>
                <div className="comp-bar">
                  {selectedAdStats.mega > 0 && (
                    <div className="comp-bar-seg" style={{ width: pct(selectedAdStats.mega, selectedAdStats.total) + "%", background: "var(--gold)" }} />
                  )}
                  {selectedAdStats.whale > 0 && (
                    <div className="comp-bar-seg" style={{ width: pct(selectedAdStats.whale, selectedAdStats.total) + "%", background: "var(--whale)" }} />
                  )}
                  {selectedAdStats.fat > 0 && (
                    <div className="comp-bar-seg" style={{ width: pct(selectedAdStats.fat, selectedAdStats.total) + "%", background: "var(--fat)" }} />
                  )}
                  {selectedAdStats.small > 0 && (
                    <div className="comp-bar-seg" style={{ width: pct(selectedAdStats.small, selectedAdStats.total) + "%", background: "var(--small)" }} />
                  )}
                </div>
                <div className="comp-legend">
                  {selectedAdStats.mega > 0 && <div className="comp-legend-item"><div className="comp-dot" style={{ background: "var(--gold)" }} />🏆 {selectedAdStats.mega}</div>}
                  {selectedAdStats.whale > 0 && <div className="comp-legend-item"><div className="comp-dot" style={{ background: "var(--whale)" }} />🐋 {selectedAdStats.whale}</div>}
                  {selectedAdStats.fat > 0 && <div className="comp-legend-item"><div className="comp-dot" style={{ background: "var(--fat)" }} />🐠 {selectedAdStats.fat}</div>}
                  {selectedAdStats.small > 0 && <div className="comp-legend-item"><div className="comp-dot" style={{ background: "var(--small)" }} />🐟 {selectedAdStats.small}</div>}
                </div>
              </div>

              {/* Lead list */}
              <div className="leads-list">
                <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                  {selectedAdStats.leads.length} leads
                </div>
                {[...selectedAdStats.leads]
                  .sort((a, b) => {
                    const score = (l) =>
                      l.calificacion === "BUENA BALA" ? 3 :
                      l.calificacion === "SAFA" ? 2 :
                      isCalificado(l) ? 1 : 0;
                    return score(b) - score(a);
                  })
                  .map(lead => (
                    <div key={lead.id} className={`lead-card${lead.calificacion === "BUENA BALA" ? " bb-lead" : ""}`}>
                      <div className="lead-name">{lead.nombre}</div>
                      <div className="lead-meta">{lead.email} · {lead.telefono}</div>
                      <div className="lead-badges">
                        {lead.calificacion === "BUENA BALA" && <span className="badge badge-bb">⭐ Buena Bala</span>}
                        {lead.calificacion === "SAFA" && <span className="badge badge-safa">SAFA</span>}
                        {lead.tier === "MEGA BALLENA" && <span className="badge badge-mega">🏆 Mega Ballena</span>}
                        {lead.tier === "BALLENA" && <span className="badge badge-whale">🐋 Ballena</span>}
                        {lead.tier === "PEZ GORDO" && <span className="badge badge-fat">🐠 Pez Gordo</span>}
                        {lead.tier === "PEZ CHICO" && <span className="badge badge-small">🐟 Pez Chico</span>}
                        {lead.agendo && <span className="badge badge-agendo">✓ Agendó</span>}
                      </div>
                      <div className="lead-detail">
                        {lead.facturacion && <div>💰 {lead.facturacion}</div>}
                        {lead.vendedores && <div>👥 {lead.vendedores}</div>}
                        {lead.industria && <div>🏢 {lead.industria}</div>}
                        {lead.submittedAt && (
                          <div>📅 {lead.submittedAt.toLocaleDateString("es-AR")}</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
