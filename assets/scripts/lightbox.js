/**
 * Tom Wahl's — Promotional Lightbox
 * =================================================================
 * A self-contained, accessible lightbox/modal overlay. It injects its
 * own CSS and HTML, so there is NOTHING to paste into your pages.
 *
 * HOW TO ADD IT TO A PAGE (one line, just before </body>):
 *     <script src="/assets/scripts/lightbox.js" defer></script>
 *
 * HOW IT BEHAVES:
 *   • Fades in quickly the moment a visitor lands on the page.
 *   • Stays on screen for `showDelayMs`, then fades out automatically.
 *   • The page behind it gets a soft "bokeh" blur that fades in/out
 *     on the SAME schedule.
 *   • Only shows once every `frequencyHours` (remembered in the browser).
 *   • Visitor can close early with the "X", the ESC key, or by clicking
 *     the dark area outside the box.
 *
 * ░░ EVERYTHING YOU NEED TO CUSTOMIZE IS IN THE TWO BLOCKS BELOW ░░
 *   1) LIGHTBOX_CONFIG  — timing & behavior switches
 *   2) VARIANTS         — the 5 ready-made promo designs (text/images/links)
 * You should not need to touch anything under "ENGINE".
 * =================================================================
 */
(function () {
  'use strict';

  /* ===============================================================
     1) LIGHTBOX_CONFIG — behavior & timing (edit these freely)
     =============================================================== */
  var LIGHTBOX_CONFIG = {
    // How long (in milliseconds) the lightbox stays on screen before it
    // automatically fades out. It fades IN immediately on page load.
    // 1000 ms = 1 second. Set to 0 to disable auto-close (visitor must
    // close it themselves with the X / ESC / outside click).
    showDelayMs: 0,

    // Speed of the quick fade-in and fade-out animation, in milliseconds.
    // The bokeh blur uses this same value so they animate together.
    fadeMs: 500,

    // Don't show the lightbox again until this many hours have passed.
    // 24 = once per day. Use 0 to show on every single page load (handy
    // while you are testing/designing).
    frequencyHours: 0,

    // The name used to remember "last shown" in the browser's localStorage.
    // Change it (e.g. add a date) to force the popup to show again for
    // everyone — e.g. 'tw_lightbox_summer2026'.
    storageKey: 'tw_lightbox_lastShown',

    // Which design from the VARIANTS list (section 2) below to show.
    // Type ONE of these exact keys (must be in quotes):
    //   'promo'   → Promotion / limited-time offer
    //   'welcome' → First-time visitor welcome
    //   'event'   → Special event announcement
    //   'menu'    → New menu item / seasonal highlight
    //   'loyalty' → Loyalty program signup (app download badges)
    //   'order'   → Generic "order online" call-to-action
    //   'holiday' → Upcoming holiday announcement (generic placeholder)
    defaultVariant: 'loyalty',

    // ── Optional extras (sensible defaults — change only if needed) ──

    enableBokeh: true,          // Blur + bokeh the page behind the lightbox.
    closeOnBackdrop: true,      // Click the dark area outside the box to close.
    closeOnEsc: true,           // Press ESC to close.
    showOnceEver: false,        // true = show only one time ever (ignores frequencyHours).
    respectReducedMotion: true, // Honor the visitor's "reduce motion" OS setting.
    debug: true,                // Log show/CTA events to the browser console.
    ga4Event: 'lightbox'        // Event name prefix for the optional GA4 hook (see log() below).
  };

  /* ===============================================================
     2) VARIANTS — the 5 ready-to-use content sets
     ---------------------------------------------------------------
     To swap a promotion, just edit the text / image / link of the
     matching block. To pick which one shows, set `defaultVariant`
     above. Each variant supports:
       image     : path to the picture shown inside the box, PNG or WebP works bes. Optional — omit/'' to hide | Source file — max-height 240px, limit ~480px height (2× the display width) so it stays crisp on Retina/high-DPI screens. Bigger than that just wastes bytes
       imageAlt  : description of the image for screen readers
       eyebrow   : small label above the headline
       headline  : the big bold line
       body      : one or two short sentences
       cta        : the primary button { label, href, onClick }
                    - href: a link to open, OR
                    - onClick: a function to run instead of opening a link
       badges    : (loyalty only) app-store badge buttons instead of a CTA button
     =============================================================== */
  var VARIANTS = {

    // ── Promotion / limited-time offer ──
    // To show this one, set:  defaultVariant: 'promo'
    promo: {
      image: '/assets/tablesetting.webp',
      imageAlt: "Tom Wahl's burger, fries, and root beer",
      eyebrow: 'Limited-Time Offer',
      headline: 'Free Fries With Any Burger',
      body: 'This week only — grab a classic cheeseburger and we’ll throw in a side of our famous fries, on the house.',
      cta: {
        label: 'See the Deal',
        href: '/coupons.html'
        // onClick: function () { /* custom action instead of a link */ }
      }
    },

    // ── First-time visitor welcome ──
    // To show this one, set:  defaultVariant: 'welcome'
    welcome: {
      image: '/assets/lb-welcome.webp',
      imageAlt: "The Perfect Tom Wahl's Meal",
      eyebrow: 'Welcome to Tom Wahl’s',
      headline: 'Serving Rochester’s Best Bites Since 1955',
      body: 'New here? Start with our signature ground-fresh burgers, crispy fries and homemade root beer. Order online for pickup in minutes.',
      cta: {
        label: 'Order Online',
        href: '/order-online.html'
      }
    },

    // ── Special event announcement ──
    // To show this one, set:  defaultVariant: 'event'
    event: {
      image: '/assets/tablesetting.webp',
      imageAlt: 'Diner table set for a celebration',
      eyebrow: 'You’re Invited',
      headline: 'Customer Appreciation Day',
      body: 'Join us this Saturday for live music, classic cars, and surprise specials at every location. See you there!',
      cta: {
        label: 'View Locations',
        href: '/locations.html'
      }
    },

    // ── New menu item / seasonal highlight ──
    // To show this one, set:  defaultVariant: 'menu'
    menu: {
      image: '/assets/rewards/reward-ice-cream.webp',
      imageAlt: 'Hand-dipped ice cream cone',
      eyebrow: 'New & Seasonal',
      headline: 'Summer Ice Cream Flavors Are Here',
      body: 'Cool off with our brand-new seasonal scoops — available for a limited time at participating locations.',
      cta: {
        label: 'See the Menu',
        href: '/order-online.html'
      }
    },

    // ── Loyalty program signup (app download) ──
    // To show this one, set:  defaultVariant: 'loyalty'
    // This variant shows the App Store + Google Play badges instead of a
    // single button. Edit the badge `href`s to point at your app listings.
    loyalty: {
      image: '/assets/lb-rewards.webp',
      imageAlt: 'Employee + Table Setting',
      eyebrow: 'Join Tom Wahl’s Rewards',
      headline: 'Get a Free Cheeseburger',
      body: 'Download the Tom Wahl’s app, join Rewards, and enjoy a free cheeseburger after your first $10+ purchase. Earn points on every visit. Spend points on free food.',
      // No `cta` here — `badges` below take its place:
      badges: [
        {
          src: '/assets/app-store-badge.webp',
          alt: 'Download on the App Store',
          href: 'https://apps.apple.com/us/app/tom-wahls/id6449795790'
        },
        {
          src: '/assets/google-play-badge.webp',
          alt: 'Get it on Google Play',
          href: 'https://play.google.com/store/apps/details?id=com.paytronix.client.android.app.tomwahls'
        }
      ]
    },

    // ── Generic "order online" call-to-action ──
    // To show this one, set:  defaultVariant: 'order'
    order: {
      image: '/assets/lb-order-online.webp',
      imageAlt: "Order Tom Wahl's online",
      eyebrow: 'Skip the Line, Order Online',
      headline: 'Dine-In, Pick Up or get Delivery',
      body: 'Craving a Tom Wahl’s classic? Order now & we’ll have it hot and ready for you! Use Promo Code: TW10 at checkout.',
      cta: {
        label: 'Order Now',
        href: '/order-online.html'
      }
    },

    // ── Upcoming holiday announcement (generic placeholder) ──
    // To show this one, set:  defaultVariant: 'holiday'
    // Edit the eyebrow/headline/body for each holiday (hours, closures,
    // specials, etc.). Swap the image as appropriate.
    holiday: {
      image: '/assets/tablesetting.webp',
      imageAlt: "Happy Holiday, From the Tom Wahl's Crew",
      eyebrow: 'Upcoming Holiday Hours',
      headline: 'Celebrate the Holidays With Us',
      body: 'Holiday hours may vary by location. Check your nearest Tom Wahl’s before you head out — and treat the family to a classic meal.'
      // No `cta` / `badges` here → this variant shows no button at all.
    }

  };

  /* ===============================================================
     ENGINE — no need to edit below this line
     =============================================================== */

  var CFG = LIGHTBOX_CONFIG;
  var ROOT_CLASS = 'tw-lb-root';     // the injected overlay (stays sharp/un-blurred)
  var ACTIVE_CLASS = 'tw-lb-active'; // added to <body> while open (drives the bokeh)
  var els = {};                      // cached DOM references
  var autoCloseTimer = null;         // setTimeout handle for auto fade-out
  var lastFocused = null;            // element to restore focus to on close
  var isOpen = false;

  // Respect the visitor's "reduce motion" preference (and shorten animations).
  function prefersReducedMotion() {
    return CFG.respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function fadeDuration() {
    return prefersReducedMotion() ? 0 : CFG.fadeMs;
  }

  /* ── Console / analytics logging ──────────────────────────────
     Logs to the console when debug is on. To send these to Google
     Analytics 4, uncomment the gtag line below (GA4 must be loaded). */
  function log(action, variantKey) {
    if (CFG.debug) {
      console.log('[TW Lightbox] ' + action, { variant: variantKey });
    }
    // --- Optional GA4 hook (uncomment to enable) ---
    // if (typeof gtag === 'function') {
    //   gtag('event', CFG.ga4Event + '_' + action, { variant: variantKey });
    // }
  }

  /* ── Frequency check via localStorage ─────────────────────────── */
  function shouldShow() {
    var stored;
    try {
      stored = window.localStorage.getItem(CFG.storageKey);
    } catch (e) {
      return true; // localStorage blocked (e.g. private mode) — just show it.
    }
    if (!stored) return true;
    if (CFG.showOnceEver) return false;           // already shown once, never again
    if (CFG.frequencyHours <= 0) return true;     // 0 = always show (testing)
    var last = parseInt(stored, 10);
    if (isNaN(last)) return true;
    var elapsedHrs = (Date.now() - last) / (1000 * 60 * 60);
    return elapsedHrs >= CFG.frequencyHours;
  }
  function markShown() {
    try {
      window.localStorage.setItem(CFG.storageKey, String(Date.now()));
    } catch (e) { /* ignore storage errors */ }
  }

  /* ── Inject the scoped stylesheet (runs once) ─────────────────── */
  function injectStyles() {
    if (document.getElementById('tw-lb-styles')) return;
    var css =
      ':root{--tw-lb-fade:' + CFG.fadeMs + 'ms;}' +

      /* Page-behind bokeh blur — fades in/out on the same schedule */
      'body.' + ACTIVE_CLASS + '>*:not(.' + ROOT_CLASS + '){' +
        'filter:blur(6px);transition:filter var(--tw-lb-fade) ease;}' +

      /* Overlay root + backdrop */
      '.' + ROOT_CLASS + '{position:fixed;inset:0;z-index:9999;display:flex;' +
        'align-items:center;justify-content:center;padding:20px;' +
        'opacity:0;visibility:hidden;transition:opacity var(--tw-lb-fade) ease,' +
        'visibility var(--tw-lb-fade) ease;}' +
      '.' + ROOT_CLASS + '.is-open{opacity:1;visibility:visible;}' +
      '.tw-lb-backdrop{position:absolute;inset:0;background:rgba(20,12,14,0.72);' +
        'overflow:hidden;}' +

      /* Soft out-of-focus "bokeh" light circles */
      '.tw-lb-bokeh{position:absolute;border-radius:50%;filter:blur(8px);' +
        'opacity:0.45;pointer-events:none;}' +
      '.tw-lb-bokeh.b1{width:120px;height:120px;top:12%;left:14%;' +
        'background:radial-gradient(circle,rgba(255,210,120,0.9),transparent 70%);}' +
      '.tw-lb-bokeh.b2{width:80px;height:80px;top:64%;left:22%;' +
        'background:radial-gradient(circle,rgba(255,120,140,0.8),transparent 70%);}' +
      '.tw-lb-bokeh.b3{width:160px;height:160px;top:20%;right:10%;' +
        'background:radial-gradient(circle,rgba(255,255,255,0.7),transparent 70%);}' +
      '.tw-lb-bokeh.b4{width:90px;height:90px;bottom:14%;right:24%;' +
        'background:radial-gradient(circle,rgba(255,180,90,0.85),transparent 70%);}' +
      '@keyframes tw-lb-drift{0%{transform:translateY(0)}50%{transform:translateY(-16px)}100%{transform:translateY(0)}}' +
      '.tw-lb-bokeh{animation:tw-lb-drift 7s ease-in-out infinite;}' +
      '.tw-lb-bokeh.b2{animation-duration:9s;}' +
      '.tw-lb-bokeh.b3{animation-duration:11s;}' +
      '.tw-lb-bokeh.b4{animation-duration:8s;}' +

      /* Dialog card */
      '.tw-lb-dialog{position:relative;z-index:1;width:100%;max-width:440px;' +
        'background:var(--white,#fff);color:var(--dark,#1a1a1a);' +
        'border-radius:var(--radius-lg,20px);overflow:hidden;' +
        'box-shadow:var(--shadow-lg,0 8px 40px rgba(0,0,0,0.12));' +
        'font-family:"Outfit",-apple-system,Segoe UI,sans-serif;' +
        'transform:translateY(16px) scale(0.98);' +
        'transition:transform var(--tw-lb-fade) ease;max-height:92vh;overflow-y:auto;}' +
      '.' + ROOT_CLASS + '.is-open .tw-lb-dialog{transform:translateY(0) scale(1);}' +

      /* Header: red checker stripe + small logo */
      '.tw-lb-header{position:relative;background:var(--cream,#faf8f5);' +
        'padding:22px 20px 12px;text-align:center;}' +
      '.tw-lb-header::before{content:"";position:absolute;top:0;left:0;right:0;' +
        'height:14px;background-image:url("/assets/redchecker.jpg");' +
        'background-repeat:repeat-x;background-size:auto 100%;}' +
      '.tw-lb-logo{position:relative;height:54px;width:auto;margin:-6px auto 0;}' +

      /* Close "X" button (top-right) */
      '.tw-lb-close{position:absolute;top:20px;right:14px;z-index:2;' +
        'width:34px;height:34px;border:none;border-radius:50%;cursor:pointer;' +
        'background:rgba(0,0,0,0.06);color:var(--dark,#1a1a1a);font-size:20px;' +
        'line-height:1;display:flex;align-items:center;justify-content:center;' +
        'transition:background .2s,transform .2s;}' +
      '.tw-lb-close:hover{background:var(--red,#C8102E);color:#fff;transform:rotate(90deg);}' +
      '.tw-lb-close:focus-visible{outline:3px solid var(--red,#C8102E);outline-offset:2px;}' +

      /* Body content */
      '.tw-lb-body{padding:22px 28px 28px;text-align:center;}' +
      '.tw-lb-img{width:100%;max-width:480px;height:auto;margin:0 auto 16px;}' +
      '.tw-lb-eyebrow{display:inline-block;font-size:0.78rem;font-weight:700;' +
        'text-transform:uppercase;letter-spacing:0.14em;color:var(--red,#C8102E);' +
        'margin-bottom:8px;}' +
      '.tw-lb-headline{font-size:1.55rem;font-weight:900;line-height:1.15;' +
        'letter-spacing:-0.02em;margin:0 0 10px;}' +
      '.tw-lb-text{font-size:0.98rem;line-height:1.55;color:var(--gray-600,#666);' +
        'margin:0 0 20px;}' +

      /* Primary CTA button — matches .btn-order on order-online.html */
      '.tw-lb-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;' +
        'background:var(--red,#C8102E);color:var(--white,#fff);border:none;' +
        'border-radius:50px;font-weight:700;font-size:1rem;cursor:pointer;' +
        'font-family:inherit;white-space:nowrap;transition:background .2s;}' +
      '.tw-lb-cta:hover{background:var(--red-dark,#a00d24);}' +
      '.tw-lb-cta:focus-visible{outline:3px solid var(--dark,#1a1a1a);outline-offset:3px;}' +

      /* App-store badges (loyalty variant) */
      '.tw-lb-badges{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center;}' +
      '.tw-lb-badges a{display:inline-block;transition:transform .2s;}' +
      '.tw-lb-badges a:hover{transform:translateY(-2px);}' +
      '.tw-lb-badges img{height:48px;width:auto;}' +
      '.tw-lb-badges a:focus-visible{outline:3px solid var(--red,#C8102E);outline-offset:3px;border-radius:8px;}' +

      /* Responsive */
      '@media (max-width:600px){' +
        '.tw-lb-dialog{max-width:100%;}' +
        '.tw-lb-headline{font-size:1.3rem;}' +
        '.tw-lb-text{font-size:0.9rem;}' +
        '.tw-lb-body{padding:18px 20px 24px;}' +
        '.tw-lb-badges img{height:42px;}' +
      '}' +

      /* Reduced motion: drop the drift + transforms */
      '@media (prefers-reduced-motion: reduce){' +
        '.tw-lb-bokeh{animation:none;}' +
        '.tw-lb-dialog,.tw-lb-cta:hover,.tw-lb-close:hover{transition:none;transform:none;}' +
      '}';

    var style = document.createElement('style');
    style.id = 'tw-lb-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ── Small helper to create elements ──────────────────────────── */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined) return; // skip unset attributes
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  /* ── Build the lightbox DOM for the chosen variant ────────────── */
  function buildDOM(variant) {
    var headlineId = 'tw-lb-headline';
    var bodyId = 'tw-lb-text';

    // Backdrop with optional bokeh dots
    var backdropChildren = [];
    if (CFG.enableBokeh) {
      ['b1', 'b2', 'b3', 'b4'].forEach(function (c) {
        backdropChildren.push(el('span', { class: 'tw-lb-bokeh ' + c, 'aria-hidden': 'true' }));
      });
    }
    var backdrop = el('div', { class: 'tw-lb-backdrop' }, backdropChildren);

    // Close button
    var closeBtn = el('button', {
      class: 'tw-lb-close', type: 'button',
      'aria-label': 'Close', html: '&times;'
    });

    // Header (checker stripe + logo)
    var header = el('div', { class: 'tw-lb-header' }, [
      el('img', {
        class: 'tw-lb-logo', src: '/assets/tomwahlslogo.webp',
        alt: "Tom Wahl's", loading: 'eager'
      })
    ]);

    // Body content
    var bodyChildren = [];
    if (variant.image) {
      bodyChildren.push(el('img', {
        class: 'tw-lb-img', src: variant.image,
        alt: variant.imageAlt || '', loading: 'eager'
      }));
    }
    if (variant.eyebrow) bodyChildren.push(el('span', { class: 'tw-lb-eyebrow', text: variant.eyebrow }));
    bodyChildren.push(el('h2', { class: 'tw-lb-headline', id: headlineId, text: variant.headline || '' }));
    if (variant.body) bodyChildren.push(el('p', { class: 'tw-lb-text', id: bodyId, text: variant.body }));

    // CTA: app-store badges (loyalty) OR a primary button
    if (variant.badges && variant.badges.length) {
      var badgeWrap = el('div', { class: 'tw-lb-badges' });
      variant.badges.forEach(function (b) {
        var link = el('a', {
          href: b.href, target: '_blank', rel: 'noopener',
          'aria-label': b.alt || 'Download the app'
        }, [el('img', { src: b.src, alt: b.alt || '' })]);
        link.addEventListener('click', function () { log('cta_click', CFG.defaultVariant); });
        badgeWrap.appendChild(link);
      });
      bodyChildren.push(badgeWrap);
    } else if (variant.cta) {
      var cta;
      if (variant.cta.onClick) {
        cta = el('button', { class: 'tw-lb-cta', type: 'button', text: variant.cta.label || 'Learn More' });
        cta.addEventListener('click', function () {
          log('cta_click', CFG.defaultVariant);
          try { variant.cta.onClick(); } catch (e) { console.error(e); }
        });
      } else {
        cta = el('a', { class: 'tw-lb-cta', href: variant.cta.href || '#', text: variant.cta.label || 'Learn More' });
        cta.addEventListener('click', function () { log('cta_click', CFG.defaultVariant); });
      }
      bodyChildren.push(cta);
    }

    var body = el('div', { class: 'tw-lb-body' }, bodyChildren);

    // Dialog
    var dialog = el('div', {
      class: 'tw-lb-dialog', role: 'dialog', 'aria-modal': 'true',
      'aria-labelledby': headlineId, 'aria-describedby': variant.body ? bodyId : null
    }, [closeBtn, header, body]);

    // Root overlay
    var root = el('div', { class: ROOT_CLASS }, [backdrop, dialog]);

    // Wire close interactions
    closeBtn.addEventListener('click', hide);
    if (CFG.closeOnBackdrop) {
      root.addEventListener('click', function (e) {
        if (e.target === root || e.target === backdrop) hide();
      });
    }

    els.root = root;
    els.dialog = dialog;
    els.closeBtn = closeBtn;
    return root;
  }

  /* ── Focus trap ───────────────────────────────────────────────── */
  var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  function getFocusable() {
    return Array.prototype.slice.call(els.dialog.querySelectorAll(FOCUSABLE));
  }
  function onKeydown(e) {
    if (e.key === 'Escape' && CFG.closeOnEsc) { hide(); return; }
    if (e.key !== 'Tab') return;
    var items = getFocusable();
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ── Body scroll lock (with scrollbar-width compensation) ─────── */
  function lockScroll() {
    var sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sw > 0) document.body.style.paddingRight = sw + 'px';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /* ── Show / Hide ──────────────────────────────────────────────── */
  function show() {
    if (isOpen) return;
    isOpen = true;

    var variant = VARIANTS[CFG.defaultVariant] || VARIANTS[Object.keys(VARIANTS)[0]];
    injectStyles();
    var root = buildDOM(variant);
    document.body.appendChild(root);

    lastFocused = document.activeElement;
    lockScroll();
    document.body.classList.add(ACTIVE_CLASS);

    // Force reflow so the fade-in transition runs, then open.
    void root.offsetWidth;
    root.classList.add('is-open');

    document.addEventListener('keydown', onKeydown, true);
    // Move focus into the dialog (the close button) once visible.
    setTimeout(function () { if (els.closeBtn) els.closeBtn.focus(); }, fadeDuration());

    markShown();
    log('show', CFG.defaultVariant);

    // Arm the auto fade-out timer.
    if (CFG.showDelayMs > 0) {
      autoCloseTimer = setTimeout(hide, CFG.showDelayMs);
    }
  }

  function hide() {
    if (!isOpen) return;
    isOpen = false;

    if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null; }
    document.removeEventListener('keydown', onKeydown, true);

    if (els.root) els.root.classList.remove('is-open');
    document.body.classList.remove(ACTIVE_CLASS); // bokeh fades out with the box

    var dur = fadeDuration();
    setTimeout(function () {
      if (els.root && els.root.parentNode) els.root.parentNode.removeChild(els.root);
      unlockScroll();
      // Restore focus to whatever the visitor was on before.
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      els = {};
    }, dur);
  }

  /* ── Public API (also enables SPA usage) ──────────────────────── */
  // For single-page apps: after a route change, call TWLightbox.show()
  // (it still respects the frequency cap). Use TWLightbox.reset() to clear
  // the "last shown" memory — handy for testing.
  window.TWLightbox = {
    show: show,
    hide: hide,
    reset: function () {
      try { window.localStorage.removeItem(CFG.storageKey); } catch (e) {}
      if (CFG.debug) console.log('[TW Lightbox] frequency memory cleared');
    }
  };

  /* ── Auto-init on page load ───────────────────────────────────── */
  function init() {
    if (shouldShow()) show();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); // DOM already parsed (e.g. when loaded with `defer`)
  }

})();
