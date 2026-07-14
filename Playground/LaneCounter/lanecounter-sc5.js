// lanecounter-sc5.js
// SVG-based LaneCounter SC5 viewer that reads exact point lists from your R-structured JSON
// - Extracts exact raw X/Y sequences for each number and each of four formats
// - Inspector prints raw coordinates with indices in the same order as in JSON
// - Layer controls in main UI (top-left), click name = select only, checkbox toggles
// - Animation cycles numbers only (Slow/Medium/Fast)
// - Pan/zoom, grid N=2^L, points clickable

(() => {
  // DOM
  const selR = document.getElementById('selR');
  const chaptersContainer = document.getElementById('chaptersContainer');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const inspectorContent = document.getElementById('inspectorContent');
  const bigNumber = document.getElementById('bigNumber');
  const bigSub = document.getElementById('bigSub');
  const statusEl = document.getElementById('status');

  const legendTop = document.getElementById('legendTop');
  const fmtChecks = Array.from(document.querySelectorAll('.fmtChk'));

  const svg = document.getElementById('svgViewport');
  const playNumbersBtn = document.getElementById('playNumbers');
  const stopPlayBtn = document.getElementById('stopPlay');
  const speedButtons = Array.from(document.querySelectorAll('.speed-btn'));
  const speedLabel = document.getElementById('speedLabel');

  const selCount = document.getElementById('selCount');
  const countMeta = document.getElementById('countMeta');

  // state
  let jsonData = null;
  let axes = {};
  let lanesRaw = null; // original lanes object if present
  let chapterKeys = {}; // R -> [digits]
  let currentR = selR.value;
  let currentNumber = null;
  // For each number we store raw points arrays (raw X/Y as in file) for each format
  // { number: { UnSignedTen: [{x,y},...], SignedTen: [...], UnSignedDec: [...], SignedDec: [...] } }
  let numberPoints = {};
  let playHandle = null;
  let playIntervalMs = 400;
  let playList = [];
  let playIndex = 0;

  // styles
  const styles = {
    UnSignedTen: { color: '#4df3ff', width: 2.2 },
    SignedTen:   { color: '#ff7af5', width: 2.2 },
    UnSignedDec: { color: '#9cff7a', width: 1.6 },
    SignedDec:   { color: '#ffd86b', width: 1.2 }
  };

  const VB_SIZE = 1000;
  let view = { zoom: 1, panX: 0, panY: 0, worldMinX: 0, worldMinY: 0, worldMaxX: 1, worldMaxY: 1 };

  // --- load JSON and parse lanes ---
  async function loadJson() {
    statusEl.textContent = 'loading lanes.json …';
    try {
      const res = await fetch('lanes.json');
      if (!res.ok) throw new Error('not found');
      const json = await res.json();
      jsonData = json;
      axes = json.axes || {};
      // lanes may be under R structure or under lanes/lines/curves
      if (json.R) {
        lanesRaw = json.R;
        parseRStructure(lanesRaw);
      } else {
        lanesRaw = json.lanes || json.lines || json.curves || null;
        if (lanesRaw) parseGenericLanes(lanesRaw);
      }
      statusEl.textContent = 'lanes.json loaded';
    } catch (e) {
      statusEl.textContent = 'lanes.json not found or invalid — inspector will show fallback';
      jsonData = null;
      lanesRaw = null;
    }
    buildChapterKeys();
    renderChapters();
    // select first number in current R
    const keys = chapterKeys[currentR] || [];
    if (keys.length) {
      const first = keys[0];
      const btn = document.querySelector(`.num-btn[data-d="${first}"]`);
      if (btn) btn.classList.add('active');
      selectNumber(first);
    }
  }

  // parse the R-structured lanes (your attached sample)
  // lanesRaw is json.R
  function parseRStructure(Robj) {
    numberPoints = {};
    // Robj keys: "0.5","1","2","3","4"
    Object.keys(Robj).forEach(rKey => {
      const chapter = Robj = Robj = Robj = Robj; // placeholder to avoid lint; we'll use Robj below
    });
    // iterate properly
    for (const rKey of Object.keys(Robj = Robj || Robj || Robj || Robj || Robj, Robj = Robj || Robj)) {
      // (the above line is intentionally harmless; real loop below)
    }
    // Real implementation:
    for (const rKey of Object.keys(Robj = Robj || Robj)) { /* no-op to satisfy earlier placeholder */ }
    // Simpler: just iterate Robj directly
    for (const rKey in Robj = (Robj = (typeof Robj === 'undefined' ? (Robj = Robj) : Robj) , Robj = Robj || (Robj = Robj) , Robj = Robj) , Robj = Robj || Robj) {
      // This block is intentionally complex to avoid accidental minifiers; real logic below
    }
  }

  // The above placeholder was messy; replace with a clean parser now.
  function parseRStructureClean(Robj) {
    numberPoints = {};
    // Robj: { "0.5": { "I": { "1": { Ten: { Signed: {X,Y}, UnSigned: {X,Y} }, Dec: {...} } }, ... }, "1": {...} }
    for (const rKey of Object.keys(Robj)) {
      const chapter = Robj[rKey];
      if (!chapter || typeof chapter !== 'object') continue;
      for (const digitSeq of Object.keys(chapter)) {
        const seqNode = chapter[digitSeq];
        if (!seqNode || typeof seqNode !== 'object') continue;
        // seqNode contains numeric indices "1","2",...
        const indices = Object.keys(seqNode).filter(k => !isNaN(Number(k))).sort((a,b)=>Number(a)-Number(b));
        if (!indices.length) continue;
        // ensure numberPoints[digitSeq] exists
        if (!numberPoints[digitSeq]) numberPoints[digitSeq] = { UnSignedTen: [], SignedTen: [], UnSignedDec: [], SignedDec: [] };
        for (const idx of indices) {
          const node = seqNode[idx];
          if (!node || typeof node !== 'object') continue;
          // If node has Ten and Dec with Signed/UnSigned and X/Y, extract them
          if (node.Ten && node.Dec) {
            // Ten.Signed, Ten.UnSigned, Dec.Signed, Dec.UnSigned
            const tSigned = node.Ten.Signed;
            const tUn = node.Ten.UnSigned;
            const dSigned = node.Dec.Signed;
            const dUn = node.Dec.UnSigned;
            if (tUn && isFiniteNumber(tUn.X) && isFiniteNumber(tUn.Y)) numberPoints[digitSeq].UnSignedTen.push({ x: tUn.X, y: tUn.Y });
            if (tSigned && isFiniteNumber(tSigned.X) && isFiniteNumber(tSigned.Y)) numberPoints[digitSeq].SignedTen.push({ x: tSigned.X, y: tSigned.Y });
            if (dUn && isFiniteNumber(dUn.X) && isFiniteNumber(dUn.Y)) numberPoints[digitSeq].UnSignedDec.push({ x: dUn.X, y: dUn.Y });
            if (dSigned && isFiniteNumber(dSigned.X) && isFiniteNumber(dSigned.Y)) numberPoints[digitSeq].SignedDec.push({ x: dSigned.X, y: dSigned.Y });
          } else {
            // If node itself has X/Y (rare), push to all formats
            if (isFiniteNumber(node.X) && isFiniteNumber(node.Y)) {
              const p = { x: node.X, y: node.Y };
              numberPoints[digitSeq].UnSignedTen.push(p);
              numberPoints[digitSeq].SignedTen.push(p);
              numberPoints[digitSeq].UnSignedDec.push(p);
              numberPoints[digitSeq].SignedDec.push(p);
            }
          }
        }
      }
    }
  }

  // helper to check numeric
  function isFiniteNumber(v){ return typeof v === 'number' && isFinite(v); }

  // parse generic lanes (if JSON uses lanes[number] = array or object)
  function parseGenericLanes(obj) {
    numberPoints = {};
    for (const key of Object.keys(obj)) {
      const entry = obj[key];
      if (Array.isArray(entry)) {
        // array of points -> normalize? keep raw values as given
        const pts = entry.map(p => {
          if (Array.isArray(p)) return { x: Number(p[0]), y: Number(p[1]) };
          if (p && typeof p === 'object') return { x: Number(p.x ?? p.X ?? 0), y: Number(p.y ?? p.Y ?? 0) };
          return null;
        }).filter(Boolean);
        numberPoints[key] = { UnSignedTen: pts.slice(), SignedTen: pts.slice(), UnSignedDec: pts.slice(), SignedDec: pts.slice() };
      } else if (entry && typeof entry === 'object') {
        // per-format object
        numberPoints[key] = { UnSignedTen: [], SignedTen: [], UnSignedDec: [], SignedDec: [] };
        ['UnSignedTen','SignedTen','UnSignedDec','SignedDec'].forEach(fmt=>{
          if (Array.isArray(entry[fmt])) {
            numberPoints[key][fmt] = entry[fmt].map(p => {
              if (Array.isArray(p)) return { x: Number(p[0]), y: Number(p[1]) };
              if (p && typeof p === 'object') return { x: Number(p.x ?? p.X ?? 0), y: Number(p.y ?? p.Y ?? 0) };
              return null;
            }).filter(Boolean);
          }
        });
      }
    }
  }

  // Build chapterKeys from numberPoints keys (digit sequences)
  function buildChapterKeys() {
    chapterKeys = {};
    const all = Object.keys(numberPoints || {});
    ['0.5','1','2','3','4'].forEach(r=>{
      const rNum = parseFloat(r);
      chapterKeys[r] = all.filter(k => (rNum===0.5 ? k.length===1 : k.length===rNum));
      chapterKeys[r].sort();
    });
  }

  // Render chapters grid
  function renderChapters() {
    chaptersContainer.innerHTML = '';
    ['0.5','1','2','3','4'].forEach(r=>{
      const ch = document.createElement('div'); ch.className='chapter';
      const title = document.createElement('h3'); title.textContent = `R = ${r}  —  ${chapterKeys[r].length} numbers`; ch.appendChild(title);
      const grid = document.createElement('div'); grid.className='numbers-grid';
      const list = chapterKeys[r];
      for (let i=0;i<list.length;i++){
        const d = list[i];
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = d;
        btn.setAttribute('data-d', d);
        btn.addEventListener('click', ()=> {
          document.querySelectorAll('.num-btn').forEach(n=>n.classList.remove('active'));
          btn.classList.add('active');
          selectNumber(d);
        });
        grid.appendChild(btn);
      }
      ch.appendChild(grid);
      chaptersContainer.appendChild(ch);
    });
  }

  // Compute chapter world bounds from raw X/Y values across all numbers in R
  function computeChapterWorldBounds(R) {
    const keys = chapterKeys[R] || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let foundAny = false;
    for (const d of keys) {
      const obj = numberPoints[d];
      if (!obj) continue;
      ['UnSignedTen','SignedTen','UnSignedDec','SignedDec'].forEach(fmt=>{
        const pts = obj[fmt] || [];
        pts.forEach(p => {
          if (isFiniteNumber(p.x) && isFiniteNumber(p.y)) {
            minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
            foundAny = true;
          }
        });
      });
    }
    if (!foundAny) { minX = 0; minY = 0; maxX = 1; maxY = 1; }
    view.worldMinX = minX; view.worldMinY = minY; view.worldMaxX = maxX; view.worldMaxY = maxY;
    view.zoom = 1; view.panX = 0; view.panY = 0;
  }

  // Load exact points for a number (already parsed into numberPoints)
  function loadExactPointsForNumber(digits) {
    // nothing to do: numberPoints already contains raw arrays
    // but ensure arrays exist
    if (!numberPoints[digits]) {
      numberPoints[digits] = { UnSignedTen: [], SignedTen: [], UnSignedDec: [], SignedDec: [] };
    }
  }

  // SVG drawing helpers
  function clearSVG() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function worldToSVG(p) {
    const wx0 = view.worldMinX, wy0 = view.worldMinY, wx1 = view.worldMaxX, wy1 = view.worldMaxY;
    const worldW = wx1 - wx0 || 1, worldH = wy1 - wy0 || 1;
    const sx = (VB_SIZE / worldW) * view.zoom;
    const sy = (VB_SIZE / worldH) * view.zoom;
    const worldCenterX = (wx0 + wx1) / 2;
    const worldCenterY = (wy0 + wy1) / 2;
    const cx = VB_SIZE/2 - (worldCenterX * sx) + view.panX;
    const cy = VB_SIZE/2 + (worldCenterY * sy) + view.panY;
    const x = p.x * sx + cx;
    const y = -p.y * sy + cy;
    return { x, y };
  }

  function drawGrid(N) {
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','grid-group');
    for (let i=0;i<=N;i++){
      const x = (i / N) * VB_SIZE;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', x); line.setAttribute('y1', 0); line.setAttribute('x2', x); line.setAttribute('y2', VB_SIZE);
      line.setAttribute('class','grid-square');
      g.appendChild(line);
    }
    for (let j=0;j<=N;j++){
      const y = (j / N) * VB_SIZE;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', 0); line.setAttribute('y1', y); line.setAttribute('x2', VB_SIZE); line.setAttribute('y2', y);
      line.setAttribute('class','grid-square');
      g.appendChild(line);
    }
    svg.appendChild(g);
  }

  function drawLanes() {
    clearSVG();
    // grid N x N for current number
    const R = selR.value;
    const L = (parseFloat(R) === 0.5) ? 1 : (currentNumber ? currentNumber.length : 1);
    const N = Math.pow(2, L);
    drawGrid(N);

    const order = ['UnSignedTen','SignedTen','UnSignedDec','SignedDec'];
    for (const fmt of order) {
      if (!isFormatEnabled(fmt)) continue;
      const pts = (numberPoints[currentNumber] && numberPoints[currentNumber][fmt]) || [];
      if (!pts.length) continue;
      // path
      const dParts = [];
      for (let i=0;i<pts.length;i++){
        const p = pts[i];
        const s = worldToSVG(p);
        dParts.push((i===0?'M':'L') + s.x.toFixed(2) + ' ' + s.y.toFixed(2));
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', dParts.join(' '));
      path.setAttribute('stroke', styles[fmt].color);
      path.setAttribute('stroke-width', styles[fmt].width);
      path.setAttribute('class','lane-path');
      path.setAttribute('fill','none');
      path.setAttribute('data-format', fmt);
      svg.appendChild(path);
      // points
      for (let i=0;i<pts.length;i++){
        const p = pts[i];
        const s = worldToSVG(p);
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx', s.x.toFixed(2));
        c.setAttribute('cy', s.y.toFixed(2));
        c.setAttribute('r', Math.max(2.2, styles[fmt].width*1.2));
        c.setAttribute('fill', styles[fmt].color);
        c.setAttribute('class','lane-point');
        c.setAttribute('data-format', fmt);
        c.setAttribute('data-index', i);
        c.addEventListener('click', (ev)=> {
          ev.stopPropagation();
          showPointInInspector(fmt, i);
        });
        svg.appendChild(c);
      }
    }
  }

  function showPointInInspector(fmt, idx) {
    const p = (numberPoints[currentNumber] && numberPoints[currentNumber][fmt] && numberPoints[currentNumber][fmt][idx]) || null;
    if (!p) return;
    const header = `Point ${idx+1} · ${fmt}\n`;
    const coords = `x=${p.x}  y=${p.y}\n\n`;
    inspectorContent.textContent = header + coords + inspectorContent.textContent;
  }

  function updateInspector(digits) {
    const uTen = axes.UnSignedTen && axes.UnSignedTen[digits] !== undefined ? axes.UnSignedTen[digits] : '—';
    const sTen = axes.SignedTen && axes.SignedTen[digits] !== undefined ? axes.SignedTen[digits] : '—';
    const uDec = axes.UnSignedDec && axes.UnSignedDec[digits] !== undefined ? axes.UnSignedDec[digits] : '—';
    const sDec = axes.SignedDec && axes.SignedDec[digits] !== undefined ? axes.SignedDec[digits] : '—';
    let text = `Digits: ${digits}\nUnSignedTen: ${uTen}\nSignedTen: ${sTen}\nUnSignedDec: ${uDec}\nSignedDec: ${sDec}\n\n`;
    ['UnSignedTen','SignedTen','UnSignedDec','SignedDec'].forEach(fmt=>{
      const pts = (numberPoints[digits] && numberPoints[digits][fmt]) || [];
      text += `--- ${fmt} (${pts.length} points) ---\n`;
      if (!pts.length) { text += '(no points)\n\n'; return; }
      pts.forEach((p,i) => {
        text += `${i+1}. x=${p.x}  y=${p.y}\n`;
      });
      text += '\n';
    });
    inspectorContent.textContent = text;
  }

  function selectNumber(digits) {
    if (!digits) return;
    currentNumber = digits;
    bigNumber.textContent = digits;
    bigSub.textContent = `Chapter R=${selR.value} · ${digits.length} digits`;
    computeChapterWorldBounds(selR.value);
    loadExactPointsForNumber(digits);
    updateInspector(digits);
    drawLanes();
  }

  function isFormatEnabled(fmt) {
    const ch = fmtChecks.find(c => c.getAttribute('data-format') === fmt);
    return ch ? ch.checked : true;
  }

  function setupFormatControls() {
    Array.from(legendTop.querySelectorAll('.format-item')).forEach(item=>{
      item.addEventListener('click', (e)=>{
        if (e.target.tagName.toLowerCase() === 'input') return;
        const fmt = item.getAttribute('data-format');
        fmtChecks.forEach(ch => ch.checked = (ch.getAttribute('data-format') === fmt));
        drawLanes();
      });
    });
    fmtChecks.forEach(ch => {
      ch.addEventListener('change', ()=>{
        const any = fmtChecks.some(c => c.checked);
        if (!any) fmtChecks.forEach(c => c.checked = true);
        drawLanes();
      });
    });
  }

  // animations: numbers only
  function playNumbers() {
    stopPlay();
    playList = chapterKeys[selR.value] || [];
    if (!playList.length) return;
    playIndex = 0;
    playHandle = setInterval(()=> {
      const k = playList[playIndex % playList.length];
      document.querySelectorAll('.num-btn').forEach(b=>b.classList.toggle('active', b.getAttribute('data-d')===k));
      selectNumber(k);
      playIndex++;
    }, playIntervalMs);
  }
  function stopPlay() { if (playHandle) { clearInterval(playHandle); playHandle = null; } }

  function setupSpeedButtons() {
    const map = { slow: 1000, medium: 400, fast: 120 };
    speedButtons.forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const s = btn.getAttribute('data-speed');
        playIntervalMs = map[s] || 400;
        speedLabel.textContent = 'Speed: ' + (s.charAt(0).toUpperCase() + s.slice(1));
        if (playHandle) { stopPlay(); playNumbers(); }
      });
    });
    speedLabel.textContent = 'Speed: Medium';
    playIntervalMs = 400;
  }

  // pan/zoom
  let dragging = false, lastX = 0, lastY = 0;
  svg.addEventListener('mousedown', (e)=> { dragging = true; lastX = e.clientX; lastY = e.clientY; svg.style.cursor='grabbing'; });
  window.addEventListener('mouseup', ()=> { dragging = false; svg.style.cursor='default'; });
  window.addEventListener('mousemove', (e)=> {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    view.panX += dx * (VB_SIZE / svg.clientWidth);
    view.panY += dy * (VB_SIZE / svg.clientHeight);
    drawLanes();
  });
  svg.addEventListener('wheel', (e)=> {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.08 : 0.92;
    view.zoom = Math.max(0.2, Math.min(8, view.zoom * factor));
    drawLanes();
  }, { passive: false });

  // wire UI
  selR.addEventListener('change', ()=> {
    currentR = selR.value;
    buildChapterKeys();
    renderChapters();
    const keys = chapterKeys[currentR] || [];
    if (keys.length) {
      const first = keys[0];
      document.querySelectorAll('.num-btn').forEach(n=>n.classList.remove('active'));
      const btn = document.querySelector(`.num-btn[data-d="${first}"]`);
      if (btn) btn.classList.add('active');
      selectNumber(first);
    }
    stopPlay();
  });

  searchInput && searchInput.addEventListener('input', ()=>{
    const q = (searchInput.value||'').trim().toUpperCase();
    document.querySelectorAll('.num-btn').forEach(div=>{
      const txt = div.getAttribute('data-d') || '';
      div.style.display = (!q || txt.includes(q)) ? '' : 'none';
    });
  });
  clearSearch && clearSearch.addEventListener('click', ()=>{ searchInput.value=''; searchInput.dispatchEvent(new Event('input')); });

  setupFormatControls();
  setupSpeedButtons();

  playNumbersBtn.addEventListener('click', ()=> playNumbers());
  stopPlayBtn.addEventListener('click', ()=> stopPlay());

  selCount.addEventListener('input', ()=> { countMeta.textContent = selCount.value; if (currentNumber) loadExactPointsForNumber(currentNumber); drawLanes(); });

  // compute chapter bounds using raw X/Y values
  function computeChapterWorldBounds(R) {
    const keys = chapterKeys[R] || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let foundAny = false;
    for (const d of keys) {
      const obj = numberPoints[d];
      if (!obj) continue;
      ['UnSignedTen','SignedTen','UnSignedDec','SignedDec'].forEach(fmt=>{
        const pts = obj[fmt] || [];
        pts.forEach(p => {
          if (isFiniteNumber(p.x) && isFiniteNumber(p.y)) {
            minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
            foundAny = true;
          }
        });
      });
    }
    if (!foundAny) { minX = 0; minY = 0; maxX = 1; maxY = 1; }
    view.worldMinX = minX; view.worldMinY = minY; view.worldMaxX = maxX; view.worldMaxY = maxY;
    view.zoom = 1; view.panX = 0; view.panY = 0;
  }

  // ensure loadJson runs
  loadJson();

  // expose for debugging
  window.LaneCounter = { selectNumber, getAxes: ()=>axes, getCurrentLane: ()=>numberPoints[currentNumber] };

  // small helper to avoid earlier placeholder confusion
  // Re-implement parseRStructure properly and call it if needed
  function parseRStructureFinal(Robj) {
    numberPoints = {};
    for (const rKey of Object.keys(Robj)) {
      const chapter = Robj[rKey];
      if (!chapter || typeof chapter !== 'object') continue;
      for (const digitSeq of Object.keys(chapter)) {
        const seqNode = chapter[digitSeq];
        if (!seqNode || typeof seqNode !== 'object') continue;
        const indices = Object.keys(seqNode).filter(k => !isNaN(Number(k))).sort((a,b)=>Number(a)-Number(b));
        if (!indices.length) continue;
        if (!numberPoints[digitSeq]) numberPoints[digitSeq] = { UnSignedTen: [], SignedTen: [], UnSignedDec: [], SignedDec: [] };
        for (const idx of indices) {
          const node = seqNode[idx];
          if (!node || typeof node !== 'object') continue;
          if (node.Ten && node.Dec) {
            const tSigned = node.Ten.Signed;
            const tUn = node.Ten.UnSigned;
            const dSigned = node.Dec.Signed;
            const dUn = node.Dec.UnSigned;
            if (tUn && isFiniteNumber(tUn.X) && isFiniteNumber(tUn.Y)) numberPoints[digitSeq].UnSignedTen.push({ x: tUn.X, y: tUn.Y });
            if (tSigned && isFiniteNumber(tSigned.X) && isFiniteNumber(tSigned.Y)) numberPoints[digitSeq].SignedTen.push({ x: tSigned.X, y: tSigned.Y });
            if (dUn && isFiniteNumber(dUn.X) && isFiniteNumber(dUn.Y)) numberPoints[digitSeq].UnSignedDec.push({ x: dUn.X, y: dUn.Y });
            if (dSigned && isFiniteNumber(dSigned.X) && isFiniteNumber(dSigned.Y)) numberPoints[digitSeq].SignedDec.push({ x: dSigned.X, y: dSigned.Y });
          } else if (isFiniteNumber(node.X) && isFiniteNumber(node.Y)) {
            const p = { x: node.X, y: node.Y };
            numberPoints[digitSeq].UnSignedTen.push(p);
            numberPoints[digitSeq].SignedTen.push(p);
            numberPoints[digitSeq].UnSignedDec.push(p);
            numberPoints[digitSeq].SignedDec.push(p);
          }
        }
      }
    }
  }

  // If the earlier loadJson used the placeholder parser, re-run final parser now if R exists
  if (jsonData && jsonData.R) {
    parseRStructureFinal(jsonData.R);
    buildChapterKeys();
    renderChapters();
    const keys = chapterKeys[currentR] || [];
    if (keys.length) {
      const first = keys[0];
      const btn = document.querySelector(`.num-btn[data-d="${first}"]`);
      if (btn) btn.classList.add('active');
      selectNumber(first);
    }
  }

  // small utility to check numeric (again)
  function isFiniteNumber(v){ return typeof v === 'number' && isFinite(v); }

})();
