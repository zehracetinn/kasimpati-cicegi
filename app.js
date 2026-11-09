(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const flower = document.getElementById('chrysanthemum');
  const petals = document.getElementById('petal-container');
  const coreDots = document.getElementById('core-dots');
  const paletteName = document.getElementById('palette-name');
  const canvas = document.getElementById('sparkles');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palettes = {
    gold: {
      label: 'Altın sarısı', accent: '#f8cb76', halo: '#f0b86e',
      layers: [
        ['#a6533c', '#df9a60', '#ffe8ad'],
        ['#a25b40', '#edaa6a', '#fff0b8'],
        ['#bd6e43', '#f2bd74', '#fff3c6'],
        ['#b66b34', '#f6ca7c', '#fff4c9'],
        ['#b56b32', '#fad27f', '#fff6cf'],
        ['#c4843d', '#ffe39e', '#fffbe0']
      ]
    },
    rose: {
      label: 'Pembe düş', accent: '#f9a6c1', halo: '#e08aab',
      layers: [
        ['#8f315a', '#dd7296', '#ffbfd4'],
        ['#983c64', '#e889a5', '#ffd1dc'],
        ['#ab5574', '#efa0b7', '#ffdae4'],
        ['#ae597a', '#f4acc3', '#ffe5e8'],
        ['#bb6680', '#f7b6c9', '#ffebeb'],
        ['#c77986', '#ffd0d8', '#fff2e9']
      ]
    },
    lilac: {
      label: 'Leylak gecesi', accent: '#c9b3ff', halo: '#a994e8',
      layers: [
        ['#4e387e', '#997bc2', '#cfb5ee'],
        ['#67458e', '#ad91d7', '#ddc8fb'],
        ['#735399', '#bea1e0', '#ead9ff'],
        ['#825ea3', '#cab0ed', '#f1e3ff'],
        ['#906ba8', '#d6bff0', '#f3e5ff'],
        ['#a486bc', '#e2d2f6', '#fff0ff']
      ]
    }
  };

  // Sabit tohum kullanılıyor: her açılışta aynı doğal yaprak düzeni korunur.
  let seed = 70611;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS(SVG_NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  };

  // Dış halkadan iç halkaya doğru çizilir; içeriden dışarıya doğru açılır.
  const rings = [
    { count: 59, root: 67, length: 159, width: 24, delay: 2.15 },
    { count: 51, root: 58, length: 148, width: 25, delay: 1.82 },
    { count: 45, root: 48, length: 129, width: 25, delay: 1.46 },
    { count: 37, root: 38, length: 104, width: 24, delay: 1.16 },
    { count: 30, root: 26, length: 78, width: 22, delay: .86 },
    { count: 24, root: 14, length: 51, width: 17, delay: .60 }
  ];

  function buildFlower() {
    const defs = flower.querySelector('defs');
    const fragment = document.createDocumentFragment();
    rings.forEach((ring, ringIndex) => {
      const gradient = svgEl('linearGradient', {
        id: `petal-gradient-${ringIndex}`, x1: '0%', y1: '100%', x2: '13%', y2: '0%'
      });
      ['0%', '50%', '100%'].forEach((offset, colorIndex) => {
        gradient.appendChild(svgEl('stop', { offset, 'data-ring': ringIndex, 'data-color': colorIndex }));
      });
      defs.appendChild(gradient);

      const layer = svgEl('g', { 'data-layer': ringIndex });
      for (let i = 0; i < ring.count; i += 1) {
        const angle = i * (360 / ring.count) + (ringIndex % 2) * 4.7 + (random() - .5) * 6;
        const length = ring.length * (.84 + random() * .26);
        const width = ring.width * (.76 + random() * .45);
        const bend = (random() - .5) * 13;
        const start = ring.root + (random() - .5) * 12;
        const y0 = -start;
        const tip = -start - length;
        const base = width * .2;
        const path = [
          `M ${(-base).toFixed(2)} ${y0.toFixed(2)}`,
          `C ${(-width * .58).toFixed(2)} ${(y0 - length * .22).toFixed(2)}, ${(-width * .62 + bend * .38).toFixed(2)} ${(y0 - length * .7).toFixed(2)}, ${bend.toFixed(2)} ${(tip + 5).toFixed(2)}`,
          `Q ${(bend + 2).toFixed(2)} ${(tip - 6).toFixed(2)}, ${(bend + 5).toFixed(2)} ${(tip + 3).toFixed(2)}`,
          `C ${(width * .68 + bend * .35).toFixed(2)} ${(y0 - length * .72).toFixed(2)}, ${(width * .62).toFixed(2)} ${(y0 - length * .25).toFixed(2)}, ${base.toFixed(2)} ${y0.toFixed(2)}`,
          `Q 0 ${(y0 - 5).toFixed(2)}, ${(-base).toFixed(2)} ${y0.toFixed(2)} Z`
        ].join(' ');
        const rotation = svgEl('g', { transform: `rotate(${angle.toFixed(2)})` });
        const open = svgEl('g', { class: 'petal-open' });
        const delay = ring.delay + random() * .46;
        open.style.setProperty('--petal-delay', `${delay.toFixed(2)}s`);
        const shape = svgEl('path', { d: path, fill: `url(#petal-gradient-${ringIndex})` });
        const vein = svgEl('path', {
          d: `M 0 ${(y0 - 9).toFixed(2)} Q ${(bend * .22).toFixed(2)} ${(y0 - length * .47).toFixed(2)} ${bend.toFixed(2)} ${(tip + 15).toFixed(2)}`,
          class: 'petal-vein', fill: 'none'
        });
        open.append(shape, vein);
        rotation.appendChild(open);
        layer.appendChild(rotation);
      }
      fragment.appendChild(layer);
    });
    petals.appendChild(fragment);

    for (let i = 0; i < 47; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 17;
      coreDots.appendChild(svgEl('circle', {
        cx: (Math.cos(angle) * radius).toFixed(2),
        cy: (Math.sin(angle) * radius).toFixed(2),
        r: (1 + random() * 1.9).toFixed(2),
        fill: i % 3 ? '#fff5bf' : '#bc6f36', opacity: (.6 + random() * .4).toFixed(2)
      }));
    }
  }

  let currentPalette = 'gold';
  function setPalette(name, replay = true) {
    if (!palettes[name]) return;
    currentPalette = name;
    const palette = palettes[name];
    flower.querySelectorAll('stop[data-ring]').forEach((stop) => {
      const ring = Number(stop.dataset.ring);
      const position = Number(stop.dataset.color);
      stop.setAttribute('stop-color', palette.layers[ring][position]);
    });
    document.querySelector('#flower-halo stop:first-child').setAttribute('stop-color', palette.halo);
    document.querySelector('#flower-halo stop:nth-child(2)').setAttribute('stop-color', palette.halo);
    document.documentElement.style.setProperty('--accent', palette.accent);
    paletteName.textContent = palette.label;
    flower.setAttribute('aria-label', `${palette.label} yaprakları sırayla açan kasımpatı çiçeği`);
    document.querySelectorAll('.swatch').forEach((swatch) => {
      const active = swatch.dataset.palette === name;
      swatch.classList.toggle('is-selected', active);
      swatch.setAttribute('aria-pressed', String(active));
    });
    if (replay) bloom();
  }

  const particles = [];
  const fireflies = [];
  let animationFrame = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let lastFrame = 0;
  const devicePixelRatioLimit = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = Math.floor(canvasWidth * devicePixelRatioLimit);
    canvas.height = Math.floor(canvasHeight * devicePixelRatioLimit);
    ctx.setTransform(devicePixelRatioLimit, 0, 0, devicePixelRatioLimit, 0, 0);
    fireflies.length = 0;
    for (let i = 0; i < Math.min(74, Math.floor(canvasWidth / 13)); i++) {
      fireflies.push({ x: Math.random() * canvasWidth, y: Math.random() * canvasHeight,
        r: .5 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - .5) * .17, vy: -.05 - Math.random() * .2 });
    }
  }

  function centerOfFlower() {
    const center = flower.createSVGPoint();
    center.x = 0;
    center.y = 0;
    const matrix = document.getElementById('flower-head').getScreenCTM();
    if (!matrix) return { x: canvasWidth * .5, y: canvasHeight * .42 };
    const screen = center.matrixTransform(matrix);
    return { x: screen.x, y: screen.y };
  }

  function burst(count = 85, strength = 1) {
    if (reducedMotion.matches || !ctx) return;
    const c = centerOfFlower();
    const colorSet = palettes[currentPalette].layers.flat().filter((_, i) => i % 3 !== 0);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.1 + Math.random() * 4.8) * strength;
      particles.push({ x: c.x + (Math.random() - .5) * 80, y: c.y + (Math.random() - .5) * 80,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
        life: 1, decay: .006 + Math.random() * .012, radius: .9 + Math.random() * 2.6,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        star: Math.random() > .72, rotation: Math.random() * Math.PI });
    }
  }

  function drawFrame(time) {
    const elapsed = Math.min((time - lastFrame) / 16.67 || 1, 2.3);
    lastFrame = time;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const f of fireflies) {
      f.x += f.vx * elapsed;
      f.y += f.vy * elapsed;
      if (f.y < -10) f.y = canvasHeight + 10;
      if (f.x < -10) f.x = canvasWidth + 10;
      if (f.x > canvasWidth + 10) f.x = -10;
      const alpha = .14 + .3 * ((Math.sin(time * .0013 + f.phase) + 1) / 2);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 224, 187, ${alpha})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * elapsed;
      p.y += p.vy * elapsed;
      p.vx *= .986;
      p.vy += .025 * elapsed;
      p.life -= p.decay * elapsed;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 11;
      if (p.star) {
        const size = p.radius * 2.8 * p.life;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation += .016);
        ctx.beginPath();
        ctx.moveTo(0, -size); ctx.quadraticCurveTo(size * .22, 0, size, 0);
        ctx.quadraticCurveTo(size * .22, 0, 0, size);
        ctx.quadraticCurveTo(-size * .22, 0, -size, 0);
        ctx.quadraticCurveTo(-size * .22, 0, 0, -size);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    animationFrame = requestAnimationFrame(drawFrame);
  }

  let bloomTimers = [];
  function bloom() {
    bloomTimers.forEach(clearTimeout);
    bloomTimers = [];
    flower.classList.remove('is-blooming');
    // Animasyonları, HTML öğesini yeniden oluşturmadan başlatır.
    void flower.getBoundingClientRect();
    flower.classList.add('is-blooming');
    if (!reducedMotion.matches) {
      burst(22, .4);
      bloomTimers.push(setTimeout(() => burst(64, .75), 1050));
      bloomTimers.push(setTimeout(() => burst(110, 1.05), 2100));
      bloomTimers.push(setTimeout(() => burst(150, 1.25), 3100));
    }
  }

  const shareDialog = document.getElementById('share-dialog');
  const recipientInput = document.getElementById('recipient-input');
  const messageInput = document.getElementById('message-input');
  const feedback = document.getElementById('copy-feedback');

  function personalize() {
    const params = new URLSearchParams(window.location.search);
    const name = (params.get('isim') || '').trim().slice(0, 40);
    const message = (params.get('mesaj') || '').trim().slice(0, 220);
    const color = params.get('renk');
    if (name) {
      document.querySelector('.eyebrow').lastChild.textContent = ` ${name.toLocaleUpperCase('tr-TR')} İÇİN AÇIYOR`;
      document.title = `${name} için bir kasımpatı ✦`;
    }
    if (message) document.getElementById('greeting').textContent = message;
    if (color && palettes[color]) setPalette(color, false);
    recipientInput.value = name;
    messageInput.value = message;
  }

  function makeShareUrl() {
    const url = new URL(window.location.href);
    const name = recipientInput.value.trim().slice(0, 40);
    const message = messageInput.value.trim().slice(0, 220);
    url.search = '';
    url.hash = '';
    if (name) url.searchParams.set('isim', name);
    if (message) url.searchParams.set('mesaj', message);
    if (currentPalette !== 'gold') url.searchParams.set('renk', currentPalette);
    return url.toString();
  }

  async function copyLink() {
    const link = makeShareUrl();
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(link);
      feedback.textContent = '✦ Bağlantı kopyalandı! Artık gönderebilirsin.';
    } catch (_error) {
      // HTTP üzerinden açılmışsa ya da kopyalama engelliyse bağlantıyı elle seçtir.
      const input = document.createElement('textarea');
      input.value = link;
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (_ignore) { /* tarayıcı engelleyebilir */ }
      input.remove();
      if (copied) feedback.textContent = '✦ Bağlantı kopyalandı!';
      else {
        feedback.textContent = 'Bağlantı aşağıda; seçip kopyalayabilirsin:';
        const output = document.createElement('textarea');
        output.readOnly = true;
        output.value = link;
        output.setAttribute('aria-label', 'Paylaşılabilir bağlantı');
        feedback.after(output);
        output.focus(); output.select();
      }
    }
  }

  buildFlower();
  personalize();
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('replay-btn').addEventListener('click', bloom);
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => setPalette(swatch.dataset.palette));
  });
  document.getElementById('share-btn').addEventListener('click', () => {
    feedback.textContent = '';
    if (typeof shareDialog.showModal === 'function') shareDialog.showModal();
    else shareDialog.setAttribute('open', '');
  });
  document.getElementById('close-dialog').addEventListener('click', () => shareDialog.close());
  shareDialog.addEventListener('click', (event) => {
    if (event.target === shareDialog) shareDialog.close();
  });
  document.getElementById('copy-link').addEventListener('click', copyLink);
  window.addEventListener('resize', resizeCanvas, { passive: true });

  if (ctx && !reducedMotion.matches) {
    resizeCanvas();
    animationFrame = requestAnimationFrame(drawFrame);
    window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
  }
  bloom();
})();
