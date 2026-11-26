/* Andrea Mayo — portfolio. Vanilla JS port of the Claude Design prototype. */
'use strict';

/* ================= CONFIG — edit these ================= */
const CONFIG = {
  email: 'andrea_mayo@mba.berkeley.edu',
  linkedin: 'https://www.linkedin.com/in/amayouriol',
  github: 'https://github.com/amayouriol',
  substack: 'https://substack.com/@amayo286',
  photo: 'assets/andrea.jpg' // TODO: drop Andrea's photo here (3:4 works best)
};

/* ================= helpers ================= */
const UNITLESS = new Set(['opacity', 'zIndex', 'flex', 'lineHeight', 'fontWeight']);
const st = (o) => Object.entries(o).map(([k, v]) =>
  k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ':' + (typeof v === 'number' && !UNITLESS.has(k) ? v + 'px' : v)).join(';');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };

function layer(seed, n, size, dur, op, blue) {
  const r = rnd(seed), g = [], T = 400;
  for (let i = 0; i < n; i++) {
    const b = blue && r() > 0.6;
    const c = b ? 'rgba(101,185,208,' + (0.6 + r() * 0.4) + ')' : 'rgba(231,232,228,' + (0.45 + r() * 0.55) + ')';
    g.push('radial-gradient(' + size + 'px ' + size + 'px at ' + Math.floor(r() * T) + 'px ' + Math.floor(r() * T) + 'px,' + c + ' 0,' + c + ' 45%,transparent 100%)');
  }
  return { position: 'absolute', top: 0, left: 0, width: 'calc(100% + 400px)', height: 'calc(100% + 400px)', backgroundImage: g.join(','), backgroundSize: T + 'px ' + T + 'px', animation: 'drift ' + dur + 's linear infinite', opacity: op, pointerEvents: 'none' };
}
const SF = {
  A: st(layer(11, 28, 1.6, 240, 0.8, false)),
  B: st(layer(23, 12, 2.2, 160, 0.95, true)),
  C: st(layer(37, 5, 3, 100, 1, true)),
  C2: st({ ...layer(51, 18, 1.8, 260, 0.6, true), height: '100%', width: '100%' }),
  D: st(layer(71, 60, 1.2, 320, 0.55, false)),   // dense, tiny, far away
  E: st(layer(83, 9, 3.4, 70, 1, true))          // few, bright, close
};
/* depth: each layer shifts a different number of px with the pointer (far = small, near = large) */
const PLX = { D: 4, A: 8, B: 16, C: 28, E: 44 };
const starsPlx = (...k) => k.map((x) => `<div class="plx" data-depth="${PLX[x]}" style="position:absolute;inset:0;transition:transform .7s cubic-bezier(.2,.7,.2,1)"><div style="${SF[x]}"></div></div>`).join('');
const stars = (...k) => k.map((x) => `<div style="${SF[x]}"></div>`).join('');

function bits(seed) {
  const r = rnd(seed), T = ['dial', 'btn', 'vent', 'switch', 'screen', 'dial', 'btn', 'btn', 'vent', 'screen', 'switch', 'dial', 'btn', 'vent', 'dial'];
  const C = ['#E39B36', '#65B9D0', '#C7594F', '#7FAF7B', '#E8C943'];
  return T.map((k) => {
    const c = C[Math.floor(r() * C.length)];
    const box = { height: 54, display: 'grid', placeItems: 'center', background: '#171a19', border: '1px solid #2f3533', borderRadius: 3, boxShadow: 'inset 0 0 8px #000,0 1px 0 rgba(255,255,255,.05)', overflow: 'hidden' };
    let inner = {};
    if (k === 'dial') inner = { display: 'block', width: 42, height: 42, borderRadius: '50%', background: 'radial-gradient(circle,#0b0d0d 0 9px,#2a2f2d 10px 12px,transparent 13px),conic-gradient(from -135deg,' + c + ' 0 ' + Math.floor(20 + r() * 50) + '%,#2a2f2d 0 75%,transparent 0)', boxShadow: '0 0 0 2px #050606' };
    if (k === 'btn') inner = { display: 'block', width: 26, height: 26, borderRadius: 4, background: c, boxShadow: '0 0 10px ' + c + ',inset 0 -4px 0 rgba(0,0,0,.35)', opacity: 0.9 };
    if (k === 'vent') inner = { display: 'block', width: '100%', height: '100%', background: 'repeating-linear-gradient(0deg,#050606 0 3px,#2f3533 3px 6px)' };
    if (k === 'switch') inner = { display: 'block', width: 30, height: 12, background: '#050606', border: '1px solid #4a504d', borderRadius: 2, boxShadow: 'inset ' + (r() > 0.5 ? '12px' : '-12px') + ' 0 0 -4px #aab0ab' };
    if (k === 'screen') inner = { display: 'block', width: '84%', height: '70%', background: 'repeating-linear-gradient(0deg,rgba(127,175,123,.7) 0 2px,transparent 2px 6px),#031013', border: '2px solid #050606', boxShadow: '0 0 0 1px #3a403e' };
    return { box: st(box), inner: st(inner) };
  });
}

/* ================= content ================= */
const DEST = [
  { n: '01', t: 'Her Story', s: 'The path from finance to product and strategy.', id: 'story', code: 'RT-01', say: 'Origin coordinates loaded. Curiosity levels: unusually high.' },
  { n: '02', t: 'How She Works', s: 'Problems, decisions, and measurable outcomes.', id: 'projects', code: 'RT-02', say: 'Project coordinates locked. This is the good stuff.', pick: 'Finally, someone who knows how to navigate.' },
  { n: '03', t: 'Experience', s: 'Roles, achievements, and education.', id: 'experience', code: 'RT-03', say: 'Career archive open. It is... impressively organized.' },
  { n: '04', t: 'Portfolio', s: 'Prototypes and experiments built with AI.', id: 'portfolio', code: 'RT-04', say: 'Workbench online. Some of these even work on the first try.' },
  { n: '05', t: 'Contact', s: 'Start a conversation.', id: 'contact', code: 'RT-05', say: 'Communications online. Try not to overthink the subject line.' }
];

const CHAPTERS = [
  { n: '01', k: 'Curiosity', g: 'ask', t: 'Curiosity', p: 'As a kid she never stopped asking “why?” Economics gave her a way to chase the answers, and in every role since she has questioned how things are done, then helped make them better.', l: 'Ask before assuming' },
  { n: '02', k: 'Adaptability', g: 'adapt', t: 'Adaptability', p: 'Growing up on the move made change feel normal. Being the oldest sibling made order a habit. Together, they make her the person who brings structure to messy, shifting situations.', l: 'Adapt fast, keep order' },
  { n: '03', k: 'Connecting the dots', g: 'connect', t: 'Connecting the dots', p: 'EY taught teamwork, BBVA client obsession, BCP how to build from what a business really needs. Her best work happens between customer needs, business goals and what technology makes possible.', l: 'Build for the people who use it' },
  { n: '04', k: 'Why Berkeley', g: 'why', t: 'Why Berkeley, why now', p: 'She came to Haas to learn how products are built from the inside and to add a strategic mindset. Looking for 2027 internships.', l: 'Move from insight to action' }
];

const PROJECTS = [
  { thumb: 'cashflow', title: 'Cash Flow Module for Credit Analysis', summary: 'Raised the need in user research, then owned a new cash flow module end to end.',
    metrics: [{ v: '10h → 3h', t: 'analysis time per case' }, { v: '~2,500', t: 'people used the module' }, { v: '50%', t: 'of the loan book covered' }],
    tags: ['Discovery', '0-to-1 delivery', 'Adoption'],
    secs: [['Discovery', 'The need surfaced in user research with the analysts who built cash flow analyses by hand.'], ['Her role', 'Owned the module end to end with a team of 4 over roughly 10 months.'], ['Approach', 'Roadmap: test an MVP, iterate, launch, then v2. She defined v2.'], ['Adoption', '240 people trained directly through 15 champions.'], ['Impact', 'Analysis time fell from 10 hours to 3 per case; ~2,500 people used the module.']] },
  { thumb: 'agents', title: 'AI-Assisted Credit Reports', summary: 'As product owner, defined what 4 AI agents delivered and proved it in a controlled pilot.',
    metrics: [{ v: '15 → 5 days', t: 'client response time' }, { v: '10 + 10', t: 'test and control officers' }, { v: '10+', t: 'test rounds with engineers' }],
    tags: ['AI product', 'Experiment design', 'Engineering'],
    secs: [['Her role', 'Product owner. Led 5 engineers through 10+ test rounds.'], ['Solution', '4 AI agents: 3 gathering inputs and 1 drafting the report.'], ['Experiment', '3-month controlled pilot with 20 officers, randomized within teams (10 test, 10 control).'], ['Decision', 'Recommended an express path for 30% of the year’s cases; management made the call.'], ['Impact', 'Client response time fell by two-thirds, from 15 days to 5.']] },
  { thumb: 'dash', title: 'Reporting Dashboard', summary: 'Traced a 60-day reporting cycle to teams trusting their own spreadsheets over the source system, then led 7 people to retire them.',
    metrics: [{ v: '60 → 5 days', t: 'reporting cycle' }, { v: '80+', t: 'users across 12 credit teams' }, { v: '94', t: 'internal NPS among users' }],
    tags: ['Data product', 'Adoption', 'Leadership'],
    secs: [['Problem', 'Reporting took 60 days because teams trusted their own spreadsheets over the source system.'], ['Her role', 'Led a 7-person team over 6–8 months. Set the project’s success metrics (reporting time, zero data complaints) and locked closed records.'], ['Impact', 'Monthly performance report in 5 days instead of 60; 80+ users from analysts to Deputy Managers.'], ['Recognition', 'Division award.']] },
  { thumb: 'engine', title: 'Self-Service Decision Engine', summary: 'Found most invoice financing requests were approved anyway, then built rules letting sales disburse smaller deals on their own.',
    metrics: [{ v: '85%', t: 'of requests historically approved' }, { v: '80%', t: 'of requests under the $40K threshold' }, { v: '2.8%', t: 'defaults vs a 3.5% target' }],
    tags: ['Decision systems', '0-to-1 delivery', 'Risk'],
    secs: [['Discovery', 'Analyzed 12 months of data; in a 352-request sample over 6 months, 85% were approved anyway.'], ['Solution', 'Rules built on 7 variables let sales disburse requests under $40K without credit review.'], ['Approach', 'Proposed as a one-year trial to keep risk visible.'], ['Impact', 'Processing time halved; defaults stayed at 2.8% against a 3.5% target.']] }
];

const JOBS = [
  { logo: 'bcp', org: 'BCP · 2025–2026', role: 'Deputy Manager, Credit Risk', sum: 'Led product-style initiatives inside credit: AI-assisted reporting, a cash flow module, and portfolio strategy.', items: ['Product owner for an AI-assisted credit report pilot, speeding up how the bank responds to clients.', 'Advised senior committees and built the planning and scoring systems that match accounts to the right analysts.'] },
  { logo: 'bcp', org: 'BCP · 2023–2025', role: 'Assistant Manager, Credit Risk', sum: 'Made credit tools people actually use, and wrote lending criteria for new kinds of businesses.', items: ['Led a team to replace slow, spreadsheet-based reporting with a dashboard people trust.', 'Redesigned the CRM with UX and IT, and wrote lending criteria for digital companies with no credit history.'] },
  { logo: 'bcp', org: 'BCP · 2021–2023', role: 'Deputy Assistant Manager', sum: 'Learned to turn data into rules that let the business move faster.', items: ['Built a self-service decision engine for invoice financing.', 'Designed and taught an analysis course for credit analysts.'] },
  { logo: 'bcp', org: 'BCP · 2020–2021', role: 'Analyst', sum: 'Started in credit analysis and quickly learned how companies make financial decisions.', items: ['Named best analyst of the semester within months of starting.'] },
  { logo: 'bbva', org: 'BBVA · 2020', role: 'Business Analyst', sum: 'Supported wholesale banking decisions through analysis and a close view of client needs.', items: ['Structured emergency loans for clients by modeling cash flows live on client calls.'] },
  { logo: 'ey', org: 'EY · 2018–2020', role: 'Transfer Pricing', sum: 'Learned to structure ambiguous questions, analyze businesses, and communicate rigorous conclusions.', items: ['Built transfer pricing documentation for some of Peru’s largest economic groups and multinationals.'] }
];
const CAPS = ['Problem framing', 'Analytical thinking', 'Cross-functional leadership', 'Execution', 'Building with AI', 'Executive communication'];
const EDU = [
  { logo: 'haas', school: 'UC Berkeley — Haas School of Business', a: 'MBA Candidate', b: 'Class of 2028' },
  { logo: 'esan', school: 'Universidad ESAN', a: 'Economics and International Business', b: 'Undergraduate degree' },
  { logo: 'emstrasbourg', school: 'EM Strasbourg Business School', a: 'European Management', b: 'International academic exchange' }
];
const SLOTS = [
  { thumb: 'crm', n: 'PROJECT 01', t: 'Women in Finance: one portal for the whole mentorship cycle', d: [
    ['The problem', 'A 12-person nonprofit ran its mentorship applications out of one shared spreadsheet. Coordinators blocked each other, comments broke the rows, and picking mentees took 20+ days.'],
    ['What she built', 'She scoped and shipped a team portal that runs the cycle end to end: applicant profiles with AI summaries, reviews and interviews done in parallel, automatic reviewer assignment, mentor matching, and the event calendar, task board and director dashboard around it.'],
    ['The impact', 'Mentee selection fell from 20+ days to about 10, and the whole team now works in one system instead of one spreadsheet.']
  ], tags: ['0-to-1 product', 'Prioritization', 'Workflow automation', 'Claude Code', 'Codex', 'Vercel'], href: 'wif-mentorship-crm.html', cta: 'View demo' },
  { thumb: 'lyrics', n: 'PROJECT 02', t: 'Fill the Lyrics: a YouTube lyrics game', d: 'A game that plays a song from YouTube and blanks out words in its synced lyrics for the player to fill in by typing or by voice. Built through weekly build-test-fix cycles: she tuned difficulty (one blank per two lines up to 3–4 per line), cut repeated words, and added scoring and language filters.', tags: ['YouTube', 'Lyrics sync', 'Voice input', 'Game design', 'Vercel'], href: 'https://lyrics-game-two.vercel.app/' },
  { thumb: 'ledger', n: 'PROJECT 03 · IN PROGRESS', t: 'Buddi: personal and shared money, in one ledger', d: 'A phone-first app for tracking personal spending and money shared with friends, who stay names in the ledger and never need an account. She wrote the MVP spec: one-tap phone sign-in, a split-bill flow that gets the accounting right (repayments never count as income or spending), and AI that drafts entries from voice, text or receipt photos but never saves without her review.', tags: ['PWA', 'Supabase', 'PostgreSQL + RLS', 'Gemini', 'Product spec'], href: 'https://github.com/amayouriol/buddi-finance', cta: 'View on GitHub' }
];
const ORBIT = [{ label: 'Business', a: -125, r: 50 }, { label: 'Technology', a: -25, r: 34 }, { label: 'People', a: 60, r: 50 }, { label: 'Data', a: 155, r: 34 }];

const droidIcon = '<span aria-hidden="true" style="position:relative;display:inline-block;flex:0 0 auto;width:26px;height:30px;vertical-align:middle;margin-right:8px"><i style="position:absolute;left:12px;top:0;width:1px;height:4px;background:#8a8f8b"></i><i style="position:absolute;left:3px;top:3px;width:20px;height:10px;border-radius:20px 20px 0 0;background:linear-gradient(135deg,#b4b8b3,#6f7570)"></i><i style="position:absolute;left:10px;top:5px;width:6px;height:6px;border-radius:50%;background:#65B9D0;box-shadow:0 0 6px #65B9D0"></i><i style="position:absolute;left:4px;top:13px;width:18px;height:13px;border-radius:2px 2px 4px 4px;background:linear-gradient(90deg,#8f948f,#aeb2ad 40%,#5b6260)"></i><i style="position:absolute;left:6px;top:15px;width:14px;height:2px;background:#65B9D0"></i><i style="position:absolute;left:0;top:13px;width:4px;height:15px;border-radius:2px;background:#4a504d"></i><i style="position:absolute;left:22px;top:13px;width:4px;height:15px;border-radius:2px;background:#4a504d"></i></span>';

/* ================= visuals: icons, logo badges, project thumbnails ================= */
const ICONS = {
  email: '<path d="M3 6.5h18v11H3z M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>',
  linkedin: '<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  github: '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.202-.01-.862-.016-1.69-3.338.726-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  substack: '<path fill="currentColor" d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>'
};
const icon = (k, size = 16) => `<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="${size}" height="${size}">${ICONS[k]}</svg>`;

/* Logo badges. Drop a real logo at assets/logos/<key>.png (or .svg) and it replaces the monogram automatically. */
const LOGOS = {
  bcp: { mono: 'BCP', bg: '#00337f', fg: '#ffffff' },
  bbva: { mono: 'BBVA', bg: '#001491', fg: '#ffffff' },
  ey: { mono: 'EY', bg: '#2e2e38', fg: '#E8C943' },
  haas: { mono: 'HAAS', bg: '#14284b', fg: '#FDB515' },
  esan: { mono: 'ESAN', bg: '#cf1111', fg: '#ffffff' },
  emstrasbourg: { mono: 'EM', bg: '#ffffff', fg: '#e53935', light: true }
};
function logoBadge(key, size = 40, round = true) {
  const l = LOGOS[key]; if (!l) return '';
  const fs = Math.round(size * (l.mono.length > 3 ? 0.22 : 0.28));
  return `<span class="logo" role="img" aria-label="${esc(l.mono)} logo" style="width:${size}px;height:${size}px;border-radius:${round ? '50%' : '6px'};background:${l.bg};color:${l.fg};font-size:${fs}px${l.light ? ';box-shadow:inset 0 0 0 1px rgba(22,25,24,.2)' : ''}"><b>${esc(l.mono)}</b><img src="assets/logos/${key}.png" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

/* Holographic "screens" in the spirit of the ship computers and the hologram call: blue line-art
   projections with scanlines and small looping animations, so each thumbnail plays like a tiny video.
   Conceptual only (no real data or client screens). Motion classes (hd, hg, hgx, hf, hfill, hseq, hp,
   heq, hrow, hpop) live in styles.css and are disabled under prefers-reduced-motion. */
const HOLO_LABEL = { cashflow: 'Cash flow', agents: 'Agent feed', dash: 'Live dashboard', engine: 'Decision rules', crm: 'Mentee pipeline', lyrics: 'Fill the lyrics', ledger: 'Buddi app' };
function thumb(kind) {
  const C = '#65B9D0', B = '#bfeaf5', A = '#E8C943', D = 'rgba(101,185,208,.42)', W = 'rgba(101,185,208,.2)', GN = '#7FAF7B', RD = '#C7594F';
  const x = (o) => `${o.cls ? ` class="${o.cls}"` : ''}${o.d != null ? ` style="--d:${o.d}s"` : ''}${o.cls && o.cls.includes('hd') ? ' pathLength="1"' : ''}`;
  const R = (px, py, w, h, o = {}) => `<rect x="${px}" y="${py}" width="${w}" height="${h}" rx="${o.rx ?? 3}" fill="${o.fill || 'none'}" stroke="${o.stroke || C}" stroke-width="${o.sw || 1.3}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${x(o)}/>`;
  const L = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || D}" stroke-width="${o.sw || 1.2}" stroke-linecap="round"${x(o)}/>`;
  const P = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.stroke || C}" stroke-width="${o.sw || 1.4}" stroke-linecap="round" stroke-linejoin="round"${x(o)}/>`;
  const PL = (pts, o = {}) => `<polyline points="${pts}" fill="none" stroke="${o.stroke || C}" stroke-width="${o.sw || 1.4}" stroke-linecap="round" stroke-linejoin="round"${x(o)}/>`;
  const O = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill || 'none'}" stroke="${o.stroke || C}" stroke-width="${o.sw || 1.3}"${x(o)}/>`;
  const T = (tx, ty, s, o = {}) => `<text x="${tx}" y="${ty}" font-size="${o.size || 8}" font-family="'DM Mono',monospace" letter-spacing="${o.ls ?? 1.2}" fill="${o.fill || D}" text-anchor="${o.anchor || 'start'}">${s}</text>`;
  const bar = (px, py, w, h, f = D, o = {}) => R(px, py, w, h, { fill: f, stroke: 'none', rx: h / 2, ...o });
  let g = '';
  if (kind === 'cashflow') {
    const ins = [40, 54, 46, 66, 58, 76, 70], outs = [26, 32, 38, 34, 44, 40, 46];
    g += L(24, 114, 296, 114);
    ins.forEach((v, i) => { const bx = 38 + i * 36; g += R(bx, 114 - v, 11, v, { fill: 'rgba(101,185,208,.22)', cls: 'hg', d: i * 0.12, rx: 1.5 }) + R(bx + 14, 114 - outs[i], 11, outs[i], { stroke: A, fill: 'rgba(232,201,67,.14)', cls: 'hg', d: i * 0.12 + 0.06, rx: 1.5 }); });
    g += PL(ins.map((v, i) => `${50 + i * 36},${114 - (v - outs[i]) * 1.5 - 22}`).join(' '), { stroke: B, sw: 2, cls: 'hd' });
  } else if (kind === 'agents') {
    [50, 84, 118].forEach((y, i) => { g += R(26, y - 13, 76, 26, { rx: 5 }) + O(42, y, 4.5, { fill: C, cls: 'hp', d: i * 0.5 }) + bar(54, y - 3, 34, 6) + P(`M102 ${y} C 138 ${y}, 140 84, 176 84`, { cls: 'hf', d: i * 0.3 }); });
    g += R(176, 54, 62, 60, { stroke: A, sw: 1.6, rx: 5 });
    [42, 34, 42, 24].forEach((w, i) => { g += bar(186, 66 + i * 10, w, 4, A, { cls: 'hfill', d: 0.6 + i * 0.5 }); });
    g += P('M238 84 H 266 M260 77 L268 84 L260 91', { stroke: A, sw: 1.8 }) + O(290, 84, 14, { stroke: B, sw: 1.5 }) + P('M283 84 l5 5 l9 -10', { stroke: B, sw: 2.4, cls: 'hpop' }) + T(207, 128, 'REPORT', { anchor: 'middle' });
  } else if (kind === 'dash') {
    [24, 118, 212].forEach((x0, i) => { g += R(x0, 34, 84, 34, { rx: 4 }) + bar(x0 + 10, 43, 28, 4) + bar(x0 + 10, 53, 60, 8, i === 1 ? A : B, { cls: 'hgx', d: i * 0.25 }); });
    g += R(24, 78, 272, 58, { rx: 4, stroke: D });
    [0, 1, 2].forEach((i) => { g += L(32, 92 + i * 14, 288, 92 + i * 14, { stroke: W, sw: 0.8 }); });
    g += PL('36,124 70,110 104,116 138,98 172,104 206,88 240,94 284,82', { stroke: A, sw: 2.2, cls: 'hd' }) + O(284, 82, 3.5, { fill: A, stroke: 'none', cls: 'hp' });
  } else if (kind === 'engine') {
    g += R(24, 64, 60, 28) + bar(34, 74, 34, 6) + L(84, 78, 116, 78) + P('M116 78 L144 52 L172 78 L144 104 Z', { stroke: A, sw: 1.7, cls: 'hp' }) + O(144, 78, 3.5, { fill: A, stroke: 'none' });
    g += P('M172 78 H 196 V 46 H 226', { cls: 'hf' }) + P('M172 78 H 226', { cls: 'hf', d: 0.2 }) + P('M172 78 H 196 V 110 H 226', { cls: 'hf', d: 0.4 });
    [34, 66, 98].forEach((y, i) => { g += R(226, y, 70, 24, { rx: 4, fill: 'rgba(101,185,208,.12)', cls: 'hseq', d: i * 1.3 }) + bar(238, y + 9, 36, 6, C); });
  } else if (kind === 'crm') {
    /* ~10s loop: click a mentee, an AI summary window opens, pick check (green, row leaves) or X (red, row leaves) */
    g += R(24, 30, 272, 106, { rx: 6, stroke: D }) + bar(36, 40, 60, 6) + O(266, 43, 3.5, { fill: GN, stroke: 'none', cls: 'xdg' }) + O(280, 43, 3.5, { fill: RD, stroke: 'none', cls: 'xdr' });
    g += `<rect class="xhl xhlA" x="28" y="72" width="264" height="20" rx="3" fill="rgba(101,185,208,.2)"/><rect class="xhl xhlB" x="28" y="92" width="264" height="20" rx="3" fill="rgba(101,185,208,.2)"/>`;
    [0, 1, 2, 3].forEach((i) => {
      const y = 62 + i * 20, cls = i === 1 ? 'xrA' : i === 2 ? 'xrB' : '';
      const tint = i === 1 ? `<rect class="xtA" x="28" y="${y - 10}" width="264" height="20" rx="3" fill="${GN}"/>` : i === 2 ? `<rect class="xtB" x="28" y="${y - 10}" width="264" height="20" rx="3" fill="${RD}"/>` : '';
      g += `<g${cls ? ` class="${cls}"` : ''}>${tint}${L(36, y - 10, 284, y - 10, { stroke: W, sw: 0.8 })}${O(46, y, 6, { stroke: [C, A, B, C][i] })}${bar(60, y - 3, 66 + (i % 2) * 22, 6)}${bar(188, y - 3, 34, 6, W)}${R(238, y - 7, 46, 14, { rx: 7, fill: 'rgba(101,185,208,.14)' })}</g>`;
    });
    g += `<g class="xwin">${R(132, 38, 164, 94, { rx: 6, fill: 'rgba(3,14,20,.97)', sw: 1.5 })}${T(144, 52, 'AI SUMMARY', { size: 7, fill: B })}${O(284, 48, 3, { fill: C, stroke: 'none', cls: 'hp' })}${bar(144, 60, 136, 5)}${bar(144, 70, 112, 5)}${bar(144, 80, 124, 5)}${bar(144, 90, 70, 5, A)}`
      + `${R(146, 106, 62, 18, { rx: 9, stroke: GN })}<rect class="xbY" x="146" y="106" width="62" height="18" rx="9" fill="${GN}"/>${P('M170 115 l4 4 l8 -9', { stroke: GN, sw: 2 })}`
      + `${R(222, 106, 62, 18, { rx: 9, stroke: RD })}<rect class="xbN" x="222" y="106" width="62" height="18" rx="9" fill="${RD}"/>${P('M246 111 l10 10 M256 111 l-10 10', { stroke: RD, sw: 2 })}</g>`;
    g += `<g class="xcur"><circle class="xrip" r="9" fill="none" stroke="${B}" stroke-width="1.5"/><path d="M0 0 L0 13 L3.6 9.8 L6.2 15.4 L8.4 14.4 L5.8 8.9 L10.4 8.9 Z" fill="#fff" stroke="#031014" stroke-width="1"/></g>`;
  } else if (kind === 'lyrics') {
    /* ~6s loop: blanks fill in one by one, then a star pops for the point */
    const star = Array.from({ length: 10 }, (_, k) => { const a = (-90 + 36 * k) * Math.PI / 180, r = k % 2 ? 5.2 : 12; return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    g += P('M40 60 V 90 M40 60 q 9 2 10 12', { stroke: B, sw: 1.8 }) + O(35, 92, 5.2, { stroke: B, sw: 1.8 });
    [[44, [44, 26, 36], 1], [66, [30, 50, 22], 2], [88, [56, 22, 38], 1], [110, [36, 42, 28], 0]].forEach(([y, ws, bi], i) => {
      let px = 76;
      ws.forEach((w, j) => { g += j === bi ? R(px, y - 5, w, 12, { stroke: A, dash: '3 2', rx: 2 }) + bar(px + 2, y - 3, w - 4, 8, A, { cls: `xl${i}` }) : bar(px, y - 2, w, 6); px += w + 8; });
    });
    [30, 18, 36, 22, 28].forEach((h, i) => { g += bar(246 + i * 10, 124 - h, 6, h, C, { rx: 1.5, cls: 'heq', d: i * 0.17 }); });
    g += `<g transform="translate(266 54)"><polygon class="xstar" points="${star}" fill="${A}" stroke="${B}" stroke-width="1"/>${[[-21, 0, -16, 0], [21, 0, 16, 0], [0, -20, 0, -15], [15, -15, 11, -11], [-15, -15, -11, -11]].map(([a, b, c, d]) => L(a, b, c, d, { stroke: A, sw: 1.6, cls: 'xspark' })).join('')}</g>`;
  } else if (kind === 'ledger') {
    /* Buddi: three phone screens from the concept (overview, shared bill split, voice capture) lighting up in turn */
    const ph = (x0, d, inner) => `<g class="xph" style="--d:${d}s">${R(x0, 30, 84, 110, { rx: 10, sw: 1.4 })}${bar(x0 + 30, 35, 24, 3, D)}${inner}</g>`;
    g += ph(26, 0, T(35, 52, 'buddi.', { size: 8, fill: B, ls: 0.5 }) + T(35, 63, 'TOTAL BALANCE', { size: 4.6, ls: 0.6 }) + T(35, 79, '$4,286', { size: 15, fill: B, ls: 0 })
      + PL('35,98 50,94 64,96 78,88 92,90 102,84', { stroke: A, sw: 1.8, cls: 'hd' }) + R(34, 104, 36, 20, { rx: 4 }) + bar(39, 109, 18, 3) + bar(39, 116, 10, 3, A) + R(74, 104, 28, 20, { rx: 4 }) + bar(79, 109, 14, 3) + bar(79, 116, 8, 3, GN) + O(48, 132, 2, { fill: C, stroke: 'none' }) + O(68, 132, 2, { fill: D, stroke: 'none' }) + O(88, 132, 2, { fill: D, stroke: 'none' }));
    g += ph(118, 2, T(127, 52, 'SHARED BILL', { size: 5.5, ls: 0.6 }) + T(127, 70, '$96.00', { size: 14, fill: B, ls: 0 })
      + [C, A, B, GN].map((c, i) => O(134 + i * 16, 86, 6, { stroke: c, cls: 'hp', d: i * 0.4 })).join('')
      + [0, 1, 2, 3].map((i) => bar(127, 102 + i * 8, 30, 3) + bar(168, 101 + i * 8, 26, 4, A, { cls: 'hgx', d: i * 0.3 })).join(''));
    g += ph(210, 4, O(252, 58, 12, { stroke: C }) + O(252, 58, 12, { stroke: C, cls: 'hp' }) + R(249, 50, 6, 11, { rx: 3, stroke: B }) + P('M245 58 q 0 8 7 8 q 7 0 7 -8 M252 66 V 70', { stroke: B })
      + R(224, 76, 56, 10, { rx: 5, stroke: GN }) + T(252, 83, 'DRAFT READY', { size: 4.8, anchor: 'middle', fill: GN, ls: 0.4 })
      + bar(219, 92, 66, 6, W) + bar(219, 102, 40, 6, W) + R(219, 116, 66, 16, { rx: 8, fill: 'rgba(101,185,208,.22)' }) + T(226, 126.5, 'CONFIRM', { size: 6, fill: B, ls: 0.8 }) + P('M270 124 l3.5 3.5 l7 -8', { stroke: GN, sw: 2, cls: 'hpop' }));
  }
  return `<div class="holo"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${g}</svg><span class="holo-sweep"></span><span class="holo-tag"><i></i>${HOLO_LABEL[kind] || ''}</span><i class="hc tl"></i><i class="hc tr"></i><i class="hc bl"></i><i class="hc br"></i></div>`;
}

/* small fighter-style ships crossing at three depths (far = tiny, slow, dim; near = larger, faster, bright) */
const SHIP_SVG = {
  tie: '<svg viewBox="0 0 40 24"><path d="M7 1 11 4V20L7 23 3 20V4ZM33 1 37 4V20L33 23 29 20V4Z" fill="#8f948f"/><path d="M11 11H29V13H11Z" fill="#6f7570"/><circle cx="20" cy="12" r="5" fill="#b4b8b3"/><circle cx="20" cy="12" r="2" fill="#65B9D0"/></svg>',
  xw: '<svg viewBox="0 0 40 24"><path d="M13 11 27 3 29 4.5 20 11.5ZM13 13 27 21 29 19.5 20 12.5Z" fill="#8f948f"/><path d="M1 12 14 10.2 36 10.8 39 12 36 13.2 14 13.8Z" fill="#b4b8b3"/><circle cx="28" cy="12" r="1.6" fill="#65B9D0"/><circle cx="3" cy="12" r="1.5" fill="#E39B36"/></svg>',
  fr: '<svg viewBox="0 0 40 24"><ellipse cx="18" cy="12" rx="15" ry="9" fill="#9a9f9a"/><path d="M30 8H39V10H30ZM30 14H39V16H30Z" fill="#6f7570"/><circle cx="14" cy="12" r="3.5" fill="#5b6260"/><rect x="1" y="10" width="3" height="4" fill="#65B9D0"/></svg>'
};
/* Flights cross each other: TIE fighters fly in formation, diagonally down-right; every other
   ship type goes the opposite way (up-left, level, or down-left) at its own angle and speed.
   from/to are [vw, vh] and sit off-screen at both ends; s = scale at start/end (coming nearer or drifting away). */
const FLIGHTS = [
  // far layer: small, slow, dim
  { depth: 8, kind: 'tie', fleet: 3, w: 12, op: 0.5, from: [-6, 3], to: [108, 31], dur: 120, delay: -52, s: [0.8, 1] },
  { depth: 8, kind: 'xw', fleet: 1, w: 15, op: 0.45, from: [62, -6], to: [30, 52], dur: 95, delay: -30, s: [0.9, 1.1] },
  { depth: 8, kind: 'fr', fleet: 1, w: 18, op: 0.45, from: [106, 21], to: [-8, 13], dur: 130, delay: -70, s: [1, 1] },
  // mid layer
  { depth: 22, kind: 'fr', fleet: 1, w: 46, op: 0.85, from: [112, 40], to: [-14, 10], dur: 80, delay: -24, s: [0.8, 1.15] },
  { depth: 22, kind: 'xw', fleet: 2, w: 28, op: 0.85, from: [110, 46], to: [-10, 24], dur: 55, delay: -36, s: [0.9, 1.1] },
  // near layer: the TIE squad
  { depth: 40, kind: 'tie', fleet: 4, w: 34, op: 1, from: [-10, 2], to: [110, 46], dur: 38, delay: -9, s: [0.7, 1.25], glow: true }
];
const FORMATION = { 1: [[0, 0]], 2: [[0, 0], [-1.3, 0.7]], 3: [[0, 0], [-1.2, -0.7], [-1.2, 0.7]], 4: [[0, 0], [-1.2, -0.75], [-1.2, 0.75], [-2.4, 0]] };
function shipsHTML() {
  const W = innerWidth || 1280, H = innerHeight || 800;
  const layers = {};
  FLIGHTS.forEach((f, n) => {
    const ang = Math.atan2((f.to[1] - f.from[1]) * H / 100, (f.to[0] - f.from[0]) * W / 100) * 180 / Math.PI;
    const glow = f.glow ? 'filter:drop-shadow(0 0 6px rgba(101,185,208,.45));' : '';
    const ships = FORMATION[f.fleet].map(([x, y], i) => `<div style="position:absolute;left:${(x * f.w).toFixed(1)}px;top:${(y * f.w * 0.6).toFixed(1)}px;width:${f.w}px;transform:translate(-50%,-50%)"><div class="shipbody" style="opacity:${f.op};${glow}animation-delay:${-((n * 7 + i * 5) % 9) / 3}s">${SHIP_SVG[f.kind]}</div></div>`).join('');
    (layers[f.depth] = layers[f.depth] || []).push(`<div class="flight" style="--x0:${f.from[0]}vw;--y0:${f.from[1]}vh;--x1:${f.to[0]}vw;--y1:${f.to[1]}vh;--s0:${f.s[0]};--s1:${f.s[1]};animation-duration:${f.dur}s;animation-delay:${f.delay}s"><div style="transform:rotate(${ang.toFixed(1)}deg)">${ships}</div></div>`);
  });
  const groups = Object.entries(layers).map(([d, items]) => `<div class="plx" data-depth="${d}" style="position:absolute;inset:0;transition:transform .7s cubic-bezier(.2,.7,.2,1)">${items.join('')}</div>`).join('');
  return `<div data-ships aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden">${groups}</div>`;
}

/* ================= state ================= */
const S = { view: 'home', descended: false, holo: false, dockOpen: true, overDock: false, hot: -1, active: -1, warping: false, away: false };
let autoTimer = null, holoTimer = null, introKey = null, droidTimer = null;
const main = $('#main'), dock = $('#dock'), dockSpacer = $('#dockSpacer'), warp = $('#warp');

/* ================= section shells ================= */
const GRID_BG = 'background-image:linear-gradient(rgba(231,232,228,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(231,232,228,.035) 1px,transparent 1px);background-size:56px 56px';
const H2 = 'margin:0 0 22px;font-family:\'Space Grotesk\',sans-serif;font-weight:600;font-size:clamp(36px,6vw,68px);line-height:.98;letter-spacing:-.04em';

function planetHeader(planetBg, shadow, fade, label) {
  return `<div aria-hidden="true" style="position:relative;overflow:hidden;height:clamp(300px,48vh,480px);margin:0 -24px;background:linear-gradient(#020405 0,#050e17 55%,#08182a 100%)">
${stars('A', 'B')}
<div style="position:absolute;left:50%;top:34%;width:170%;aspect-ratio:1/1;margin-left:-85%;border-radius:50%;background:${planetBg};box-shadow:${shadow}"></div>
<div style="position:absolute;left:-60%;width:220%;top:76%;height:140%;border-radius:50%;background:${fade};filter:blur(22px)"></div>
<div style="position:absolute;left:clamp(20px,4vw,56px);top:28px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.24em;color:#E8C943">ARRIVING — ${label}</div>
</div>`;
}

/* Her Story layout switch: 'route' = short horizontal chapters, 'readme' = compact README panel. */
const STORY = { variant: 'route', orbit: false };
function readmeHTML() {
  const col = (h, items) => `<div><h3>${h}</h3><ul>${items.map((t) => `<li><i></i><span>${t}</span></li>`).join('')}</ul></div>`;
  return `<div class="rd"><div class="rd-head"><span>PERSONAL README · ANDREA MAYO</span><span class="rd-live"><i></i>LIVE</span></div>
<div class="rd-grid">${col('Who she is', ['Peruvian. Asking “why?” since she was little.', 'Economics, then banking at EY, BBVA and BCP.', 'Now at Berkeley Haas, looking for 2027 internships in Product, Strategy &amp; Ops.'])}${col('What she cares about', ['Client obsession.', 'Seeing the direct impact of her work.', 'A culture that questions the status quo.'])}${col('How she works', ['Asks before assuming.', 'Adapts fast, keeps order.', 'Builds for the people who use it.', 'Moves from insight to action.'])}</div></div>`;
}

/* Her Story chapters as a horizontal "mission route":a progress line with four stops above a sideways
   track of cards; the active card lights up. Small holographic glyphs echo the Portfolio screens. */
function routeHTML() {
  const C = '#65B9D0', B = '#bfeaf5', A = '#E8C943';
  const starPts = (cx, cy, ro, ri) => Array.from({ length: 10 }, (_, k) => { const a = (-90 + 36 * k) * Math.PI / 180, r = k % 2 ? ri : ro; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const GLYPH = {
    ask: `<circle cx="32" cy="32" r="24" fill="none" stroke="${C}" stroke-width="1.4" stroke-dasharray="3 5" class="hf"/><path d="M25 26 q0 -9 8 -9 q8 0 8 7 q0 5 -6 8 q-3 2 -3 6" fill="none" stroke="${B}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="46" r="1.8" fill="${A}"/><g class="rorb"><circle cx="32" cy="3" r="3" fill="${A}"/></g>`,
    adapt: `<path d="M6 46 Q32 -2 58 46" fill="none" stroke="${C}" stroke-width="1.4" stroke-dasharray="4 4" class="hf"/>${[[6, 46], [19, 28], [32, 22], [45, 28], [58, 46]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${i === 4 ? A : 'rgba(101,185,208,.25)'}" stroke="${i === 4 ? A : B}" stroke-width="1.4" class="hp" style="--d:${(i * 0.35).toFixed(2)}s"/>`).join('')}`,
    connect: `<g stroke="${C}" stroke-width="1.4" fill="none" stroke-dasharray="4 4" class="hf"><path d="M12 48 L32 12 L52 48 Z"/><path d="M32 12 L32 34 M12 48 L32 34 M52 48 L32 34"/></g>${[[12, 48], [32, 12], [52, 48]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" fill="rgba(101,185,208,.25)" stroke="${B}" stroke-width="1.5" class="hp" style="--d:${(i * 0.4).toFixed(1)}s"/>`).join('')}<circle cx="32" cy="34" r="4.6" fill="${A}" stroke="${A}" stroke-width="1.4" class="hp"/>`,
    why: `<circle cx="32" cy="32" r="26" fill="none" stroke="${C}" stroke-width="1.2" stroke-dasharray="2 6" class="hf"/><polygon points="${starPts(32, 32, 17, 7)}" fill="rgba(232,201,67,.22)" stroke="${A}" stroke-width="1.6" stroke-linejoin="round" class="hp"/>${[[32, 4, 32, 9], [32, 55, 32, 60], [4, 32, 9, 32], [55, 32, 60, 32]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${B}" stroke-width="1.6" stroke-linecap="round"/>`).join('')}`
  };
  const nodes = CHAPTERS.map((c, i) => `<button type="button" class="rnode${i === 0 ? ' on' : ''}" data-go="${i}" aria-label="Go to chapter ${c.n}: ${esc(c.t)}"><b>${c.n}</b><span>${c.k}</span></button>`).join('');
  const cards = CHAPTERS.map((c, i) => `<article class="stop${i === 0 ? ' on' : ''}" aria-label="Chapter ${c.n}: ${esc(c.t)}"><i class="sc"></i>
<div class="stop-top"><span class="stop-no" aria-hidden="true">${c.n}</span><svg class="stop-glyph" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${GLYPH[c.g]}</svg></div>
<div class="stop-kick">Chapter ${c.n} / ${String(CHAPTERS.length).padStart(2, '0')}</div>
<h3>${c.t}</h3>
<p>${c.p}</p>
<span class="stop-tag">${c.l}</span></article>`).join('');
  return `<div class="route" id="route">
<div class="route-bar">${nodes}</div>
<div class="route-ctl"><span class="route-count" aria-live="polite">01 / ${String(CHAPTERS.length).padStart(2, '0')}</span><button type="button" class="rbtn" data-dir="-1" aria-label="Previous chapter">←</button><button type="button" class="rbtn" data-dir="1" aria-label="Next chapter">→</button></div>
<div class="route-track" tabindex="0" role="group" aria-label="Chapters. Scroll sideways or use the arrow keys.">${cards}</div>
</div>`;
}
function wireRoute() {
  const root = $('#route'); if (!root) return;
  const track = $('.route-track', root), stops = $$('.stop', track), nodes = $$('.rnode', root), count = $('.route-count', root), bar = $('.route-bar', root);
  let cur = -1;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
    bar.style.setProperty('--p', p.toFixed(3));
    let i = 0;
    if (max > 0 && track.scrollLeft >= max - 4) i = stops.length - 1;
    else { let best = 1e9; stops.forEach((s, k) => { const d = Math.abs(s.offsetLeft - track.scrollLeft); if (d < best) { best = d; i = k; } }); }
    if (i === cur) return;
    cur = i;
    stops.forEach((s, k) => s.classList.toggle('on', k === i));
    nodes.forEach((n, k) => { n.classList.toggle('on', k === i); n.classList.toggle('done', k < i); });
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(stops.length).padStart(2, '0');
  };
  const go = (i) => { i = Math.max(0, Math.min(stops.length - 1, i)); track.scrollTo({ left: stops[i].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' }); };
  track.addEventListener('scroll', update, { passive: true });
  root.addEventListener('click', (e) => {
    const n = e.target.closest('[data-go]'); if (n) { go(+n.dataset.go); return; }
    const b = e.target.closest('[data-dir]'); if (b) go(cur + +b.dataset.dir);
  });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  const onResize = () => { if (!root.isConnected) { removeEventListener('resize', onResize); return; } update(); };
  addEventListener('resize', onResize);
  update();
}

function storyHTML() {
  const orbit = ORBIT.map((o, i) => {
    const rad = o.a * Math.PI / 180;
    const pos = st({ position: 'absolute', left: (50 + o.r * Math.cos(rad)) + '%', top: (50 + o.r * Math.sin(rad)) + '%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'column' });
    const dot = st({ width: 10, height: 10, borderRadius: '50%', background: i % 2 ? '#E39B36' : '#65B9D0', display: 'block' });
    return `<div style="${pos}"><i style="${dot}"></i><span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;background:#F1F0EA;padding:2px 5px;white-space:nowrap">${o.label}</span></div>`;
  }).join('');
  const chapters = STORY.variant === 'readme' ? readmeHTML() : routeHTML();
  return `<section id="story" aria-label="Her Story" style="background:radial-gradient(ellipse 420px 240px at 10% 700px,rgba(227,155,54,.11),transparent 70%),radial-gradient(ellipse 520px 280px at 90% 1000px,rgba(201,120,58,.10),transparent 70%),radial-gradient(ellipse 360px 220px at 28% 1500px,rgba(227,155,54,.09),transparent 70%),radial-gradient(ellipse 480px 260px at 80% 1900px,rgba(201,120,58,.08),transparent 70%),repeating-linear-gradient(165deg,transparent 0 260px,rgba(201,120,58,.08) 260px 261px,transparent 261px 400px),repeating-linear-gradient(112deg,transparent 0 420px,rgba(201,120,58,.06) 420px 421px,transparent 421px 640px),#F1F0EA;color:#161918;padding:0 24px clamp(40px,6vw,80px)">
${planetHeader('repeating-linear-gradient(172deg,rgba(176,98,40,.16) 0 12px,transparent 12px 54px),radial-gradient(ellipse 80% 30vh at 50% 0,#e6cfa6 0,#d9bd90 28%,#cdb48e 52%,#e3d6bf 80%,#F1F0EA 100%)', '0 -2px 12px rgba(230,150,80,.45),0 -18px 60px rgba(215,125,60,.18)', '#F1F0EA', 'ORIGIN')}
<div style="max-width:1120px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<div style="display:grid;grid-template-columns:${STORY.orbit ? 'repeat(auto-fit,minmax(min(100%,340px),1fr))' : '1fr'};gap:56px;align-items:center">
<div>
<h2 style="${H2.replace('margin:0 0 22px', 'margin:0 0 24px')};max-width:900px">Curious by nature. Organized by habit.</h2>
<p style="margin:0;font-size:clamp(17px,2vw,21px);line-height:1.6;color:#2f3432;max-width:620px">Curious enough to question everything, organized enough to fix it. Andrea went from economics to banking, building the tools and systems teams actually use. Now she is bringing that to Product, Strategy &amp; Ops.</p>
</div>
${STORY.orbit ? `<div>
<div role="img" aria-label="Orbital diagram: Andrea at the center, orbited by Business, Technology, People and Data" style="position:relative;width:100%;max-width:420px;aspect-ratio:1/1;margin:0 auto">
<div style="position:absolute;inset:0;border-radius:50%;border:1px dashed #8d918d;animation:spin 160s linear infinite"></div>
<div style="position:absolute;inset:16%;border-radius:50%;border:1px solid #b9bbb5"></div>
<div style="position:absolute;inset:32%;border-radius:50%;border:1px solid #b9bbb5"></div>
<div style="position:absolute;left:50%;top:50%;width:22%;aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:50%;background:#161918;color:#E8C943;display:grid;place-items:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(14px,2.4vw,20px)">AM</div>
${orbit}
</div>
<p style="margin:28px auto 0;max-width:420px;font-family:'Space Grotesk',sans-serif;font-size:clamp(18px,2.4vw,22px);line-height:1.35;letter-spacing:-.02em;font-weight:500">“The best part of a complex problem is the moment the pieces start to connect.”</p>
</div>` : ''}
</div>
<div style="margin-top:clamp(48px,7vw,84px)">${chapters}</div>
</div>
</section>`;
}

function projectsHTML() {
  const cards = PROJECTS.map((p, i) => {
    const secs = [['Overview', p.summary], ...p.secs].map(([name, body], j) => `<div style="display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 12px;padding:14px 0;border-top:1px solid #242928"><span style="font-family:'DM Mono',monospace;font-size:11px;color:#E39B36;padding-top:3px">${String(j + 1).padStart(2, '0')}</span><div><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin-bottom:4px">${name}</div><div style="font-size:14.5px;line-height:1.55;color:#c4c6c1">${esc(body)}</div></div></div>`).join('');
    const metrics = p.metrics.map((m) => `<div><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:27px;letter-spacing:-.03em;color:#E8C943;line-height:1">${m.v}</div><div style="font-size:12.5px;line-height:1.4;color:#9a9e99;margin-top:6px">${m.t}</div></div>`).join('');
    const tags = p.tags.map((t) => `<span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;border:1px solid #3a403e;color:#c4c6c1;padding:5px 9px">${t}</span>`).join('');
    return `<article style="background:#111516;border:1px solid #242928;position:relative;padding:0 26px 26px">
<div class="thumb" style="margin:0 -26px 24px;height:150px;border-bottom:1px solid #242928">${thumb(p.thumb)}</div>
<i style="position:absolute;left:-1px;top:-1px;width:14px;height:14px;border-left:2px solid #E39B36;border-top:2px solid #E39B36;z-index:1"></i>
<div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;color:#666B68;margin-bottom:16px"><span>CASE ${String(i + 1).padStart(2, '0')}</span><span style="color:#7FAF7B">● ANONYMIZED</span></div>
<h3 style="margin:0 0 10px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(24px,3vw,30px);letter-spacing:-.03em;line-height:1.05">${p.title}</h3>
<p style="margin:0 0 22px;font-size:15.5px;line-height:1.6;color:#b8bbb6">${p.summary}</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:14px;padding:18px 0;border-top:1px solid #242928;border-bottom:1px solid #242928;margin-bottom:18px">${metrics}</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">${tags}</div>
<button type="button" class="casebtn" data-toggle="case" data-open="Open case study" data-close="Close case study" aria-expanded="false" aria-controls="case-${i}"><span class="t">Open case study</span><span class="s" aria-hidden="true">+</span></button>
<div id="case-${i}" hidden style="margin-top:24px">
<div aria-label="Case flow" style="display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:22px"><span style="color:#65B9D0">Problem</span><span style="color:#666B68">→</span><span style="color:#65B9D0">Discovery</span><span style="color:#666B68">→</span><span style="color:#65B9D0">Decision</span><span style="color:#666B68">→</span><span style="color:#65B9D0">Solution</span><span style="color:#666B68">→</span><span style="color:#E8C943">Impact</span></div>
${secs}
<p style="margin:16px 0 0;font-family:'DM Mono',monospace;font-size:11px;line-height:1.6;color:#666B68">No confidential data, client information or internal systems shown. Visuals are simplified and conceptual.</p>
</div>
</article>`;
  }).join('');
  return `<section id="projects" aria-label="How She Works" style="background-color:#080A0B;padding:0 24px clamp(40px,6vw,80px);${GRID_BG}">
${planetHeader('repeating-linear-gradient(176deg,rgba(0,0,0,.28) 0 10px,transparent 10px 40px),radial-gradient(circle,rgba(240,170,70,.95) 0 1.2px,transparent 1.7px) 0 0/38px 26px,radial-gradient(circle,rgba(232,201,67,.75) 0 1px,transparent 1.5px) 17px 11px/53px 31px,radial-gradient(ellipse 80% 30vh at 50% 0,#454a47 0,#2a2e2c 25%,#161918 55%,#0c0e0d 80%,#080A0B 100%)', '0 -2px 12px rgba(227,155,54,.5),0 -16px 60px rgba(227,155,54,.16)', '#080A0B', 'THE FORGE')}
<div style="max-width:1180px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<h2 style="${H2};max-width:780px">How she approaches difficult problems.</h2>
<p style="margin:0 0 56px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#b8bbb6;max-width:640px">The outcomes matter. So does the path to get there: understanding the problem, aligning people, making trade-offs, and learning from what happens next.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,500px),1fr));gap:20px;align-items:start">${cards}</div>
</div>
</section>`;
}

function experienceHTML() {
  const jobs = JOBS.map((j, i) => {
    const current = i === 0;
    return `<li style="position:relative;padding:0 0 38px 64px">
<span class="node${current ? ' open' : ''}">${logoBadge(j.logo, 38)}</span>
<div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.16em;color:#b9701a;margin-bottom:6px">${j.org}</div>
<h3 style="margin:0 0 8px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(21px,3vw,26px);letter-spacing:-.025em;line-height:1.15">${j.role}</h3>
<p style="margin:0;font-size:16px;line-height:1.6;color:#2f3432">${j.sum}</p>
<ul style="margin:14px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px">${j.items.map((it) => `<li style="display:grid;grid-template-columns:14px 1fr;font-size:15.5px;line-height:1.55;color:#2f3432"><i style="width:6px;height:6px;background:#E39B36;margin-top:8px"></i><span>${it}</span></li>`).join('')}</ul>
</li>`;
  }).join('');
  const caps = CAPS.map((c, i) => `<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.06em;margin-bottom:7px"><span>${c}</span><span class="pct" style="--i:${i};color:#E39B36">100%</span></div><div style="position:relative;height:10px;background:#242928"><div class="skbar" style="--i:${i};position:absolute;left:0;top:0;bottom:0;background:#E39B36"></div><div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 12px,#111516 12px 14px)"></div></div></div>`).join('');
  const edu = EDU.map((e) => `<div style="padding:20px 0;border-bottom:1px solid rgba(22,25,24,.2);display:flex;gap:16px;align-items:flex-start">${logoBadge(e.logo, 48, false)}<div style="min-width:0"><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;letter-spacing:-.025em;line-height:1.15;margin-bottom:6px">${e.school}</div><div style="font-size:15px;color:#2f3432;line-height:1.5">${e.a}</div><div style="font-family:'DM Mono',monospace;font-size:12px;color:#666B68;margin-top:4px">${e.b}</div></div></div>`).join('');
  return `<section id="experience" aria-label="Experience" style="background:#F1F0EA;color:#161918;padding:0 24px clamp(40px,6vw,80px)">
${planetHeader('repeating-linear-gradient(174deg,rgba(100,135,160,.2) 0 12px,transparent 12px 50px),radial-gradient(ellipse 80% 30vh at 50% 0,#dfeaef 0,#c2d5df 30%,#bcd0da 55%,#dfe6e8 80%,#F1F0EA 100%)', '0 -2px 12px rgba(195,228,242,.6),0 -18px 60px rgba(150,200,225,.22)', '#F1F0EA', 'THE ARCHIVE')}
<div style="max-width:1180px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<h2 style="${H2};max-width:780px">Business depth. Product direction.</h2>
<p style="margin:0 0 64px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#2f3432;max-width:640px">A career spent making sense of risk, growth, financial decisions, and complex organizations—now focused toward building better products.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));gap:56px;align-items:start">
<ol style="list-style:none;margin:0;padding:0;position:relative"><i aria-hidden="true" style="position:absolute;left:19px;top:20px;bottom:20px;width:1px;background:#161918;opacity:.25"></i>${jobs}</ol>
<div style="display:flex;flex-direction:column;gap:40px">
<div id="skills" style="background:#111516;color:#E7E8E4;padding:26px 24px 12px;border:1px solid #242928">
<div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;color:#65B9D0;margin-bottom:20px"><span>MVP-8 // TOP SKILLS</span><span style="color:#7FAF7B">● ALL SYSTEMS GO</span></div>
${caps}

</div>
<div><h3 style="margin:0 0 6px;font-family:'DM Mono',monospace;font-weight:500;font-size:12px;letter-spacing:.2em;color:#b9701a">EDUCATION</h3>${edu}</div>
</div>
</div>
</div>
</section>`;
}

function portfolioHTML() {
  const slots = SLOTS.map((s) => s.d
    ? `<article style="grid-column:1/-1;background:#111516;border:1px solid #242928;display:flex;flex-wrap:wrap;min-height:190px"><div class="thumb" style="flex:1 1 260px;max-width:100%;min-height:170px;border-right:1px solid #242928">${thumb(s.thumb)}</div><div style="flex:3 1 340px;padding:26px 24px;display:flex;flex-direction:column;gap:14px"><span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;color:#E39B36">${s.n}</span><h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;letter-spacing:-.025em;line-height:1.1">${s.t}</h3>${Array.isArray(s.d) ? `<div style="display:flex;flex-direction:column;gap:12px">${s.d.map(([k, v]) => `<div style="display:flex;flex-wrap:wrap;gap:2px 16px;align-items:baseline"><span style="flex:0 0 108px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#65B9D0">${k}</span><span style="flex:1 1 240px;font-size:15.5px;line-height:1.6;color:#b8bbb6">${v}</span></div>`).join('')}</div>` : `<p style="margin:0;font-size:15.5px;line-height:1.6;color:#b8bbb6">${s.d}</p>`}<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:auto">${s.href ? `<a class="hbtn" href="${s.href}" target="_blank" rel="noopener" style="margin-right:8px;color:#E8C943">${s.cta || 'Play it'} ↗</a>` : ''}${s.tags.map((t) => `<span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;border:1px solid #3a403e;color:#c4c6c1;padding:5px 9px">${t}</span>`).join('')}</div></div></article>`
    : `<div style="border:1px dashed #666B68;padding:26px 22px;min-height:190px;display:flex;flex-direction:column;justify-content:space-between;gap:24px"><span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;color:#E39B36">${s.n}</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:22px;letter-spacing:-.02em">${s.t}</span></div>`).join('');
  return `<section id="portfolio" aria-label="Portfolio" style="background-color:#080A0B;padding:0 24px clamp(40px,6vw,80px);${GRID_BG}">
${planetHeader('repeating-linear-gradient(170deg,rgba(101,185,208,.14) 0 10px,transparent 10px 44px),radial-gradient(ellipse 80% 30vh at 50% 0,#33808a 0,#1f5663 25%,#133a46 50%,#0c242d 76%,#080A0B 100%)', '0 -2px 12px rgba(101,185,208,.6),0 -18px 60px rgba(101,185,208,.2)', '#080A0B', 'THE WORKBENCH')}
<div style="max-width:1180px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<h2 style="${H2};max-width:820px">Personal projects &amp; experiments.</h2>
<p style="margin:0 0 48px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#b8bbb6;max-width:640px">A home for prototypes, apps, games, and experiments built while learning about product development, AI, and technology.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px">${slots}</div>
</div>
</section>`;
}

function contactHTML() {
  const links = [
    { label: 'EMAIL', ic: 'email', value: CONFIG.email, href: CONFIG.email && 'mailto:' + CONFIG.email },
    { label: 'LINKEDIN', ic: 'linkedin', value: 'LinkedIn', href: CONFIG.linkedin },
    { label: 'GITHUB', ic: 'github', value: 'GitHub', href: CONFIG.github },
    { label: 'SUBSTACK', ic: 'substack', value: 'Substack', href: CONFIG.substack }
  ].filter((l) => l.href).map((l) => `<a class="clink" href="${esc(l.href)}"${l.label === 'EMAIL' ? '' : ' target="_blank" rel="noopener"'}><span style="display:inline-flex;align-items:center;gap:12px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.16em;color:#E39B36">${icon(l.ic, 20)}${l.label}</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(20px,3.4vw,32px);letter-spacing:-.025em">${esc(l.value)} ↗</span></a>`).join('');
  return `<section id="contact" aria-label="Contact" style="position:relative;background:#020405;overflow:hidden;padding:clamp(100px,14vw,170px) 24px">
<div style="${SF.C2}"></div>
<div aria-hidden="true" style="position:absolute;left:50%;top:50%;width:min(90vw,820px);aspect-ratio:1/1;margin:calc(min(90vw,820px) / -2) 0 0 calc(min(90vw,820px) / -2);border-radius:50%;border:1px solid rgba(231,232,228,.1);animation:spin 70s linear infinite"><i style="position:absolute;left:50%;top:-5px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#E39B36;box-shadow:0 0 14px #E39B36"></i></div>
<div style="position:relative;max-width:760px;margin:0 auto;text-align:center">
<h2 style="${H2.replace('clamp(36px,6vw,68px)', 'clamp(36px,6.4vw,72px)')}">Every good journey starts with a conversation.</h2>
<p style="margin:0 auto 48px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#b8bbb6;max-width:520px">Andrea is always glad to meet curious people working on meaningful problems. Reach out any time.</p>
<div style="display:flex;flex-direction:column;border-top:1px solid rgba(231,232,228,.18);text-align:left">${links}</div>
</div>
</section>`;
}

/* ================= home ================= */
function homeHTML() {
  const L = bits(5), R = bits(9);
  const left = L.map((b, i) => `<div style="${b.box}">${i === 1 ? '<button type="button" id="replay" class="replay" aria-label="Replay intro animation" title="Replay intro">↻</button>' : `<i style="${b.inner}"></i>`}</div>`).join('');
  const right = R.map((b) => `<div style="${b.box}"><i style="${b.inner}"></i></div>`).join('');
  const keys = DEST.map((d, i) => `<button type="button" class="key" data-i="${i}" style="--k:${i}" aria-label="${esc(d.t + ' — ' + d.s)}">
<span style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-family:'DM Mono',monospace;font-size:13px;color:#E39B36;letter-spacing:.1em">${d.n}</span><span class="led"></span></span>
<span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:18px;letter-spacing:-.02em;margin-bottom:6px">${d.t}</span>
<span style="display:block;font-size:12px;line-height:1.35;color:#aeb2ad">${d.s}</span></button>`).join('');
  const ring = [0, 0.8, 1.6].map((d) => `<i style="position:absolute;inset:0;border-radius:50%;border:2px solid #65B9D0;animation:ping 2.4s ease-out ${d}s infinite"></i>`).join('');
  return `<div id="homeWrap" style="position:relative;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 100%,#0a1012 0,#020405 70%)">
${starsPlx('D', 'A', 'B', 'C', 'E')}
${shipsHTML()}
<div id="beam" aria-hidden="true"></div>
<section id="home" aria-label="Home" style="position:relative;overflow:hidden;background:transparent;touch-action:none">
<div id="crawl" data-crawlwrap="" style="position:absolute;inset:0;perspective:360px;perspective-origin:50% 0%;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 22%);mask-image:linear-gradient(to bottom,transparent 0,#000 22%)">
<div id="crawlText" style="position:absolute;top:100%;left:0;right:0;margin:0 auto;width:min(1000px,92vw);transform-origin:50% 0;animation:crawl 32s linear .5s both;animation-play-state:paused;text-align:center;color:#E8C943;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(26px,4.6vw,60px);line-height:1.45;letter-spacing:-.005em;padding-bottom:40px">
<p style="margin:0 0 1.4em;font-size:.85em;letter-spacing:.04em;text-transform:uppercase">A long time ago, in a career not so far away...</p>
<h1 style="margin:0 0 .3em;font-size:2.6em;line-height:1;letter-spacing:-.03em;text-transform:uppercase;font-weight:700">Andrea Mayo</h1>
<p style="margin:0 0 1.6em;font-size:.6em;letter-spacing:.22em;text-transform:uppercase">Episode I · The Intersection</p>
<p style="margin:0 0 1.2em;text-align:justify">Armed with a background in finance and endless curiosity, she has spent years exploring businesses, solving complex problems, and finding ways to make things work better.</p>
<p style="margin:0 0 1.2em;text-align:justify">Each mission sharpened a new skill. Banking taught her to find the real problem and let the numbers tell the truth. Boardrooms taught her to make the complex simple. Leading teams taught her to unite people who rarely agree, and building taught her to finish what she starts, now faster than ever with AI.</p>
<p style="margin:0 0 1.4em;text-align:justify">Now, she is in the Berkeley Haas system, targeting Product and Strategy roles, where business meets technology and the things people love.</p>
<p style="margin:0;font-size:.85em;letter-spacing:.04em;text-transform:uppercase">The journey continues...</p>
</div></div>
<button type="button" id="skipIntro" class="skipintro" aria-label="Skip intro">Skip intro <span aria-hidden="true">›››</span></button>
<div id="hero"></div>
</section>
<section id="deck" aria-label="Navigation deck" style="position:relative;background:linear-gradient(transparent 0,transparent 74%,#0b0d0d 75%);overflow:hidden">
<div id="scene" style="position:absolute;left:50%;top:0;width:1200px;height:400px;transform-origin:50% 0">
<div aria-hidden="true" style="position:absolute;left:-100px;top:90px;width:1400px;height:600px;border-radius:700px 700px 0 0 / 210px 210px 0 0;border-top:3px solid #8a918d;background:repeating-linear-gradient(90deg,transparent 0 179px,rgba(0,0,0,.45) 179px 180px),linear-gradient(#3a403e,#1d2221 14%,#101312 50%,#0b0d0d);box-shadow:0 -10px 30px rgba(0,0,0,.7),inset 0 12px 20px rgba(255,255,255,.04)"></div>
<div style="position:absolute;left:6px;top:212px;width:140px;height:190px;overflow:hidden;z-index:3;transform-origin:left center;transform:perspective(700px) rotateY(24deg);background:linear-gradient(#262b29,#0e1110);border:1px solid #4a504d;border-radius:90px 6px 6px 22px;box-shadow:inset 0 0 24px #000,0 10px 24px rgba(0,0,0,.6);padding:16px 10px 10px 16px;display:flex;flex-direction:column;gap:8px"><div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:#031013;border:2px solid #050606;border-radius:6px;box-shadow:0 0 0 1px #3a403e,inset 0 0 14px #000;padding:8px 6px"><div aria-hidden="true" style="position:relative;width:58px;height:58px;display:grid;place-items:center">${ring}<i style="position:relative;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#E8C943 50%,#8a6a10);box-shadow:0 0 12px rgba(232,201,67,.8)"></i></div><div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;color:#65B9D0"><span style="color:#E8C943">● CALL</span><br>TRANSMISSION</div></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">${left}</div></div>
<div aria-hidden="true" style="position:absolute;right:6px;top:212px;width:140px;height:190px;overflow:hidden;z-index:3;transform-origin:right center;transform:perspective(700px) rotateY(-24deg);background:linear-gradient(#262b29,#0e1110);border:1px solid #4a504d;border-radius:6px 90px 22px 6px;box-shadow:inset 0 0 24px #000,0 10px 24px rgba(0,0,0,.6);padding:16px 16px 10px 10px;display:flex;flex-direction:column;gap:8px"><div style="display:flex;flex-direction:column;justify-content:center;gap:4px;background:#031013;border:2px solid #050606;border-radius:6px;box-shadow:0 0 0 1px #3a403e,inset 0 0 14px #000;padding:8px 8px;min-height:92px;font-family:'DM Mono',monospace"><div style="font-size:10px;letter-spacing:.14em;color:#666B68">DEST. CODE</div><div id="routeCode" style="font-size:24px;letter-spacing:.06em;color:#E8C943">RT-––</div><div id="routeStatus" style="font-size:11px;letter-spacing:.06em;color:#666B68">AWAITING INPUT</div></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">${right}</div></div>
<div role="group" aria-label="Navigation deck controls" style="position:absolute;left:150px;top:112px;width:900px;height:288px;background:#7a817d;border-radius:450px 450px 0 0 / 70px 70px 0 0;z-index:4;box-shadow:0 -8px 24px rgba(0,0,0,.6)">
<div style="position:absolute;inset:3px 3px 0 3px;border-radius:447px 447px 0 0 / 67px 67px 0 0;background:linear-gradient(#2a2f2d,#151918 30%,#0b0d0d);padding:38px 44px 0;display:flex;flex-direction:column;gap:12px">
<div style="display:flex;align-items:center;gap:14px;min-height:34px">
<div aria-hidden="true" style="display:flex;gap:8px;align-items:center"><span style="width:8px;height:8px;border-radius:50%;background:#65B9D0;box-shadow:0 0 8px #65B9D0"></span><span style="width:8px;height:8px;border-radius:50%;background:#7FAF7B;box-shadow:0 0 8px #7FAF7B"></span><span id="ledAmber" style="width:8px;height:8px;border-radius:50%;background:#2a2f2d"></span><span id="ledRed" style="width:8px;height:8px;border-radius:50%;background:#2a2f2d"></span></div>
<div aria-live="polite" role="status" style="flex:1;background:#050607;border:1px solid #3a403e;border-radius:3px;padding:6px 10px;font-family:'DM Mono',monospace;font-size:13px;line-height:1.4;color:#E7E8E4">${droidIcon}<span style="color:#65B9D0;letter-spacing:.1em;margin-right:8px">MVP-8</span><span id="droidText" aria-hidden="true"></span><span id="droidCaret" class="caret" aria-hidden="true">▌</span><span id="droidSr" class="sr">Where to, pilot? I recommend the projects.</span></div>
</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${keys}</div>
<div aria-hidden="true" style="height:7px;background:repeating-linear-gradient(90deg,#050606 0 4px,#252a28 4px 7px)"></div>
</div></div>
</div>
</section>
</div>`;
}

function heroHTML() {
  const link = (href, label, ic) => href ? `<a class="hbtn" href="${esc(href)}"${label === 'Email' ? '' : ' target="_blank" rel="noopener"'}>${icon(ic)}${label}</a>` : '';
  const photo = `<img class="photo" src="${esc(CONFIG.photo)}" alt="Portrait of Andrea Mayo" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',textContent:'Add ${esc(CONFIG.photo)}'}))">`;
  const corners = ['top:-1px;left:-1px;border-width:2px 0 0 2px', 'top:-1px;right:-1px;border-width:2px 2px 0 0', 'bottom:-1px;left:-1px;border-width:0 0 2px 2px', 'bottom:-1px;right:-1px;border-width:0 2px 2px 0'].map((c) => `<i style="position:absolute;${c};width:12px;height:12px;border-color:#65B9D0;border-style:solid"></i>`).join('');
  return `<div style="position:relative;width:min(1040px,100%)">
<div style="position:relative;padding:14px 26px 18px;border:1px solid rgba(101,185,208,.55);background:linear-gradient(rgba(101,185,208,.10),rgba(101,185,208,.03));box-shadow:0 0 40px rgba(101,185,208,.18),inset 0 0 40px rgba(101,185,208,.06);transform-origin:50% 100%;animation:holoIn 1.6s ease both">
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(101,185,208,.07) 0 1px,transparent 1px 3px)"></div>
${corners}
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 40px">
<div style="flex:1 1 360px;max-width:620px;color:#E8C943;animation:glitch 2.8s steps(1) 1s both">
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;margin-bottom:10px"><span style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.24em;opacity:.85">WHO SHE IS</span><span class="hbadge"><i></i>Looking for 2027 internships</span></div>
<h1 style="margin:0 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.8vw,52px);line-height:.92;letter-spacing:-.04em;text-transform:uppercase">Andrea Mayo</h1>
<p style="margin:0 0 8px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(13.5px,1.4vw,17px);line-height:1.45">Armed with a background in finance and endless curiosity, she has spent years exploring businesses, solving complex problems, and finding ways to make things work better.</p>
<p style="margin:0 0 10px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(13.5px,1.4vw,17px);line-height:1.45">Now, she is in the Berkeley Haas system, targeting Product and Strategy roles, where business meets technology and the things people love.</p>
<div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.2em;margin-bottom:12px">THE JOURNEY CONTINUES...</div>
<div style="display:flex;flex-wrap:wrap;gap:12px">${link(CONFIG.email && 'mailto:' + CONFIG.email, 'Email', 'email')}${link(CONFIG.linkedin, 'LinkedIn', 'linkedin')}</div>
</div>
<div style="flex:0 0 auto;width:min(170px,36vw);aspect-ratio:3/4;padding:8px;border:1px solid rgba(101,185,208,.5);background:rgba(2,4,5,.4);animation:glitch 2.4s steps(1) 1.5s both">${photo}</div>
</div>
</div>
</div>`;
}

/* geometry that depends on viewport (ported from heroStyle/beamStyle/deckK) */
const deckK = () => Math.max(0.42, Math.min(innerWidth / 1200, innerHeight * 0.52 / 400, 1.3));
function layoutHome() {
  const home = $('#home'); if (!home) return;
  const W = innerWidth, H = innerHeight, k = Math.min(1, (H * 0.48 - 16) / 420), kd = deckK();
  home.style.height = '48%';
  const hero = $('#hero');
  hero.style.cssText = st({
    position: 'absolute', top: 0, left: '50%', marginLeft: -(50 / k) + '%', width: (100 / k) + '%', height: (100 / k) + '%', zIndex: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px 48px', padding: '16px 24px 8px', overflow: 'hidden', transformOrigin: '50% 0',
    transform: 'scale(' + (S.descended ? k : k * 0.55) + ')', opacity: S.descended ? 1 : 0, pointerEvents: S.descended ? 'auto' : 'none', transition: 'opacity 1.8s ease,transform 2.4s cubic-bezier(.16,.8,.3,1)'
  });
  const deck = $('#deck'); deck.style.height = 400 * kd + 'px';
  $('#scene').style.transform = 'translateX(-50%) scale(' + kd + ')';
  const beam = $('#beam');
  if (!S.holo) { beam.style.cssText = ''; return; }
  const hh = H * 0.48, kh = Math.min(1, (H * 0.48 - 16) / 420);
  const sx = (W - 1200 * kd) / 2 + 80 * kd, sy = hh + 245 * kd;
  const pw = Math.min(1040 * kh, W), pl = W / 2 - pw / 2, by = Math.min(hh - 6, (hh + 360 * kh) / 2) - 4;
  const x1 = pl + pw * 0.04, x2 = pl + pw * 0.36, d = Math.hypot(sx - x1, sy - by);
  const first = !beam.style.cssText;
  beam.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;clip-path:polygon(' + sx + 'px ' + sy + 'px,' + x1 + 'px ' + by + 'px,' + x2 + 'px ' + by + 'px);background:radial-gradient(circle at ' + sx + 'px ' + sy + 'px,rgba(150,215,235,.85) 0,rgba(101,185,208,.35) ' + (d * 0.6) + 'px,rgba(101,185,208,.1) ' + d + 'px);' + (first ? 'animation:beamOn 1.4s ease both' : '');
}

function showHolo() {
  S.holo = true;
  $('#hero').innerHTML = heroHTML();
  layoutHome();
}
function descend() {
  if (S.descended || S.view !== 'home') return;
  S.descended = true;
  const fleet = $('[data-ships]'); if (fleet) fleet.classList.add('on');   // ships appear once the crawl is over
  const crawl = $('#crawl'); if (crawl) crawl.remove();
  const sk = $('#skipIntro'); if (sk) sk.remove();
  layoutHome();
  clearTimeout(holoTimer); holoTimer = setTimeout(showHolo, 1500);
}

function paintRoute() {
  const act = S.active >= 0 ? DEST[S.active] : S.hot >= 0 ? DEST[S.hot] : null;
  const code = $('#routeCode'); if (!code) return;
  code.textContent = act ? act.code : 'RT-––';
  const status = $('#routeStatus');
  status.textContent = S.active >= 0 ? 'ROUTE LOCKED' : S.hot >= 0 ? 'ROUTE READY' : 'AWAITING INPUT';
  status.style.color = S.active >= 0 ? '#E8C943' : S.hot >= 0 ? '#7FAF7B' : '#666B68';
  const led = (el, c, on) => { el.style.background = on ? c : '#2a2f2d'; el.style.boxShadow = on ? '0 0 8px ' + c : 'none'; };
  led($('#ledAmber'), '#E39B36', S.hot >= 0);
  led($('#ledRed'), '#C7594F', S.warping);
}
/* MVP-8 "types" its lines like a terminal, with a blinking caret waiting at the end */
function setDroid(t) {
  const el = $('#droidText'), sr = $('#droidSr'), caret = $('#droidCaret'); if (!el) return;
  clearTimeout(droidTimer);
  if (sr) sr.textContent = t;
  if (reduced()) { el.textContent = t; return; }
  let i = 0; el.textContent = '';
  const tick = () => {
    i++; el.textContent = t.slice(0, i);
    if (caret) caret.classList.toggle('typing', i < t.length);
    if (i < t.length) droidTimer = setTimeout(tick, 16 + Math.random() * 30);
  };
  droidTimer = setTimeout(tick, 60);
}

/* ================= intro controls: skip, scroll to advance, hold to speed up ================= */
function wireIntroControls() {
  const homeEl = $('#home'), text = $('#crawlText'), skip = $('#skipIntro');
  if (!homeEl || !text) return;
  const anim = () => (text.getAnimations ? text.getAnimations()[0] : null);
  const advance = (ms) => {                      // push the crawl forward by ms of its own timeline
    const a = anim(); if (!a || S.descended) return;
    a.currentTime = Math.max(0, (a.currentTime || 0) + ms);
  };
  skip.addEventListener('click', descend);

  // scroll / trackpad: each pixel scrolled skips ahead ~25ms (scrolling up rewinds slightly)
  homeEl.addEventListener('wheel', (e) => { advance(e.deltaY * 25); }, { passive: true });

  // press & hold (mouse or touch) = 5x speed; drag up/down also scrubs
  let holdTimer = null, fast = false, lastY = 0, moved = 0;
  const setRate = (r) => { const a = anim(); if (a) a.playbackRate = r; };
  const release = () => { clearTimeout(holdTimer); if (fast) { fast = false; setRate(1); homeEl.classList.remove('fast'); } };
  homeEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button,a')) return;
    lastY = e.clientY; moved = 0;
    holdTimer = setTimeout(() => { fast = true; setRate(5); homeEl.classList.add('fast'); }, 280);
  });
  homeEl.addEventListener('pointermove', (e) => {
    if (!(e.buttons & 1) && e.pointerType === 'mouse') return;
    const dy = lastY - e.clientY; lastY = e.clientY; moved += Math.abs(dy);
    if (moved > 10 && !fast) clearTimeout(holdTimer);
    if (e.pointerType !== 'mouse' || moved > 10) advance(dy * 25);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => homeEl.addEventListener(t, release));

  // keyboard: Esc skips, Arrow Down / Page Down advance
  removeEventListener('keydown', introKey);
  introKey = (e) => {
    if (S.view !== 'home' || S.descended) { removeEventListener('keydown', introKey); return; }
    if (e.key === 'Escape') descend();
    else if (e.key === 'ArrowDown' || e.key === 'PageDown') advance(1500);
  };
  addEventListener('keydown', introKey);
}

/* Size the crawl to this screen: measure how far the text must travel for the last line to leave the
   screen, end the animation exactly there, and pick a duration that keeps a steady reading speed. */
function fitCrawl(el) {
  const keep = el.style.animation; el.style.animation = 'none';
  const last = el.querySelector('p:last-child');
  let need = 140;
  for (let pct = 100; pct <= 260; pct += 0.5) { el.style.transform = 'rotateX(58deg) translateY(-' + pct + '%)'; if (last.getBoundingClientRect().bottom < 0) { need = pct; break; } }
  el.style.transform = ''; el.style.animation = keep;
  const lh = parseFloat(getComputedStyle(el).lineHeight) || 80;
  const secs = Math.min(38, Math.max(26, (need / 100 * el.offsetHeight / lh) / 1.24));   // ~1.24 lines per second
  el.style.setProperty('--crawl-end', '-' + (need + 0.3) + '%');
  el.style.animationDuration = secs + 's';
  return secs;
}
function startCrawl() {
  const el = $('#crawlText'); if (!el) return;
  const go = () => {
    if (S.descended || S.view !== 'home' || !document.body.contains(el)) return;
    const secs = fitCrawl(el);
    el.style.animationPlayState = 'running';
    autoTimer = setTimeout(descend, (secs + 2) * 1000);          // fallback if animationend never fires
  };
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(go); else go();
}

function enterHome({ instant }) {
  S.view = 'home';
  main.innerHTML = homeHTML();
  dock.hidden = true; dockSpacer.hidden = true;
  S.descended = instant; S.holo = instant; S.hot = -1; S.active = -1;
  clearTimeout(autoTimer); clearTimeout(holoTimer);
  if (instant) { const fl = $('[data-ships]'); if (fl) fl.classList.add('on'); const c = $('#crawl'); if (c) c.remove(); const k = $('#skipIntro'); if (k) k.remove(); $('#hero').innerHTML = heroHTML(); }
  else startCrawl();
  const crawlText = $('#crawlText'); if (crawlText) crawlText.addEventListener('animationend', descend);
  if (!instant) wireIntroControls();
  layoutHome(); paintRoute();
  clearTimeout(droidTimer);
  const hello = 'Where to, pilot? I recommend the projects.';
  if (instant) setDroid(hello); else droidTimer = setTimeout(() => setDroid(hello), 1700); // after the deck powers on
  $$('.key', main).forEach((b) => {
    const i = +b.dataset.i;
    const enter = () => { S.hot = i; setDroid(DEST[i].say); paintRoute(); };
    const leave = () => { S.hot = -1; paintRoute(); };
    b.addEventListener('click', () => travel(i));
    b.addEventListener('mouseenter', enter); b.addEventListener('focus', enter);
    b.addEventListener('mouseleave', leave); b.addEventListener('blur', leave);
  });
  $('#replay').addEventListener('click', () => enterHome({ instant: false }));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ================= sections + dock ================= */
const SECTION = { story: storyHTML, projects: projectsHTML, experience: experienceHTML, portfolio: portfolioHTML, contact: contactHTML };

function buildDock() {
  dock.innerHTML = `<nav class="docknav" aria-label="Navigation deck" style="width:100%;background:linear-gradient(#2c3230,#0f1211 40%,#050606);border-top:2px solid #8a918d;border-radius:50% 50% 0 0 / 30px 30px 0 0;padding:20px clamp(16px,4vw,56px) 10px;display:flex;flex-direction:column;gap:10px;box-shadow:0 -14px 34px rgba(0,0,0,.75)">
<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:stretch">
<button type="button" class="homebtn" data-i="-1" aria-label="Home — back to the start"><i aria-hidden="true" style="position:absolute;top:7px;width:6px;height:6px;border-radius:50%;background:#65B9D0;box-shadow:0 0 8px #65B9D0"></i><span style="margin-top:8px">HOME</span></button>
${DEST.map((d, i) => `<button type="button" class="dkey" data-i="${i}" aria-label="${esc(d.t + ' — ' + d.s)}"><span style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;letter-spacing:-.01em">${d.t}</span><span class="led"></span></span></button>`).join('')}
</div>
<div class="dockfoot" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 24px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;color:#8d928e;border-top:1px solid rgba(231,232,228,.12);padding-top:8px"><span>Andrea Mayo © 2026</span><span style="display:inline-flex;align-items:center">${droidIcon}Built with curiosity. Navigated by MVP-8.</span></div>
</nav>`;
  $$('button', dock).forEach((b) => b.addEventListener('click', () => travel(+b.dataset.i)));
}

function paintDock() {
  $$('.dkey', dock).forEach((b) => {
    const cur = DEST[+b.dataset.i].id === S.view;
    b.classList.toggle('cur', cur);
    if (cur) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  dock.classList.add('open');
  syncDockSpacer();
}

function syncDockSpacer() {
  if (!dock.hidden) dockSpacer.style.height = dock.offsetHeight + 'px';
}

function enterSection(id) {
  S.view = id;
  if (id === 'story') setTimeout(wireRoute, 0);
  clearTimeout(autoTimer); clearTimeout(holoTimer);
  main.innerHTML = SECTION[id]();
  dock.hidden = false; dockSpacer.hidden = false;
  S.dockOpen = true; S.overDock = false;
  paintDock();
  window.scrollTo({ top: 0, behavior: 'instant' });
  const sk = $('#skills');
  if (sk) { if ('IntersectionObserver' in window) { const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { sk.classList.add('go'); io.disconnect(); } }, { threshold: 0.35 }); io.observe(sk); } else sk.classList.add('go'); }
}

/* case-study / job accordions */
main.addEventListener('click', (e) => {
  const b = e.target.closest('[data-toggle]'); if (!b) return;
  const group = b.dataset.toggle, was = b.getAttribute('aria-expanded') === 'true';
  $$('[data-toggle="' + group + '"]', main).forEach((x) => {
    const open = !was && x === b;
    x.setAttribute('aria-expanded', String(open));
    x.querySelector('.t').textContent = open ? x.dataset.close : x.dataset.open;
    x.querySelector('.s').textContent = open ? '−' : '+';
    const body = document.getElementById(x.getAttribute('aria-controls')); if (body) body.hidden = !open;
  });
});

/* ================= travel (hyperspace) ================= */
/* The jump: ~1.9s. Stars stretch into streaks that accelerate out of the center (0 to 1.0s), a white flash
   covers the arrival (the section is swapped at the flash peak), then the streaks decelerate and fade over
   the new section (1.0 to 1.9s). Drawn on a canvas so it can carry hundreds of stars at once. */
const WARP_T = { jump: 1000, total: 1900 };
function warpHTML(label) {
  return `<div class="wp" role="status" aria-live="assertive"><canvas class="wp-cv" aria-hidden="true"></canvas><div class="wp-vig" aria-hidden="true"></div>
<div class="wp-txt"><div class="wp-k">ROUTE LOCKED</div><div class="wp-t">${esc(label)}</div><div class="wp-s">ENGAGING HYPERDRIVE</div></div></div>`;
}
function runWarp(onJump, onDone) {
  const wp = warp.querySelector('.wp'), cv = warp.querySelector('.wp-cv'), ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const W = cv.width = Math.round(innerWidth * dpr), H = cv.height = Math.round(innerHeight * dpr);
  const cx = W / 2, cy = H / 2, R = Math.hypot(W, H) / 2, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), in3 = (v) => v * v * v, out3 = (v) => 1 - Math.pow(1 - v, 3);
  const mk = () => ({ a: Math.random() * TAU, r: 0.03 + Math.pow(Math.random(), 0.6) * 0.97, z: 0.06 + Math.random() * 0.94, h: Math.random() });
  const stars = Array.from({ length: 560 }, mk);
  const rho = (s, z) => s.r * R * 0.1 / z;
  const t0 = performance.now(); let last = t0, jumped = false;
  const frame = (now) => {
    const t = Math.max(0, now - t0), dt = Math.max(0, Math.min(48, now - last)) / 1000; last = now;
    const pre = t < WARP_T.jump, post = clamp((t - WARP_T.jump) / (WARP_T.total - WARP_T.jump));
    const v = pre ? 0.15 + 3.6 * in3(clamp(t / WARP_T.jump)) : 0.2 + 3.55 * (1 - out3(post));   // speed profile
    const g = clamp(v / 3.4), fade = pre ? 1 : Math.pow(1 - post, 1.2);
    if (!jumped && t >= WARP_T.jump) { jumped = true; wp.classList.add('rev'); onJump(); }
    ctx.globalCompositeOperation = 'source-over';
    if (pre) { ctx.fillStyle = 'rgba(2,4,5,' + (0.55 - 0.3 * g).toFixed(2) + ')'; ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * (0.12 + 0.55 * g));      // tunnel glow
    gr.addColorStop(0, 'rgba(235,248,255,' + (0.85 * g * fade).toFixed(2) + ')'); gr.addColorStop(0.35, 'rgba(101,185,208,' + (0.35 * g * fade).toFixed(2) + ')'); gr.addColorStop(1, 'rgba(101,185,208,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    for (let k = 0; k < 4; k++) {                                                       // expanding rings
      const p = ((t / 700) + k / 4) % 1;
      ctx.strokeStyle = 'rgba(150,215,235,' + (0.22 * g * (1 - p) * fade).toFixed(3) + ')'; ctx.lineWidth = 2 * dpr * (0.5 + p);
      ctx.beginPath(); ctx.arc(cx, cy, p * R * 0.95, 0, TAU); ctx.stroke();
    }
    const trail = 2.5 + 2 * g;
    for (const s of stars) {
      const r1 = rho(s, s.z), r0 = rho(s, Math.min(1.4, s.z + v * dt * trail)), ca = Math.cos(s.a), sa = Math.sin(s.a), depth = 1 - s.z;
      const x0 = cx + ca * r0, y0 = cy + sa * r0, x1 = cx + ca * r1, y1 = cy + sa * r1, al = clamp(0.25 + depth * 0.9) * fade;
      ctx.lineWidth = (0.5 + depth * 2.4) * dpr;
      if (v > 1.6 && depth > 0.45) {                                                    // colour fringing at speed
        ctx.strokeStyle = 'rgba(255,90,90,' + (al * 0.28).toFixed(2) + ')'; ctx.beginPath(); ctx.moveTo(x0 + 1.6 * dpr, y0); ctx.lineTo(x1 + 1.6 * dpr, y1); ctx.stroke();
        ctx.strokeStyle = 'rgba(80,200,255,' + (al * 0.28).toFixed(2) + ')'; ctx.beginPath(); ctx.moveTo(x0 - 1.6 * dpr, y0); ctx.lineTo(x1 - 1.6 * dpr, y1); ctx.stroke();
      }
      ctx.strokeStyle = 'hsla(' + (190 + s.h * 40).toFixed(0) + ',90%,' + (72 + depth * 24).toFixed(0) + '%,' + al.toFixed(2) + ')';
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      s.z -= v * dt; if (s.z < 0.06) Object.assign(s, mk(), { z: 1 });
    }
    const f = t < WARP_T.jump - 180 ? 0 : pre ? in3(clamp((t - (WARP_T.jump - 180)) / 180)) : 1 - out3(clamp((t - WARP_T.jump) / 420));   // white flash
    if (f > 0.01) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(236,248,255,' + f.toFixed(2) + ')'; ctx.fillRect(0, 0, W, H); }
    if (t < WARP_T.total) requestAnimationFrame(frame); else onDone();
  };
  requestAnimationFrame(frame);
}

/* i = -1 for Home */
function travel(i) {
  if (S.warping) return;
  const d = i >= 0 ? DEST[i] : null;
  const label = d ? d.t : 'Home', id = d ? d.id : 'home';
  const arrive = () => { if (id === 'home') enterHome({ instant: true }); else enterSection(id); };
  const keyBtn = d && S.view === 'home' ? $('.key[data-i="' + i + '"]') : null;
  if (d) {
    S.active = i; setDroid(d.pick || d.say); paintRoute();
    if (keyBtn) { keyBtn.classList.add('is-active', 'is-pressed'); setTimeout(() => keyBtn.classList.remove('is-pressed'), 160); }
  }
  if (reduced()) { setTimeout(arrive, 120); return; }
  const t0 = d ? 160 : 0;
  S.warping = true;
  setTimeout(() => {
    warp.innerHTML = warpHTML(label); warp.hidden = false; paintRoute();
    runWarp(arrive, () => { warp.hidden = true; warp.innerHTML = ''; S.warping = false; });
  }, t0);
}

/* ================= global listeners ================= */
addEventListener('pointermove', (e) => {   // parallax: star layers and ships shift by depth
  if (S.view !== 'home' || reduced() || e.pointerType === 'touch') return;
  const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
  $$('.plx').forEach((el) => { const d = +el.dataset.depth; el.style.transform = 'translate3d(' + (-nx * d).toFixed(1) + 'px,' + (-ny * d).toFixed(1) + 'px,0)'; });
}, { passive: true });
addEventListener('resize', () => { layoutHome(); syncDockSpacer(); });

/* ================= boot ================= */
buildDock();
enterHome({ instant: reduced() });
