// animation.js — correct version for real Laegna structure

(function () {

  const JSON_PATH = "numberdatabase/complete.json";

  async function loadJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Cannot load " + url);
    return await res.json();
  }

  // ------------------------------------------------------------
  // Convert real structure → flat numbers[] and chapters[]
  // ------------------------------------------------------------
  function extractStructure(raw) {

    const chapters = [];
    const numbers = [];

    raw.chapters.forEach((chapter, chapterIndex) => {

      // Build chapter entry
      const ch = {
        Name: `R=${chapter.R}`,
        R: chapter.R,
        base: chapter.base,
        Bounds: chapter.Bounds,
        numbers: chapter.numbers
      };

      chapters.push(ch);

      // Flatten numbers
      chapter.numbers.forEach(num => {
        numbers.push({
          Chapter: ch.Name,
          R: chapter.R,
          Decimal: num.Decimal,
          Laegna: num.Laegna,
          Wave: num.Wave,
          Float: num.Float,
          Octave: num.Octave
        });
      });
    });

    return { chapters, numbers };
  }

  // ------------------------------------------------------------
  // Add id/zid and build animation lists
  // ------------------------------------------------------------
  function augmentNumberSystem(data) {

    // --- Chapters ---
    data.chapters.forEach((ch, zid) => {
      const id = zid + 1;
      ch.Id = {
        Num: id,
        Onebased: { Num: id },
        Zerobased: { Num: zid }
      };
    });

    // --- Numbers ---
    let zid = 0;
    data.numbers.forEach(num => {
      const id = zid + 1;
      num.Id = {
        Num: id,
        Onebased: { Num: id },
        Zerobased: { Num: zid }
      };
      zid++;
    });

    // --- Animation list ---
    data.animation = data.numbers.map(n => ({
      DecimalNum: n.Decimal?.Num ?? null,
      LaegnaBin: n.Laegna?.Bin ?? null,
      Chapter: n.Chapter,
      Id: n.Id
    }));

    // --- Animation chapters ---
    data.animation_chapters = data.chapters.map(ch => ({
      Name: ch.Name,
      Id: ch.Id
    }));

    return data;
  }

  // ------------------------------------------------------------
  // Build chapter index (start/end)
  // ------------------------------------------------------------
  function buildChapterIndex(data) {
    const chapterIndex = new Map();

    data.animation.forEach((item, idx) => {
      const name = item.Chapter;
      if (!chapterIndex.has(name)) {
        chapterIndex.set(name, { name, startIndex: idx, endIndex: idx });
      } else {
        chapterIndex.get(name).endIndex = idx;
      }
    });

    const orderedChapters = Array.from(chapterIndex.values())
      .sort((a, b) => a.startIndex - b.startIndex);

    return { chapterIndex, orderedChapters };
  }

  // ------------------------------------------------------------
  // Auto-load on script load
  // ------------------------------------------------------------
  const Laegna = {
    data: null,
    chapterIndexInfo: null,
    ready: null
  };

  Laegna.ready = (async () => {

    const raw = await loadJSON(JSON_PATH);

    // Extract real structure
    const structured = extractStructure(raw);

    // Add ids and animation lists
    const augmented = augmentNumberSystem(structured);

    // Build chapter index
    const chapterIndexInfo = buildChapterIndex(augmented);

    Laegna.data = augmented;
    Laegna.chapterIndexInfo = chapterIndexInfo;

    return Laegna;
  })();

  window.Laegna = Laegna;

})();
