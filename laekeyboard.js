(function() {
  const container = document.getElementById('laegna-stage');
  let stageWidth = container.clientWidth;
  const stageHeight = 260; // compact: 2 rows, 3 columns

  const stage = new Konva.Stage({
    container: 'laegna-stage',
    width: stageWidth,
    height: stageHeight
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  const bgScreen = '#050806';
  const borderScreen = '#203020';
  const textGreen = '#80ff80';
  const textAmber = '#ffbf60';
  const bulletDark = '#101810';

  const cols = 3;
  const rows = 2;
  const cellWidth = stageWidth / cols;
  const cellHeight = stageHeight / rows;

  // OA state
  let bitsOA = '';
  const MAX_BITS = 64;
  const MAX_VISIBLE = 16;

  function oaToBinary(bits) {
    return bits.replace(/O/g, '0').replace(/A/g, '1');
  }

  // --- SCREENS (top row: col 0,1,2) ---

  function createScreen(colIndex, label) {
    const x = colIndex * cellWidth;
    const y = 0;

    const group = new Konva.Group({ x, y });

    const rect = new Konva.Rect({
      x: 4,
      y: 4,
      width: cellWidth - 8,
      height: cellHeight - 8,
      fill: bgScreen,
      stroke: borderScreen,
      strokeWidth: 1,
      cornerRadius: 4
    });

    const labelText = new Konva.Text({
      x: rect.x() + 6,
      y: rect.y() + 4,
      text: label,
      fontSize: 12,
      fontFamily: 'monospace',
      fill: textAmber
    });

    const digitsGroup = new Konva.Group({
      x: rect.x() + 40,
      y: rect.y() + 6
    });

    const cursor = new Konva.Rect({
      x: rect.x() + 40,
      y: rect.y() + 10,
      width: 2,
      height: 24,
      fill: textGreen
    });

    const ellipsis = new Konva.Text({
      x: rect.x() + rect.width() - 24,
      y: rect.y() + 14,
      text: '…',
      fontSize: 18,
      fontFamily: 'monospace',
      fill: '#304030'
    });

    group.add(rect);
    group.add(labelText);
    group.add(digitsGroup);
    group.add(cursor);
    group.add(ellipsis);

    const blink = new Konva.Animation((frame) => {
      const t = (frame.time % 1000) / 1000;
      cursor.opacity(t < 0.5 ? 1 : 0);
    }, layer);
    blink.start();

    layer.add(group);

    return { group, rect, digitsGroup, cursor, ellipsis };
  }

  const screen2 = createScreen(0, '2');
  const screen4 = createScreen(1, '4');
  const screen16 = createScreen(2, '16');

  // --- KEYBOARDS (bottom row: col 0,1,2) ---

  function createKeyboard(colIndex, keys) {
    const x = colIndex * cellWidth;
    const y = cellHeight;

    const group = new Konva.Group({ x, y });

    const rect = new Konva.Rect({
      x: 4,
      y: 4,
      width: cellWidth - 8,
      height: cellHeight - 8,
      fill: '#050806',
      stroke: borderScreen,
      strokeWidth: 1,
      cornerRadius: 4
    });

    group.add(rect);

    const keyWidth = (rect.width() - 16) / keys.length;
    const keyHeight = rect.height() - 16;

    const keyObjects = [];

    keys.forEach((label, i) => {
      const kx = rect.x() + 8 + i * keyWidth;
      const ky = rect.y() + 8;

      const kRect = new Konva.Rect({
        x: kx,
        y: ky,
        width: keyWidth - 4,
        height: keyHeight,
        fill: '#101810',
        stroke: '#304030',
        strokeWidth: 1,
        cornerRadius: 4,
        shadowColor: '#000',
        shadowBlur: 6,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.6
      });

      const bullet = new Konva.Circle({
        x: kx + (keyWidth - 4) / 2,
        y: ky + 10,
        radius: 5,
        fill: '#101810',
        stroke: bulletDark,
        strokeWidth: 1
      });

      const text = new Konva.Text({
        x: kx,
        y: ky + 20,
        width: keyWidth - 4,
        align: 'center',
        text: label,
        fontSize: 16,
        fontFamily: 'monospace',
        fill: textGreen
      });

      group.add(kRect);
      group.add(bullet);
      group.add(text);

      keyObjects.push({ rect: kRect, text, label });
    });

    layer.add(group);

    return { group, keys: keyObjects };
  }

  // Base‑2 keyboard: O, A, ⟵
  const kb2 = createKeyboard(0, ['O', 'A', '⟵']);
  // Base‑4 keyboard: 0,1,2,3
  const kb4 = createKeyboard(1, ['0', '1', '2', '3']);
  // Base‑16 keyboard: 0–F (compact: 0,4,8,C)
  const kb16 = createKeyboard(2, ['0', '4', '8', 'C']);

  // --- Rendering logic ---

  function renderScreenBase2() {
    screen2.digitsGroup.destroyChildren();
    const visible = bitsOA.slice(0, MAX_VISIBLE);
    visible.split('').forEach((ch, i) => {
      const x = i * 22;
      const cell = new Konva.Rect({
        x,
        y: 0,
        width: 20,
        height: 28,
        fill: '#101810',
        stroke: '#304030',
        strokeWidth: 1,
        cornerRadius: 2
      });
      const bullet = new Konva.Circle({
        x: x + 10,
        y: 8,
        radius: 4,
        fill: ch === 'O' ? '#0f0f0f' : '#f0f0f0',
        stroke: bulletDark,
        strokeWidth: 1
      });
      const txt = new Konva.Text({
        x,
        y: 14,
        width: 20,
        align: 'center',
        text: ch,
        fontSize: 12,
        fontFamily: 'monospace',
        fill: textGreen
      });
      screen2.digitsGroup.add(cell);
      screen2.digitsGroup.add(bullet);
      screen2.digitsGroup.add(txt);
    });
    screen2.ellipsis.fill(bitsOA.length > MAX_VISIBLE ? textAmber : '#304030');
  }

  function renderScreenBase4() {
    screen4.digitsGroup.destroyChildren();
    const bin = oaToBinary(bitsOA);
    const groups = [];
    for (let i = 0; i < bin.length; i += 2) {
      groups.push(bin.slice(i, i + 2));
    }
    const visible = groups.slice(0, MAX_VISIBLE);
    visible.forEach((g, i) => {
      const x = i * 22;
      const val = parseInt(g.padEnd(2, '0'), 2);
      const cell = new Konva.Rect({
        x,
        y: 0,
        width: 20,
        height: 28,
        fill: '#101810',
        stroke: '#304030',
        strokeWidth: 1,
        cornerRadius: 2
      });
      const bullet = new Konva.Circle({
        x: x + 10,
        y: 8,
        radius: 4,
        fill: '#101810',
        stroke: bulletDark,
        strokeWidth: 1
      });
      const txt = new Konva.Text({
        x,
        y: 14,
        width: 20,
        align: 'center',
        text: val.toString(4).toUpperCase(),
        fontSize: 12,
        fontFamily: 'monospace',
        fill: textGreen
      });
      screen4.digitsGroup.add(cell);
      screen4.digitsGroup.add(bullet);
      screen4.digitsGroup.add(txt);
    });
    screen4.ellipsis.fill(groups.length > MAX_VISIBLE ? textAmber : '#304030');
  }

  function renderScreenBase16() {
    screen16.digitsGroup.destroyChildren();
    const bin = oaToBinary(bitsOA);
    const groups = [];
    for (let i = 0; i < bin.length; i += 4) {
      groups.push(bin.slice(i, i + 4));
    }
    const visible = groups.slice(0, MAX_VISIBLE);
    visible.forEach((g, i) => {
      const x = i * 22;
      const val = parseInt(g.padEnd(4, '0'), 2);
      const cell = new Konva.Rect({
        x,
        y: 0,
        width: 20,
        height: 28,
        fill: '#101810',
        stroke: '#304030',
        strokeWidth: 1,
        cornerRadius: 2
      });
      const bullet = new Konva.Circle({
        x: x + 10,
        y: 8,
        radius: 4,
        fill: '#101810',
        stroke: bulletDark,
        strokeWidth: 1
      });
      const txt = new Konva.Text({
        x,
        y: 14,
        width: 20,
        align: 'center',
        text: val.toString(16).toUpperCase(),
        fontSize: 12,
        fontFamily: 'monospace',
        fill: textGreen
      });
      screen16.digitsGroup.add(cell);
      screen16.digitsGroup.add(bullet);
      screen16.digitsGroup.add(txt);
    });
    screen16.ellipsis.fill(groups.length > MAX_VISIBLE ? textAmber : '#304030');
  }

  function renderAll() {
    renderScreenBase2();
    renderScreenBase4();
    renderScreenBase16();
    const full = bitsOA.length >= MAX_BITS;
    setKeyEnabled(kb2, !full);
    layer.draw();
  }

  function setKeyEnabled(kb, enabled) {
    kb.keys.forEach(k => {
      k.rect.opacity(enabled ? 1 : 0.4);
      k.text.opacity(enabled ? 1 : 0.4);
    });
    kb.group.listening(enabled);
  }

  function addBit(bit) {
    if (bitsOA.length >= MAX_BITS) return;
    bitsOA += bit;
    renderAll();
  }

  function backspace() {
    if (!bitsOA.length) return;
    bitsOA = bitsOA.slice(0, -1);
    renderAll();
  }

  // OA keyboard (base‑2) interactions
  kb2.keys.forEach(k => {
    k.rect.on('click', () => {
      if (k.label === 'O' || k.label === 'A') addBit(k.label);
      else if (k.label === '⟵') backspace();
    });
    k.text.on('click', () => {
      if (k.label === 'O' || k.label === 'A') addBit(k.label);
      else if (k.label === '⟵') backspace();
    });
  });

  // Base‑4 keyboard: append base‑4 digit as 2 bits
  kb4.keys.forEach(k => {
    k.rect.on('click', () => {
      const d = parseInt(k.label, 10);
      const bits = d.toString(2).padStart(2, '0');
      bits.split('').forEach(b => addBit(b === '0' ? 'O' : 'A'));
    });
    k.text.on('click', () => {
      const d = parseInt(k.label, 10);
      const bits = d.toString(2).padStart(2, '0');
      bits.split('').forEach(b => addBit(b === '0' ? 'O' : 'A'));
    });
  });

  // Base‑16 keyboard: append hex digit as 4 bits
  kb16.keys.forEach(k => {
    k.rect.on('click', () => {
      const d = parseInt(k.label, 16);
      const bits = d.toString(2).padStart(4, '0');
      bits.split('').forEach(b => addBit(b === '0' ? 'O' : 'A'));
    });
    k.text.on('click', () => {
      const d = parseInt(k.label, 16);
      const bits = d.toString(2).padStart(4, '0');
      bits.split('').forEach(b => addBit(b === '0' ? 'O' : 'A'));
    });
  });

  window.addEventListener('resize', () => {
    stageWidth = container.clientWidth;
    stage.width(stageWidth);
    const newCellWidth = stageWidth / cols;

    // update positions
    [screen2.group, screen4.group, screen16.group].forEach((g, i) => {
      g.x(i * newCellWidth);
    });
    [kb2.group, kb4.group, kb16.group].forEach((g, i) => {
      g.x(i * newCellWidth);
    });

    layer.draw();
  });

  renderAll();
})();