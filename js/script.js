gsap.registerPlugin(ScrollTrigger);

function whenVisible(el, onIn, onOut, threshold = 0.1) {
  new IntersectionObserver(es => {
    const e = es[es.length - 1];
    e.isIntersecting ? onIn(e) : onOut && onOut(e);
  }, { threshold }).observe(el);
}

document.body.style.overflow = 'hidden'; //*
AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });

const cur = document.getElementById('cursor');
const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' });
const cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });

window.addEventListener('mousemove', e => {
  cx(e.clientX);
  cy(e.clientY);
});

document.querySelectorAll('a, button, .service-row').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * .3,
      y: (e.clientY - r.top - r.height / 2) * .3,
      duration: .3
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: .6,
      ease: 'elastic.out(1,.4)'
    });
  });
});

function splitWords(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="char" style="opacity: .12">${w}</span>`).join(' ');
  return el.querySelectorAll('.char');
}

const counter = { v: 0 };
const intro = gsap.timeline({ paused: true });

intro
  .from('#heroTitle .glitch, #heroTitle > span:nth-child(2) > span', {
    yPercent: 120,
    rotate: 4,
    duration: 1.1,
    ease: 'power4.out',
    stagger: .15
  })
  .from('#faceWrap', {
    yPercent: 25,
    opacity: 0,
    scale: 1.1,
    duration: 1.4,
    ease: 'power3.out'
  }, '-=.9')
  .from('.hero-fade', {
    y: 30,
    opacity: 0,
    stagger: .12,
    duration: .8,
    ease: 'power2.out'
  }, '-=.8');

gsap.timeline()
  .to(counter, {
    v: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      document.getElementById('count').textContent = Math.round(counter.v);
      document.getElementById('bar').style.width = counter.v + '%';
    }
  })
  .to('#preloader', {
    yPercent: -100,
    duration: .9,
    ease: 'power4.inOut'
  })
  .add(() => {
    intro.play();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    ScrollTrigger.refresh();
  }, '-=.3');

gsap.to('#progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    scrub: .3,
    start: 0,
    end: 'max'
  }
});

window.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - .5);
  const y = (e.clientY / innerHeight - .5);

  gsap.to('#face', {
    x: x * 30,
    y: y * 20,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.to('#faceGhost', {
    x: 10 + x * 70,
    y: y * 40,
    duration: 1.2,
    ease: 'power2.out'
  });
});

const heroK = innerWidth > 767 ? 1.08 : 1.02;

gsap.timeline({
  scrollTrigger: {
    trigger: '#home',
    start: 'top top',
    end: '+=90%',
    pin: true,
    scrub: 1,
    anticipatePin: 1
  }
})
  .to('#face', {
    scale: heroK,
    transformOrigin: '50% 100%'
  }, 0)
  .to('#faceGhost', {
    scale: heroK,
    transformOrigin: '50% 100%',
    xPercent: 6
  }, 0)
  .to('#heroGrid', { yPercent: 18 }, 0)
  .to('#heroTitle', {
    xPercent: innerWidth > 767 ? -12 : -2
  }, 0)
  .to('#heroContent', {
    yPercent: innerWidth > 767 ? -12 : -3
  }, 0);

const mq = gsap.to('#marquee > div', {
  xPercent: -100,
  repeat: -1,
  duration: 14,
  ease: 'none',
  paused: true
});
let mqOn = false;

whenVisible(document.getElementById('marquee').parentElement,
  () => { mqOn = true;  mq.paused(false); },
  () => { mqOn = false; mq.paused(true); });

ScrollTrigger.create({
  onUpdate: s => {
    if (!mqOn) return;

    gsap.to(mq, {
      timeScale: 1 + Math.abs(s.getVelocity()) / 250 * (s.direction),
      duration: .2,
      overwrite: true
    });

    gsap.to(mq, {
      timeScale: s.direction,
      duration: 1,
      delay: .2
    });

    gsap.to('#marquee', {
      skewX: gsap.utils.clamp(-12, 12, s.getVelocity() / -200),
      duration: .2,
      overwrite: true
    });

    gsap.to('#marquee', {
      skewX: 0,
      duration: .8,
      delay: .2
    });
  }
});

const man = document.getElementById('manifesto');
man.classList.add('reveal-text');
gsap.fromTo(man, { '--p': -30 }, {
  '--p': 100,
  ease: 'none',
  scrollTrigger: { trigger: man, start: 'top 80%', end: 'bottom 50%', scrub: true }
});

document.querySelectorAll('.count').forEach(el => {
  const o = { v: 0 };

  gsap.to(o, {
    v: +el.dataset.to,
    duration: 2,
    ease: 'power2.out',
    snap: { v: 1 },
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true
    },
    onUpdate: () => el.textContent = o.v
  });
});

gsap.utils.toArray('[data-speed]').forEach(el => {
  const s = parseFloat(el.dataset.speed);

  gsap.fromTo(el,
    { y: () => -s * 80 },
    {
      y: () => s * 80,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );
});

gsap.utils.toArray('#services h2').forEach(h => {
  gsap.from(h, {
    xPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: h,
      start: 'top bottom',
      end: 'top 30%',
      scrub: true
    }
  });
});

document.querySelectorAll('#services .scribble path').forEach(p => {
  const L = p.getTotalLength();

  gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
  gsap.to(p, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: p.closest('svg'),
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
});

const track = document.getElementById('processTrack');
const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

const hs = gsap.to(track, {
  x: () => -dist(),
  ease: 'none',
  scrollTrigger: {
    trigger: '#process',
    start: 'top top',
    end: () => '+=' + dist(),
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    anticipatePin: 1
  }
});

gsap.to('#processBar', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '#process',
    start: 'top top',
    end: () => '+=' + dist(),
    scrub: true,
    invalidateOnRefresh: true
  }
});

gsap.utils.toArray('.proc-panel').forEach((p, i) => {
  gsap.from(p.querySelector('.proc-num'), {
    xPercent: 50,
    rotate: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: p,
      containerAnimation: hs,
      start: 'left 100%',
      end: 'left 20%',
      scrub: true
    }
  });

  if (i > 0) {
    gsap.from(p.querySelectorAll('.proc-in'), {
      y: 60,
      opacity: 0,
      stagger: .1,
      duration: .8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: p,
        containerAnimation: hs,
        start: 'left 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }
});

gsap.from(
  [
    document.querySelector('#process > div.font-marker'),
    ...gsap.utils.toArray('.proc-panel')[0].querySelectorAll('.proc-in')
  ],
  {
    y: 60,
    opacity: 0,
    stagger: .1,
    duration: .8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#process',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  }
);

const expCards = gsap.utils.toArray('.exp-card');

gsap.set(expCards, {
  yPercent: 110,
  transformOrigin: '50% 0%'
});

gsap.from('#expTitle .exp-line', {
  yPercent: 110,
  stagger: .12,
  duration: 1,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '#experience',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('#expTitle > p', {
  y: 30,
  opacity: 0,
  stagger: .15,
  duration: .8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#experience',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

const STEP = 2;

const expTl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '#expStage',
    start: 'top top',
    end: () => '+=' + innerHeight * expCards.length * STEP * .8,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: {
      snapTo: 'labels',
      duration: { min: .2, max: .6 },
      delay: .1,
      ease: 'power1.inOut'
    }
  }
});

expTl.addLabel('titulo', 0);

expCards.forEach((c, i) => {
  const at = .6 + i * STEP;

  expTl.to(c, {
    yPercent: 0,
    y: i * 16,
    duration: 1
  }, at);

  if (i === 0) {
    expTl.to('#expTitle', {
      scale: .85,
      opacity: .2,
      duration: 1
    }, at);
  } else {
    expTl.to(expCards[i - 1], {
      scale: .95,
      filter: 'brightness(.5)',
      duration: 1
    }, at);
  }

  expTl.add(() => {
    const s = c.querySelector('span.text-xs');
    s && s.firstChild && scramble(s.firstChild, .8);
  }, at + .4);

  expTl.addLabel('card' + i, at + 1);
});

expTl.to({}, { duration: 1 });

const menu = document.getElementById('menu');
const burger = document.getElementById('burger');
const bl = burger.querySelectorAll('.burger-line');

gsap.set(menu, {
  clipPath: 'inset(0 0 100% 0)',
  visibility: 'hidden'
});

const menuTl = gsap.timeline({ paused: true })
  .set(menu, { visibility: 'visible' })
  .to(menu, {
    clipPath: 'inset(0 0 0% 0)',
    duration: .9,
    ease: 'power4.inOut'
  })
  .to(bl[0], { y: 4, rotate: 45, duration: .4 }, 0)
  .to(bl[1], { y: -4, rotate: -45, duration: .4 }, 0)
  .from('.menu-link .label', {
    yPercent: 110,
    stagger: .07,
    duration: .8,
    ease: 'power4.out'
  }, '-=.4')
  .from('.menu-extra', {
    opacity: 0,
    y: 24,
    stagger: .1,
    duration: .6
  }, '-=.6')
  .from('#menuFace', {
    scale: 1.25,
    duration: 1.1,
    ease: 'power3.out'
  }, '-=1.1');

let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  burger.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
  open ? menuTl.timeScale(1).play() : menuTl.timeScale(1.6).reverse();
}

burger.addEventListener('click', () => toggleMenu(!menuOpen));

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});

document.querySelectorAll('.menu-link').forEach(l => {
  const target = document.querySelector(l.getAttribute('href'));

  l.addEventListener('click', e => {
    e.preventDefault();
    toggleMenu(false);
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 550);
  });
});


const GLYPHS = '█▓▒░<>/\\|[]{}#$%&*+=?01';

function scramble(node, dur = .8) {
  const cl = document.documentElement.classList;
  if (cl.contains('translated-ltr') || cl.contains('translated-rtl')) return;
  if (!node) return;
  const o = node._o || (node._o = node.textContent);
  const st = { p: 0 };

  node._t && node._t.kill();
  node._t = gsap.to(st, {
    p: 1,
    duration: dur,
    ease: 'none',
    onUpdate: () => {
      const k = Math.floor(st.p * o.length);
      node.textContent = o.slice(0, k) + o.slice(k).replace(/\S/g, () => GLYPHS[Math.random() * GLYPHS.length | 0]);
    },
    onComplete: () => node.textContent = o
  });
}

const scrambleQueue = [];

document.querySelectorAll('.tape, .mag, .exp-card span.text-xs, header a.font-anton').forEach(el => {
  if (el.children.length) return;
  const node = el.firstChild;

  el.addEventListener('mouseenter', () => scramble(node, .6));

  if (el.closest('#home, header, .exp-card')) return;

  scrambleQueue.push({ el, node });
});

document.querySelectorAll('.menu-link').forEach(l => {
  const node = [...l.querySelector('.label').childNodes].find(n => n.nodeType === 3);
  node && l.addEventListener('mouseenter', () => scramble(node, .5));
});

function splat(x, y, n = 14) {
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    const s = gsap.utils.random(4, 14);
    const a = Math.random() * Math.PI * 2;
    const r = gsap.utils.random(30, 140);

    d.className = 'splat';
    document.body.appendChild(d);
    gsap.set(d, { left: x, top: y, width: s, height: s });
    gsap.to(d, {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r + 20,
      scale: 0,
      duration: gsap.utils.random(.5, 1),
      ease: 'power3.out',
      onComplete: () => d.remove()
    });
  }
}

window.addEventListener('pointerdown', e => splat(e.clientX, e.clientY));

const neon = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 2, paused: true })
  .to('p.font-marker.hero-fade', { opacity: .25, duration: .05 })
  .to('p.font-marker.hero-fade', { opacity: 1, duration: .05 })
  .to('p.font-marker.hero-fade', { opacity: .5, duration: .04 })
  .to('p.font-marker.hero-fade', { opacity: 1, duration: .08 });

gsap.set('#face', { clipPath: 'inset(0% 0% 0% 0%)' });

let faceCall, faceTl;

function faceBurst() {
  faceCall = gsap.delayedCall(gsap.utils.random(3, 6), () => {
    faceTl = gsap.timeline({ onComplete: faceBurst })
      .to('#faceGhost', { skewX: 25, opacity: .9, duration: .06 }, 0)
      .to('#face', { clipPath: 'inset(20% 0% 55% 0%)', duration: .04 }, 0)
      .to('#face', { clipPath: 'inset(60% 0% 10% 0%)', duration: .04 })
      .to('#face', { clipPath: 'inset(0% 0% 0% 0%)', duration: .04 })
      .to('#faceGhost', { skewX: 0, opacity: .3, duration: .12 });
  });
}

function stopFace() {
  if (!faceCall) return;
  faceCall.kill();
  faceTl && faceTl.kill();
  faceCall = faceTl = null;
  gsap.set('#face', { clipPath: 'inset(0% 0% 0% 0%)' });
  gsap.set('#faceGhost', { skewX: 0, opacity: .3 });
}

let introDone = false, heroSeen = false;

function syncHero() {
  const on = introDone && heroSeen;
  document.querySelectorAll('#home .glitch').forEach(g => g.classList.toggle('live', on));
  if (on) { neon.paused(false); if (!faceCall) faceBurst(); }
  else    { neon.paused(true);  stopFace(); }
}

intro.eventCallback('onComplete', () => { introDone = true; syncHero(); });

whenVisible(document.getElementById('home'),
  () => { heroSeen = true;  syncHero(); },
  () => { heroSeen = false; syncHero(); }, .05);

intro.add(() => {
  document.querySelectorAll('#home .tape, #home .mag, header a.font-anton').forEach(el => {
    if (!el.children.length && el.firstChild) scramble(el.firstChild, 1);
  });
}, '-=.4');

const rgbTargets = gsap.utils.toArray('h1, section h2');
const rgb = { v: 0, t: 0, last: '' };

ScrollTrigger.create({
  onUpdate: s => rgb.t = gsap.utils.clamp(-24, 24, s.getVelocity() / 80)
});

gsap.ticker.add(() => {
  rgb.t *= .9;
  rgb.v += (rgb.t - rgb.v) * .2;

  const str = Math.abs(rgb.v) < .3 ? '' : `${rgb.v}px 0 rgba(255,255,255,.55), ${-rgb.v}px 0 rgba(130,130,130,.55)`;

  if (str !== rgb.last) {
    rgb.last = str;
    rgbTargets.forEach(el => el.style.textShadow = str);
  }
});

gsap.from('#stamp', {
  scale: 3,
  opacity: 0,
  rotation: -25,
  duration: .35,
  ease: 'power4.in',
  scrollTrigger: {
    trigger: '#stamp',
    start: 'top 85%',
    once: true
  },
  onComplete: () => {
    const r = document.getElementById('stamp').getBoundingClientRect();

    splat(r.left + r.width / 2, r.top + r.height / 2, 22);
    gsap.fromTo('#about', { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.2)' });
  }
});

if (matchMedia('(pointer: fine)').matches) {
  const ps = document.querySelector('.projSwiper');

  ps.addEventListener('mousemove', e => {
    const s = e.target.closest('.swiper-slide');
    if (!s) return;
    const r = s.getBoundingClientRect();

    gsap.to(s, {
      rotationY: ((e.clientX - r.left) / r.width - .5) * 14,
      rotationX: -((e.clientY - r.top) / r.height - .5) * 14,
      transformPerspective: 900,
      duration: .4
    });
  });

  ps.addEventListener('mouseout', e => {
    const s = e.target.closest('.swiper-slide');
    if (s && !s.contains(e.relatedTarget)) gsap.to(s, { rotationX: 0, rotationY: 0, duration: .6 });
  });
}

const blobs = gsap.utils.toArray('#blobField .blob');
const MORPH = '58% 42% 55% 45% / 48% 56% 44% 52%';
const DROP  = '50% 50% 50% 50% / 72% 72% 28% 28%';

const skillsEl = document.getElementById('skills');
const skillHead = '#skills > p, #skills > h2';

gsap.set(skillHead, { opacity: 0, y: 40 });

const floats = [];

blobs.forEach(b => {
  b._in  = b.querySelector('.blob-in');
  b._txt = b._in.querySelector('b');
  b._sub = b._in.querySelector('small');
  b._trail = document.createElement('i');
  b._trail.className = 'trail';
  b.appendChild(b._trail);

  floats.push(gsap.to(b._in, {
    y: gsap.utils.random(-14, 14),
    x: gsap.utils.random(-10, 10),
    rotation: gsap.utils.random(-6, 6),
    duration: gsap.utils.random(2.5, 4.5),
    ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true
  }));
});

whenVisible(skillsEl,
  () => gsap.to(skillHead, { opacity: 1, y: 0, stagger: .15, duration: .8, ease: 'power3.out', overwrite: 'auto' }),
  e => { if (e.boundingClientRect.top > 0) gsap.set(skillHead, { opacity: 0, y: 40 }); },
  .15);

whenVisible(skillsEl,
  () => floats.forEach(f => f.paused(false)),
  () => floats.forEach(f => f.paused(true)),
  0);

const skillsTl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '#skills',
    start: 'top top',
    end: () => '+=' + innerHeight * 2.5,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true
  }
});

gsap.utils.shuffle(blobs.slice()).forEach((b, i) => {
  const at = i * 0.3;

  skillsTl
    .fromTo(b, { y: () => innerHeight }, {
      y: 0, duration: 1.4, ease: 'power3.out',
      onUpdate: () => {
        b._trail.style.height = Math.max(0, innerHeight - gsap.getProperty(b, 'y')) + 'px';
      }
    }, at)
    .fromTo(b._in,
      { scaleX: .45, scaleY: .45, borderRadius: DROP },
      { scaleX: .8, scaleY: 1.3, duration: 1.2, ease: 'power2.out' }, at)
    .to(b._trail, { scaleY: 0, duration: .5, ease: 'power3.in' }, at + 1.1)
    .to(b._in, { scaleX: 1.3, scaleY: .7, duration: .15, ease: 'power2.out' }, at + 1.4)
    .to(b._in, { scaleX: 1, scaleY: 1, borderRadius: MORPH, duration: .5, ease: 'back.out(2)' }, at + 1.55)
    .to(b._txt, { opacity: 1, duration: .3 }, at + 1.8)
    .to(b._sub, { opacity: .7, duration: .3 }, at + 1.8);
});

skillsTl.to({}, { duration: 1 });


gsap.utils.toArray('#projects h2').forEach(h => {
  gsap.from(h, {
    xPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: h,
      start: 'top bottom',
      end: 'top 30%',
      scrub: true
    }
  });
});

scrambleQueue.forEach(({ el, node }) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 92%',
    once: true,
    onEnter: () => scramble(node, 1)
  });
});

// resaltado del menú según la sección visible
document.querySelectorAll('.menu-link').forEach(l => {
  const target = document.querySelector(l.getAttribute('href'));

  ScrollTrigger.create({
    trigger: target,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: st => l.classList.toggle('is-active', st.isActive)
  });
});

gsap.from('#cta', {
  scale: .6,
  opacity: 0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#cta',
    start: 'top 90%',
    end: 'top 40%',
    scrub: true
  }
});

document.querySelectorAll('#contact .scribble path').forEach(p => {
  const L = p.getTotalLength();

  gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
  gsap.to(p, {
    strokeDashoffset: 0,
    duration: 1.2,
    delay: .6,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: p.closest('svg'),
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
});

gsap.fromTo('.drips i',
  { scaleY: 0 },
  {
    scaleY: () => gsap.utils.random(.25, 1),
    duration: () => gsap.utils.random(1.5, 3),
    delay: .1,
    ease: 'power1.in',
    stagger: .15,
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  }
);

ScrollTrigger.create({
  trigger: '#cta',
  start: 'top 60%',
  onEnter: () => gsap.delayedCall(.8, () => document.querySelector('#contact .glitch').classList.add('live')),
  onLeaveBack: () => document.querySelector('#contact .glitch').classList.remove('live')
});

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  AOS.refreshHard();
});
ScrollTrigger.addEventListener('refresh', () => AOS.refreshHard());

const projSwiper = new Swiper('.projSwiper', {
  slidesPerView: 'auto',
  spaceBetween: 24,
  grabCursor: true,
  loop: true,
  speed: 800,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.next',
    prevEl: '.prev'
  },
  mousewheel: {
    forceToAxis: true
  }
});

projSwiper.autoplay.stop();
whenVisible(document.getElementById('projects'),
  () => projSwiper.autoplay.start(),
  () => projSwiper.autoplay.stop(), .2);
