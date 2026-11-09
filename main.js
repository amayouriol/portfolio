/* Andrea Mayo — Product Explorer. Vanilla JS port of the Claude Design prototype. */
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
  C2: st({ ...layer(51, 18, 1.8, 260, 0.6, true), height: '100%', width: '100%' })
};
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
  { n: '01', t: 'My Story', s: 'The path from finance to product.', id: 'story', code: 'RT-01', say: 'Origin coordinates loaded. Curiosity levels: unusually high.' },
  { n: '02', t: 'How I Work', s: 'Problems, decisions, and measurable outcomes.', id: 'projects', code: 'RT-02', say: 'Project coordinates locked. This is the good stuff.', pick: 'Finally, someone who knows how to navigate.' },
  { n: '03', t: 'Experience', s: 'Roles, achievements, and education.', id: 'experience', code: 'RT-03', say: 'Career archive open. It is... impressively organized.' },
  { n: '04', t: 'Portfolio', s: 'Prototypes and experiments built with AI.', id: 'portfolio', code: 'RT-04', say: 'Workbench online. Some of these even work on the first try.' },
  { n: '05', t: 'Contact', s: 'Start a conversation.', id: 'contact', code: 'RT-05', say: 'Communications online. Try not to overthink the subject line.' }
];

const CHAPTERS = [
  { n: '01', t: 'Curiosity', p: 'I have always wanted to understand how things work. That usually starts with a question, then another one, and occasionally far too many browser tabs.', l: 'Ask before assuming' },
  { n: '02', t: 'Understanding the problem', p: 'Banking taught me how businesses operate, how decisions get made, and how complex systems affect both customers and organizations.', l: 'Find what really matters' },
  { n: '03', t: 'Connecting the dots', p: 'I found that I do my best work between perspectives—customer needs, business goals, data, processes, and what technology can make possible.', l: 'Make complexity useful' },
  { n: '04', t: 'Building what comes next', p: 'My MBA at Haas is the next stage: expanding my product toolkit, learning alongside ambitious people, and preparing to lead teams that build better experiences.', l: 'Move from insight to action' }
];

const PROJECTS = [
  { title: 'Cash Flow Module for Credit Analysis', summary: 'Raised the need in user research, then owned a new cash flow module end to end.',
    metrics: [{ v: '10h → 3h', t: 'analysis time per case' }, { v: '~2,500', t: 'people used the module' }, { v: '~50%', t: 'of the loan book covered' }],
    tags: ['Discovery', '0-to-1 delivery', 'Adoption'],
    secs: [['Discovery', 'The need surfaced in user research with the analysts who built cash flow analyses by hand.'], ['My role', 'Owned the module end to end with a team of 4 over roughly 10 months.'], ['Approach', 'Roadmap: test an MVP, iterate, launch, then v2. I defined v2.'], ['Adoption', '~240 people trained directly through 15 champions.'], ['Impact', 'Analysis time fell from ~10 hours to ~3 per case; ~2,500 people used the module.']] },
  { title: 'AI-Assisted Credit Reports', summary: 'As product owner, defined what 4 AI agents delivered and proved it in a controlled pilot.',
    metrics: [{ v: '15 → 5 days', t: 'client response time' }, { v: '10 + 10', t: 'test and control officers' }, { v: '10+', t: 'test rounds with engineers' }],
    tags: ['AI product', 'Experiment design', 'Engineering'],
    secs: [['My role', 'Product owner. Led ~5 engineers through 10+ test rounds.'], ['Solution', '4 AI agents: 3 gathering inputs and 1 drafting the report.'], ['Experiment', '3-month controlled pilot with 20 officers, randomized within teams (10 test, 10 control).'], ['Decision', 'Recommended an express path for 30% of the year’s cases; management made the call.'], ['Impact', 'Client response time fell by two-thirds, from ~15 days to ~5.']] },
  { title: 'Reporting Dashboard', summary: 'Traced a 60-day reporting cycle to teams trusting their own spreadsheets over the source system, then led 7 people to retire them.',
    metrics: [{ v: '60 → 5 days', t: 'reporting cycle' }, { v: '80+', t: 'users across 12 credit teams' }, { v: '94', t: 'internal NPS among users' }],
    tags: ['Data product', 'Adoption', 'Leadership'],
    secs: [['Problem', 'Reporting took ~60 days because teams trusted their own spreadsheets over the source system.'], ['My role', 'Led a 7-person team over 6–8 months. Set the project’s success metrics (reporting time, zero data complaints) and locked closed records.'], ['Impact', 'Monthly performance report in 5 days instead of 60; 80+ users from analysts to Deputy Managers.'], ['Recognition', 'Division award.']] },
  { title: 'Self-Service Decision Engine', summary: 'Found most invoice financing requests were approved anyway, then built rules letting sales disburse smaller deals on their own.',
    metrics: [{ v: '85%', t: 'of requests historically approved' }, { v: '~80%', t: 'of requests under the $40K threshold' }, { v: '2.8%', t: 'defaults vs a 3.5% target' }],
    tags: ['Decision systems', '0-to-1 delivery', 'Risk'],
    secs: [['Discovery', 'Analyzed 12 months of data; in a 352-request sample over 6 months, 85% were approved anyway.'], ['Solution', 'Rules built on 7 variables let sales disburse requests under $40K without credit review.'], ['Approach', 'Proposed as a one-year trial to keep risk visible.'], ['Impact', 'Processing time halved; defaults stayed at 2.8% against a 3.5% target.']] }
];

const JOBS = [
  { org: 'BCP · 2025–2026', role: 'Deputy Manager, Credit Risk', sum: 'Led product-style initiatives inside credit: AI-assisted reporting, a cash flow module, and portfolio strategy.', items: ['Product owner for an AI credit report pilot that cut client response time by two-thirds.', 'Advised senior committees on ~$800M a year of lending; ~95% approved on first presentation.', 'Built the team’s annual plan and a scoring system matching 350 accounts ($3.8B) to 5 analysts; productivity rose from 86% to 122% of target.', 'Turned client conversations into an early-warning flag, reaching ~30 at-risk clients with ~$40M in liquidity lines ahead of El Niño.'] },
  { org: 'BCP · 2023–2025', role: 'Assistant Manager, Credit Risk', sum: 'Made credit tools people actually use, and wrote lending criteria for new kinds of businesses.', items: ['Led 7 people to cut a 60-day reporting cycle to 5.', 'Redesigned the CRM with a UX designer and IT: real-time logging rose from 20% to 50% of evaluations.', 'Wrote lending criteria for digital companies with no credit history; the segment tripled to 500 clients with no material defaults.', 'Gave each client a dedicated analyst; client NPS rose from the 70s to 87.'] },
  { org: 'BCP · 2021–2023', role: 'Deputy Assistant Manager', sum: 'Learned to turn data into rules that let the business move faster.', items: ['Built a self-service decision engine for invoice financing.', 'Designed and taught a week-long analysis course for 30 analysts (100% satisfaction).'] },
  { org: 'BCP · 2020–2021', role: 'Analyst', sum: 'Started in credit analysis and quickly learned how companies make financial decisions.', items: ['Named best analyst of the semester three months into the role.'] },
  { org: 'BBVA · 2020', role: 'Business Analyst', sum: 'Supported wholesale banking decisions through analysis and a close view of client needs.', items: ['Structured $20M of emergency loans for 10 clients by modeling cash flows live on client calls.'] },
  { org: 'EY · 2018–2020', role: 'Transfer Pricing', sum: 'Learned to structure ambiguous questions, analyze businesses, and communicate rigorous conclusions.', items: ['Built transfer pricing documentation for Peru’s largest economic groups and multinationals.'] }
];
const CAPS = ['Problem framing', 'Analytical thinking', 'Cross-functional leadership', 'Execution', 'Building with AI', 'Executive communication'];
const EDU = [
  { school: 'UC Berkeley — Haas School of Business', a: 'MBA Candidate', b: 'Class of 2028' },
  { school: 'Universidad ESAN', a: 'Economics and International Business', b: 'Undergraduate degree' },
  { school: 'EM Strasbourg Business School', a: 'European Management', b: 'International academic exchange' }
];
const SLOTS = [
  { n: 'PROJECT 01', t: 'Recruiting & events CRM for Women in Finance', d: 'Scoped and shipped a recruiting CRM for a 12-person nonprofit with Claude Code and Codex on a $0 license budget. Mentee selection fell from 20+ days to about 10.', tags: ['Claude Code', 'Codex', 'Lovable', 'Vercel'] },
  { n: 'PROJECT 02', t: 'Fill the Lyrics: a Spotify lyrics game', d: 'A game that connects to Spotify, pulls synced lyrics, and blanks out words for you to fill in by typing or by voice. Built through weekly build-test-fix cycles: I tuned difficulty (one blank per two lines up to 3–4 per line), cut repeated words, and added a score and language filters.', tags: ['Spotify', 'Lyrics sync', 'Voice input', 'Vercel'], href: 'https://lyrics-game-two.vercel.app/' },
  { n: 'PROJECT 03 · IN PROGRESS', t: 'Buddi: personal and shared money, in one ledger', d: 'A phone-first app for tracking personal spending and money shared with friends, who stay names in your ledger and never need an account. I wrote the MVP spec: one-tap phone sign-in, a split-bill flow that gets the accounting right (repayments never count as income or spending), and AI that drafts entries from voice, text or receipt photos but never saves without my review.', tags: ['PWA', 'Supabase', 'PostgreSQL + RLS', 'Gemini', 'Product spec'], href: 'https://github.com/amayouriol/buddi-finance', cta: 'View on GitHub' }
];
const ORBIT = [{ label: 'Business', a: -125, r: 50 }, { label: 'Technology', a: -25, r: 34 }, { label: 'People', a: 60, r: 50 }, { label: 'Data', a: 155, r: 34 }];

const droidIcon = '<span aria-hidden="true" style="position:relative;display:inline-block;flex:0 0 auto;width:26px;height:30px;vertical-align:middle;margin-right:8px"><i style="position:absolute;left:12px;top:0;width:1px;height:4px;background:#8a8f8b"></i><i style="position:absolute;left:3px;top:3px;width:20px;height:10px;border-radius:20px 20px 0 0;background:linear-gradient(135deg,#b4b8b3,#6f7570)"></i><i style="position:absolute;left:10px;top:5px;width:6px;height:6px;border-radius:50%;background:#65B9D0;box-shadow:0 0 6px #65B9D0"></i><i style="position:absolute;left:4px;top:13px;width:18px;height:13px;border-radius:2px 2px 4px 4px;background:linear-gradient(90deg,#8f948f,#aeb2ad 40%,#5b6260)"></i><i style="position:absolute;left:6px;top:15px;width:14px;height:2px;background:#65B9D0"></i><i style="position:absolute;left:0;top:13px;width:4px;height:15px;border-radius:2px;background:#4a504d"></i><i style="position:absolute;left:22px;top:13px;width:4px;height:15px;border-radius:2px;background:#4a504d"></i></span>';

/* ================= state ================= */
const S = { view: 'home', descended: false, holo: false, dockOpen: true, overDock: false, hot: -1, active: -1, warping: false, away: false };
let autoTimer = null, holoTimer = null;
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

function storyHTML() {
  const orbit = ORBIT.map((o, i) => {
    const rad = o.a * Math.PI / 180;
    const pos = st({ position: 'absolute', left: (50 + o.r * Math.cos(rad)) + '%', top: (50 + o.r * Math.sin(rad)) + '%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'column' });
    const dot = st({ width: 10, height: 10, borderRadius: '50%', background: i % 2 ? '#E39B36' : '#65B9D0', display: 'block' });
    return `<div style="${pos}"><i style="${dot}"></i><span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;background:#F1F0EA;padding:2px 5px;white-space:nowrap">${o.label}</span></div>`;
  }).join('');
  const chapters = CHAPTERS.map((c) => `<article class="chapter" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:20px 40px;padding:36px 0;border-top:1px solid rgba(22,25,24,.2)">
<div><div style="font-family:'DM Mono',monospace;font-size:12px;color:#b9701a;letter-spacing:.14em;margin-bottom:10px">${c.n}</div><h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(24px,3.4vw,34px);letter-spacing:-.03em;line-height:1.05">${c.t}</h3></div>
<p style="margin:0;font-size:17px;line-height:1.65;color:#2f3432">${c.p}</p>
<div style="align-self:start"><span style="display:inline-block;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.06em;border:1px solid #E39B36;color:#7a4608;padding:7px 11px">${c.l}</span></div>
</article>`).join('');
  return `<section id="story" aria-label="My Story" style="background:radial-gradient(ellipse 420px 240px at 10% 700px,rgba(227,155,54,.11),transparent 70%),radial-gradient(ellipse 520px 280px at 90% 1000px,rgba(201,120,58,.10),transparent 70%),radial-gradient(ellipse 360px 220px at 28% 1500px,rgba(227,155,54,.09),transparent 70%),radial-gradient(ellipse 480px 260px at 80% 1900px,rgba(201,120,58,.08),transparent 70%),repeating-linear-gradient(165deg,transparent 0 260px,rgba(201,120,58,.08) 260px 261px,transparent 261px 400px),repeating-linear-gradient(112deg,transparent 0 420px,rgba(201,120,58,.06) 420px 421px,transparent 421px 640px),#F1F0EA;color:#161918;padding:0 24px clamp(40px,6vw,80px)">
${planetHeader('repeating-linear-gradient(172deg,rgba(176,98,40,.16) 0 12px,transparent 12px 54px),radial-gradient(ellipse 80% 30vh at 50% 0,#e6cfa6 0,#d9bd90 28%,#cdb48e 52%,#e3d6bf 80%,#F1F0EA 100%)', '0 -2px 12px rgba(230,150,80,.45),0 -18px 60px rgba(215,125,60,.18)', '#F1F0EA', 'ORIGIN')}
<div style="max-width:1120px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:56px;align-items:center">
<div>
<h2 style="${H2.replace('margin:0 0 22px', 'margin:0 0 24px')}">The person behind the product thinking.</h2>
<p style="margin:0;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#2f3432;max-width:520px">I’m not leaving my business background behind. I’m bringing it with me—to ask better questions, understand the whole system, and build products that work for people and businesses.</p>
</div>
<div>
<div role="img" aria-label="Orbital diagram: Andrea at the center, orbited by Business, Technology, People and Data" style="position:relative;width:100%;max-width:420px;aspect-ratio:1/1;margin:0 auto">
<div style="position:absolute;inset:0;border-radius:50%;border:1px dashed #8d918d;animation:spin 160s linear infinite"></div>
<div style="position:absolute;inset:16%;border-radius:50%;border:1px solid #b9bbb5"></div>
<div style="position:absolute;inset:32%;border-radius:50%;border:1px solid #b9bbb5"></div>
<div style="position:absolute;left:50%;top:50%;width:22%;aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:50%;background:#161918;color:#E8C943;display:grid;place-items:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(14px,2.4vw,20px)">AM</div>
${orbit}
</div>
<p style="margin:28px auto 0;max-width:420px;font-family:'Space Grotesk',sans-serif;font-size:clamp(18px,2.4vw,22px);line-height:1.35;letter-spacing:-.02em;font-weight:500">“The best part of a complex problem is the moment the pieces start to connect.”</p>
</div>
</div>
<div style="margin-top:clamp(64px,9vw,110px)">${chapters}<div style="border-top:1px solid rgba(22,25,24,.2)"></div></div>
</div>
</section>`;
}

function projectsHTML() {
  const cards = PROJECTS.map((p, i) => {
    const secs = [['Overview', p.summary], ...p.secs].map(([name, body], j) => `<div style="display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 12px;padding:14px 0;border-top:1px solid #242928"><span style="font-family:'DM Mono',monospace;font-size:11px;color:#E39B36;padding-top:3px">${String(j + 1).padStart(2, '0')}</span><div><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin-bottom:4px">${name}</div><div style="font-size:14.5px;line-height:1.55;color:#c4c6c1">${esc(body)}</div></div></div>`).join('');
    const metrics = p.metrics.map((m) => `<div><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:27px;letter-spacing:-.03em;color:#E8C943;line-height:1">${m.v}</div><div style="font-size:12.5px;line-height:1.4;color:#9a9e99;margin-top:6px">${m.t}</div></div>`).join('');
    const tags = p.tags.map((t) => `<span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;border:1px solid #3a403e;color:#c4c6c1;padding:5px 9px">${t}</span>`).join('');
    return `<article style="background:#111516;border:1px solid #242928;position:relative;padding:28px 26px 26px">
<i style="position:absolute;left:-1px;top:-1px;width:14px;height:14px;border-left:2px solid #E39B36;border-top:2px solid #E39B36"></i>
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
  return `<section id="projects" aria-label="How I Work" style="background-color:#080A0B;padding:0 24px clamp(40px,6vw,80px);${GRID_BG}">
${planetHeader('repeating-linear-gradient(176deg,rgba(0,0,0,.28) 0 10px,transparent 10px 40px),radial-gradient(circle,rgba(240,170,70,.95) 0 1.2px,transparent 1.7px) 0 0/38px 26px,radial-gradient(circle,rgba(232,201,67,.75) 0 1px,transparent 1.5px) 17px 11px/53px 31px,radial-gradient(ellipse 80% 30vh at 50% 0,#454a47 0,#2a2e2c 25%,#161918 55%,#0c0e0d 80%,#080A0B 100%)', '0 -2px 12px rgba(227,155,54,.5),0 -16px 60px rgba(227,155,54,.16)', '#080A0B', 'THE FORGE')}
<div style="max-width:1180px;margin:0 auto;padding-top:clamp(36px,5vw,64px)">
<h2 style="${H2};max-width:780px">How I approach difficult problems.</h2>
<p style="margin:0 0 56px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#b8bbb6;max-width:640px">The outcomes matter. So does the path to get there: understanding the problem, aligning people, making trade-offs, and learning from what happens next.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,500px),1fr));gap:20px;align-items:start">${cards}</div>
</div>
</section>`;
}

function experienceHTML() {
  const jobs = JOBS.map((j, i) => {
    const open = i === 0, can = j.items.length > 0;
    return `<li style="position:relative;padding:0 0 38px 64px">
<span class="node${open && can ? ' open' : ''}">${String(i + 1).padStart(2, '0')}</span>
<div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.16em;color:#b9701a;margin-bottom:6px">${j.org}</div>
<h3 style="margin:0 0 8px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(21px,3vw,26px);letter-spacing:-.025em;line-height:1.15">${j.role}</h3>
<p style="margin:0;font-size:16px;line-height:1.6;color:#2f3432">${j.sum}</p>
${can ? `<button type="button" class="jobbtn" data-toggle="job" data-open="Highlights" data-close="Hide highlights" aria-expanded="${open}" aria-controls="job-${i}"><span class="t">${open ? 'Hide highlights' : 'Highlights'}</span><span class="s" aria-hidden="true">${open ? '−' : '+'}</span></button>
<ul id="job-${i}"${open ? '' : ' hidden'} style="margin:16px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px">${j.items.map((it) => `<li style="display:grid;grid-template-columns:14px 1fr;font-size:15px;line-height:1.5;color:#2f3432"><i style="width:6px;height:6px;background:#E39B36;margin-top:8px"></i><span>${it}</span></li>`).join('')}</ul>` : ''}
</li>`;
  }).join('');
  const caps = CAPS.map((c, i) => `<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.06em;margin-bottom:7px"><span>${c}</span><span class="pct" style="--i:${i};color:#E39B36">100%</span></div><div style="position:relative;height:10px;background:#242928"><div class="skbar" style="--i:${i};position:absolute;left:0;top:0;bottom:0;background:#E39B36"></div><div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 12px,#111516 12px 14px)"></div></div></div>`).join('');
  const edu = EDU.map((e) => `<div style="padding:20px 0;border-bottom:1px solid rgba(22,25,24,.2)"><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;letter-spacing:-.025em;line-height:1.15;margin-bottom:6px">${e.school}</div><div style="font-size:15px;color:#2f3432;line-height:1.5">${e.a}</div><div style="font-family:'DM Mono',monospace;font-size:12px;color:#666B68;margin-top:4px">${e.b}</div></div>`).join('');
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
    ? `<article style="grid-column:1/-1;background:#111516;border:1px solid #242928;padding:26px 24px;display:flex;flex-direction:column;gap:14px;min-height:190px"><span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;color:#E39B36">${s.n}</span><h3 style="margin:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;letter-spacing:-.025em;line-height:1.1">${s.t}</h3><p style="margin:0;font-size:15.5px;line-height:1.6;color:#b8bbb6">${s.d}</p><div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:auto">${s.href ? `<a class="hbtn" href="${s.href}" target="_blank" rel="noopener" style="margin-right:8px;color:#E8C943">${s.cta || 'Play it'} ↗</a>` : ''}${s.tags.map((t) => `<span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;border:1px solid #3a403e;color:#c4c6c1;padding:5px 9px">${t}</span>`).join('')}</div></article>`
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
    { label: 'EMAIL', value: CONFIG.email, href: CONFIG.email && 'mailto:' + CONFIG.email },
    { label: 'LINKEDIN', value: 'LinkedIn', href: CONFIG.linkedin },
    { label: 'GITHUB', value: 'GitHub', href: CONFIG.github },
    { label: 'SUBSTACK', value: 'Substack', href: CONFIG.substack }
  ].filter((l) => l.href).map((l) => `<a class="clink" href="${esc(l.href)}"${l.label === 'EMAIL' ? '' : ' target="_blank" rel="noopener"'}><span style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.16em;color:#E39B36">${l.label}</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(20px,3.4vw,32px);letter-spacing:-.025em">${esc(l.value)} ↗</span></a>`).join('');
  return `<section id="contact" aria-label="Contact" style="position:relative;background:#020405;overflow:hidden;padding:clamp(100px,14vw,170px) 24px">
<div style="${SF.C2}"></div>
<div aria-hidden="true" style="position:absolute;left:50%;top:50%;width:min(90vw,820px);aspect-ratio:1/1;margin:calc(min(90vw,820px) / -2) 0 0 calc(min(90vw,820px) / -2);border-radius:50%;border:1px solid rgba(231,232,228,.1);animation:spin 70s linear infinite"><i style="position:absolute;left:50%;top:-5px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#E39B36;box-shadow:0 0 14px #E39B36"></i></div>
<div style="position:relative;max-width:760px;margin:0 auto;text-align:center">
<h2 style="${H2.replace('clamp(36px,6vw,68px)', 'clamp(36px,6.4vw,72px)')}">Every good journey starts with a conversation.</h2>
<p style="margin:0 auto 48px;font-size:clamp(16px,2vw,19px);line-height:1.65;color:#b8bbb6;max-width:520px">I’m always glad to meet curious people working on meaningful problems. Let’s connect.</p>
<div style="display:flex;flex-direction:column;border-top:1px solid rgba(231,232,228,.18);text-align:left">${links}</div>
</div>
</section>`;
}

/* ================= home ================= */
function homeHTML() {
  const L = bits(5), R = bits(9);
  const left = L.map((b, i) => `<div style="${b.box}">${i === 1 ? '<button type="button" id="replay" class="replay" aria-label="Replay intro animation" title="Replay intro">↻</button>' : `<i style="${b.inner}"></i>`}</div>`).join('');
  const right = R.map((b) => `<div style="${b.box}"><i style="${b.inner}"></i></div>`).join('');
  const keys = DEST.map((d, i) => `<button type="button" class="key" data-i="${i}" aria-label="${esc(d.t + ' — ' + d.s)}">
<span style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-family:'DM Mono',monospace;font-size:13px;color:#E39B36;letter-spacing:.1em">${d.n}</span><span class="led"></span></span>
<span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:18px;letter-spacing:-.02em;margin-bottom:6px">${d.t}</span>
<span style="display:block;font-size:12px;line-height:1.35;color:#aeb2ad">${d.s}</span></button>`).join('');
  const ring = [0, 0.8, 1.6].map((d) => `<i style="position:absolute;inset:0;border-radius:50%;border:2px solid #65B9D0;animation:ping 2.4s ease-out ${d}s infinite"></i>`).join('');
  return `<div id="homeWrap" style="position:relative;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 100%,#0a1012 0,#020405 70%)">
${stars('A', 'B', 'C')}
<div id="beam" aria-hidden="true"></div>
<section id="home" aria-label="Home" style="position:relative;overflow:hidden;background:transparent;transition:height 1.6s cubic-bezier(.6,0,.2,1)">
<div id="crawl" data-crawlwrap="" style="position:absolute;inset:0;perspective:360px;perspective-origin:50% 0%;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 22%);mask-image:linear-gradient(to bottom,transparent 0,#000 22%)">
<div id="crawlText" style="position:absolute;top:100%;left:0;right:0;margin:0 auto;width:min(1000px,92vw);transform-origin:50% 0;animation:crawl 26s linear .5s both;text-align:center;color:#E8C943;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(26px,4.6vw,60px);line-height:1.45;letter-spacing:-.005em;padding-bottom:40px">
<p style="margin:0 0 1.4em;font-size:.85em;letter-spacing:.04em;text-transform:uppercase">A long time ago, in a career not so far away...</p>
<h1 style="margin:0 0 1em;font-size:2.6em;line-height:1;letter-spacing:-.03em;text-transform:uppercase;font-weight:700">Andrea Mayo</h1>
<p style="margin:0 0 1.2em;text-align:justify">Armed with a background in finance and endless curiosity, she has spent years exploring businesses, solving complex problems, and finding ways to make things work better.</p>
<p style="margin:0 0 1.4em;text-align:justify">Now setting her sights on Product Management, she is ready to explore the intersection of technology, people, and meaningful solutions.</p>
<p style="margin:0;font-size:.85em;letter-spacing:.04em;text-transform:uppercase">The journey continues...</p>
</div></div>
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
<div aria-live="polite" role="status" style="flex:1;background:#050607;border:1px solid #3a403e;border-radius:3px;padding:6px 10px;font-family:'DM Mono',monospace;font-size:13px;line-height:1.4;color:#E7E8E4">${droidIcon}<span style="color:#65B9D0;letter-spacing:.1em;margin-right:8px">MVP-8</span><span id="droidText">Where to, pilot? I recommend the projects.</span></div>
</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${keys}</div>
<div aria-hidden="true" style="height:7px;background:repeating-linear-gradient(90deg,#050606 0 4px,#252a28 4px 7px)"></div>
</div></div>
</div>
</section>
</div>`;
}

function heroHTML() {
  const link = (href, label) => href ? `<a class="hbtn" href="${esc(href)}"${label === 'Email' ? '' : ' target="_blank" rel="noopener"'}>${label}</a>` : '';
  const photo = `<img class="photo" src="${esc(CONFIG.photo)}" alt="Portrait of Andrea Mayo" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',textContent:'Add ${esc(CONFIG.photo)}'}))">`;
  const corners = ['top:-1px;left:-1px;border-width:2px 0 0 2px', 'top:-1px;right:-1px;border-width:2px 2px 0 0', 'bottom:-1px;left:-1px;border-width:0 0 2px 2px', 'bottom:-1px;right:-1px;border-width:0 2px 2px 0'].map((c) => `<i style="position:absolute;${c};width:12px;height:12px;border-color:#65B9D0;border-style:solid"></i>`).join('');
  return `<div style="position:relative;width:min(1040px,100%)">
<div style="position:relative;padding:14px 26px 18px;border:1px solid rgba(101,185,208,.55);background:linear-gradient(rgba(101,185,208,.10),rgba(101,185,208,.03));box-shadow:0 0 40px rgba(101,185,208,.18),inset 0 0 40px rgba(101,185,208,.06);transform-origin:50% 100%;animation:holoIn 1.6s ease both">
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(101,185,208,.07) 0 1px,transparent 1px 3px)"></div>
${corners}
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 40px">
<div style="flex:1 1 360px;max-width:620px;color:#E8C943;animation:glitch 2.8s steps(1) 1s both">
<div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.24em;margin-bottom:10px;opacity:.85">WHO I AM</div>
<h1 style="margin:0 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(28px,3.8vw,52px);line-height:.92;letter-spacing:-.04em;text-transform:uppercase">Andrea Mayo</h1>
<p style="margin:0 0 8px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(13.5px,1.4vw,17px);line-height:1.45">Armed with a background in finance and endless curiosity, she has spent years exploring businesses, solving complex problems, and finding ways to make things work better.</p>
<p style="margin:0 0 10px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(13.5px,1.4vw,17px);line-height:1.45">Now setting her sights on Product Management, she is ready to explore the intersection of technology, people, and meaningful solutions.</p>
<div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.2em;margin-bottom:12px">THE JOURNEY CONTINUES...</div>
<div style="display:flex;flex-wrap:wrap;gap:12px">${link(CONFIG.email && 'mailto:' + CONFIG.email, 'Email')}${link(CONFIG.linkedin, 'LinkedIn')}</div>
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
  home.style.height = S.descended ? '48%' : '100%';
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
  const crawl = $('#crawl'); if (crawl) crawl.remove();
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
function setDroid(t) { const el = $('#droidText'); if (el) el.textContent = t; }

function enterHome({ instant }) {
  S.view = 'home';
  main.innerHTML = homeHTML();
  dock.hidden = true; dockSpacer.hidden = true;
  S.descended = instant; S.holo = instant; S.hot = -1; S.active = -1;
  clearTimeout(autoTimer); clearTimeout(holoTimer);
  if (instant) { const c = $('#crawl'); if (c) c.remove(); $('#hero').innerHTML = heroHTML(); }
  else autoTimer = setTimeout(descend, 20500);
  const crawlText = $('#crawlText'); if (crawlText) crawlText.addEventListener('animationend', descend);
  layoutHome(); paintRoute();
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
  dock.innerHTML = `<nav aria-label="Navigation deck" style="width:100%;background:linear-gradient(#2c3230,#0f1211 40%,#050606);border-top:2px solid #8a918d;border-radius:50% 50% 0 0 / 30px 30px 0 0;padding:20px clamp(16px,4vw,56px) 10px;display:flex;flex-direction:column;gap:10px;box-shadow:0 -14px 34px rgba(0,0,0,.75)">
<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:stretch">
<button type="button" class="homebtn" data-i="-1" aria-label="Home — back to the start"><i aria-hidden="true" style="position:absolute;top:7px;width:6px;height:6px;border-radius:50%;background:#65B9D0;box-shadow:0 0 8px #65B9D0"></i><span style="margin-top:8px">HOME</span></button>
${DEST.map((d, i) => `<button type="button" class="dkey" data-i="${i}" aria-label="${esc(d.t + ' — ' + d.s)}"><span style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;letter-spacing:-.01em">${d.t}</span><span class="led"></span></span></button>`).join('')}
</div>
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 24px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.06em;color:#8d928e;border-top:1px solid rgba(231,232,228,.12);padding-top:8px"><span>Andrea Mayo © 2026</span><span style="display:inline-flex;align-items:center">${droidIcon}Built with curiosity. Navigated by MVP-8.</span></div>
</nav>`;
  $$('button', dock).forEach((b) => b.addEventListener('click', () => travel(+b.dataset.i)));
}

function paintDock() {
  $$('.dkey', dock).forEach((b) => {
    const cur = DEST[+b.dataset.i].id === S.view;
    b.classList.toggle('cur', cur);
    if (cur) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  dock.classList.toggle('open', S.dockOpen);
}

function enterSection(id) {
  S.view = id;
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
    if (group === 'job') x.closest('li').querySelector('.node').classList.toggle('open', open);
  });
});

/* ================= travel (hyperspace) ================= */
function warpHTML(label) {
  const lines = Array.from({ length: 44 }, (_, i) => {
    const r = rnd(i + 7);
    const outer = st({ position: 'absolute', left: '50%', top: '50%', width: '75vmax', height: 2, transformOrigin: '0 50%', transform: 'rotate(' + (i * 360 / 44 + r() * 4) + 'deg)' });
    const inner = st({ width: (45 + r() * 55) + '%', height: '100%', background: 'linear-gradient(90deg,transparent,#65B9D0 55%,#E7E8E4)', transformOrigin: '0 50%', animation: 'warpLine ' + (0.6 + r() * 0.3) + 's ' + (r() * 0.15) + 's ease-in both' });
    return `<div style="${outer}"><div style="${inner}"></div></div>`;
  }).join('');
  return `<div role="status" aria-live="assertive" style="position:fixed;inset:0;z-index:500;background:#020405;overflow:hidden;animation:warpBox .95s ease both">${lines}
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center"><div style="font-family:'DM Mono',monospace;font-size:13px;letter-spacing:.3em;color:#E8C943">ROUTE LOCKED</div><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(34px,7vw,72px);letter-spacing:-.04em;color:#E7E8E4;text-shadow:0 0 30px #020405,0 0 10px #020405">${esc(label)}</div></div></div>`;
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
  setTimeout(() => { warp.innerHTML = warpHTML(label); warp.hidden = false; paintRoute(); }, t0);
  setTimeout(arrive, d ? 640 : 480);
  setTimeout(() => { warp.hidden = true; warp.innerHTML = ''; S.warping = false; }, d ? 1110 : 950);
}

/* ================= global listeners ================= */
dock.addEventListener('mouseenter', () => { S.overDock = true; if (!S.dockOpen) { S.dockOpen = true; paintDock(); } });
dock.addEventListener('mouseleave', () => { S.overDock = false; if (scrollY > 40 && S.dockOpen) { S.dockOpen = false; paintDock(); } });
dock.addEventListener('focusin', () => { S.overDock = true; if (!S.dockOpen) { S.dockOpen = true; paintDock(); } });
dock.addEventListener('focusout', () => { S.overDock = false; });

addEventListener('scroll', () => {
  if (S.view !== 'home') {
    if (scrollY > 40 && !S.overDock && S.dockOpen) { S.dockOpen = false; paintDock(); }
    else if (scrollY <= 40 && !S.dockOpen) { S.dockOpen = true; paintDock(); }
  }
}, { passive: true });
addEventListener('mousemove', (e) => {
  if (S.view !== 'home' && !S.dockOpen && e.clientY > innerHeight - 48) { S.overDock = true; S.dockOpen = true; paintDock(); }
});
addEventListener('resize', layoutHome);

/* ================= boot ================= */
buildDock();
enterHome({ instant: reduced() });
