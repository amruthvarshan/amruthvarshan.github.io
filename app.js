/* ============================================================================
   app.js — THE BEHAVIOUR LAYER
   ----------------------------------------------------------------------------
   Shared by every page. Currently that's just index.html — a single-page
   site with the career chart, PDF export and all content in one place.
   Exposes window.UI:

     UI.esc(str)                  HTML-escape
     UI.theme()                   wire the light/dark toggle
     UI.reveal()                  scroll reveal + chart growth
     UI.nav()                     sliding underline + active section
     UI.progress()                the 2px reading rule
     UI.glance(el, data)          the At-a-glance band
     UI.carousel(el)              turn a .carousel into a working one
     UI.chart(el, career, opts)   the career timeline
         opts.expand : true → rows expand in place to show full detail

   years(from,to), slug(str) and axisFor(career) are internal helpers used
   only by chart() — they used to be exposed on UI too, but nothing outside
   this file ever called them that way, so they're private now.

   MOTION CONTRACT
     Nothing animates on its own. Everything is driven by the pointer or the
     scroll position, everything is interruptible, and every effect is off
     under prefers-reduced-motion. Content is never hidden behind an effect:
     if this script fails, .no-js is never removed and the page renders
     complete and static.
   ========================================================================== */

window.UI = (function () {
  "use strict";

  var CALM = window.matchMedia
    ? matchMedia('(prefers-reduced-motion:reduce)').matches : false;
  var FINE = window.matchMedia
    ? matchMedia('(hover:hover) and (pointer:fine)').matches : false;

  var NOW = (function () {
    var d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  })();

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* Duration is derived from the same decimal years that place the bar, so
     the label can never disagree with the geometry. */
  function years(from, to) {
    var m = Math.round((to - from) * 12);
    if (m < 12) return m + ' mo';
    var y = Math.max(1, Math.round(m / 12));
    return y + (y === 1 ? ' yr' : ' yrs');
  }

  /* ---------------------------------------------------------------- AXIS --
     Derived from the roles themselves, so adding a workplace needs no other
     edit anywhere: the axis stretches, the ticks re-space, every bar
     repositions and the durations recompute. Anything set explicitly in
     `career.axis` still wins, so the range can be pinned by hand. */
  function axisFor(career) {
    var o = career.axis || {};
    var ends = career.roles.map(function (r) { return r.to === null ? NOW : r.to; });
    var starts = career.roles.map(function (r) { return r.from; });
    var from = o.from != null ? o.from : Math.floor(Math.min.apply(null, starts));
    var to = o.to != null ? o.to : Math.max(Math.max.apply(null, ends), NOW) + 0.35;
    var now = Math.min(NOW, to - 0.25);

    var ticks = o.ticks;
    if (!ticks) {
      ticks = [];
      var stepY = (to - from) > 16 ? 4 : 2;
      for (var y = from; y <= to - 0.6; y += stepY) ticks.push(y);
    }
    /* drop any tick that would collide with the "now" marker */
    var span = to - from;
    ticks = ticks.filter(function (t) { return Math.abs(t - now) / span > 0.075; });

    return { from: from, to: to, ticks: ticks, now: now };
  }

  /* -------------------------------------------------------------- THEME --
     Follows the device. Falls back to dark when the device has no preference
     or the browser can't report one. Persistence is commented out because
     browser storage is blocked in some preview frames — uncomment both lines
     once this is on your own domain. */
  function theme() {
    var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: light)') : null;
    var btn = document.getElementById('tog');

    function apply(t, animate) {
      if (animate && !CALM) {
        document.documentElement.classList.add('theming');
        setTimeout(function () {
          document.documentElement.classList.remove('theming');
        }, 560);
      }
      document.documentElement.dataset.theme = t;
      if (btn) btn.setAttribute('aria-label',
        t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    // var saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
    var saved = null;
    apply(saved || (mq && mq.matches ? 'light' : 'dark'), false);

    /* Chrome and Edge simulate prefers-color-scheme: light for the print
       preview render, regardless of the actual OS setting — it's meant to
       match "printing on white paper" expectations. That fires this exact
       listener and would silently flip the page's theme around the print
       flow, which is what made a dark export come out white even with
       Background Graphics enabled: by print time the theme had genuinely
       changed, not just failed to render. The printing flag blocks the
       listener for the print window itself, and snapshotting the theme
       going in lets it force-restore that value once the flow ends —
       but the simulated media query can revert to the *real* system
       value in a separate tick that lands after afterprint has already
       cleared the flag, which on a device whose OS is itself in dark
       mode looks exactly like "it keeps resetting to my dark setting".
       A short grace window after afterprint, with one more restore at
       the end of it, closes that gap without needing to know exactly
       when the stray event lands. */
    var printing = false, themeBeforePrint = null, printGrace = null;
    addEventListener('beforeprint', function () {
      if (printGrace) { clearTimeout(printGrace); printGrace = null; }
      printing = true;
      themeBeforePrint = document.documentElement.dataset.theme;
    });
    addEventListener('afterprint', function () {
      apply(themeBeforePrint, false);
      printGrace = setTimeout(function () {
        apply(themeBeforePrint, false);
        printing = false;
        themeBeforePrint = null;
        printGrace = null;
      }, 500);
    });

    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) {
        if (printing) return;
        apply(e.matches ? 'light' : 'dark', true);
      });
    }
    if (btn) btn.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      // try { localStorage.setItem('theme', next); } catch (e) {}
      apply(next, true);
    });
  }

  /* ------------------------------------------------------------- REVEAL -- */
  /* Counts a [data-count] element's digit up from 0 once, the same instant
     its .rv ancestor gets revealed — never on a value the reader hasn't
     scrolled to yet, and never twice. Formats to match the target's own
     precision (an integer target counts in whole numbers; a decimal one
     keeps one decimal place throughout) so the digits never look more
     precise mid-count than the number they're counting toward. */
  function countUp(num) {
    var to = parseFloat(num.getAttribute('data-count'));
    if (!isFinite(to)) return;
    var decimals = (String(to).split('.')[1] || '').length;
    var start = null, ms = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / ms);
      var eased = 1 - Math.pow(1 - p, 3);
      num.textContent = (to * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function reveal() {
    var els = [].slice.call(document.querySelectorAll('.rv'));
    function setCount(target) {
      var num = target.querySelector('[data-count]');
      if (num) num.textContent = num.getAttribute('data-count');
    }
    function showAll() {
      els.forEach(function (el) { el.classList.add('in'); setCount(el); });
      [].forEach.call(document.querySelectorAll('.chart'), function (c) { c.classList.add('lit'); });
    }
    if (CALM || !('IntersectionObserver' in window)) return showAll();

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var c = e.target.classList.contains('chart')
          ? e.target : e.target.querySelector('.chart');
        if (c) c.classList.add('lit');
        var num = e.target.querySelector('[data-count]');
        if (num) countUp(num);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- NAV -- */
  function nav() {
    var bar = document.getElementById('nav');
    if (!bar) return;
    var inkEl = document.getElementById('ink');
    var links = [].slice.call(bar.querySelectorAll('a'));
    var active = null;

    function slide(a) {
      if (!inkEl) return;
      if (!a) { inkEl.style.opacity = 0; return; }
      inkEl.style.opacity = 1;
      inkEl.style.width = a.offsetWidth + 'px';
      inkEl.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    }
    links.forEach(function (a) {
      a.addEventListener('pointerenter', function () { slide(a); });
      a.addEventListener('focus', function () { slide(a); });
    });
    bar.addEventListener('pointerleave', function () { slide(active); });
    addEventListener('resize', function () { slide(active); }, { passive: true });

    if (!('IntersectionObserver' in window)) return;
    var secs = links
      .filter(function (l) { return (l.getAttribute('href') || '').charAt(0) === '#'; })
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        active = links.filter(function (l) {
          return l.getAttribute('href') === '#' + e.target.id;
        })[0] || active;
      });
      links.forEach(function (l) { l.setAttribute('aria-current', l === active); });
      slide(active);
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }

  /* ----------------------------------------------------------- PROGRESS -- */
  function progress() {
    var bar = document.getElementById('prog');
    if (!bar || CALM) return;
    var queued = false;
    addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
        queued = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------- GLANCE --
     Skill level is conveyed by a tooltip on hover/focus, not colour — every
     item reads in the same plain ink, so nothing here competes with the
     accent used elsewhere on the page for unrelated things. A tiered item
     gets a dotted underline (the same "hover for more" cue as a native
     <abbr title>) and a normal cursor — no colour, no cursor change, just
     that underline as the only hint there's more to see; a plain item
     (no tier data) gets neither, since it has nothing to show. The words
     for each tier level live in site-data.js (glance.tierLabels), not
     here, so renaming a level needs no code change. */
  function tierLabel(labels, t) { return (labels && labels[t]) || ''; }

  function glance(el, g) {
    if (!el) return;
    var leadNum = parseFloat(g.lead.value);
    var leadValue = isFinite(leadNum) && String(leadNum) === String(g.lead.value).trim()
      ? '<span class="num" data-count="' + leadNum + '">0</span>'
      : esc(g.lead.value);
    el.innerHTML =
      '<div class="lead"><b>' + leadValue + '<i>' + esc(g.lead.unit) + '</i></b>' +
      '<span>' + esc(g.lead.note) + '</span></div>' +
      g.groups.map(function (grp) {
        return '<div class="grp"><h4>' + esc(grp.label) + '</h4><ul>' +
          grp.items.map(function (i) {
            if (!i.tier) return '<li>' + esc(i.name) + '</li>';
            return '<li class="has-tip" tabindex="0">' + esc(i.name) +
              '<span class="tip" role="tooltip">' + esc(tierLabel(g.tierLabels, i.tier)) + '</span></li>';
          }).join('') + '</ul></div>';
      }).join('');

    /* Dim/highlight is triggered per chip, not per group list: the <ul> is
       a flex-wrap container whose own bounding box can include empty space
       beside short chips (the row doesn't fill the column width), so a
       listener on the <ul> fires before the cursor ever reaches a chip and
       dims the whole group with nothing highlighted. Listening on each
       <li> means the pointer has to actually be over a chip before its
       siblings dim, and that chip is the one CSS keeps at full opacity. */
    [].forEach.call(el.querySelectorAll('.grp li'), function (li) {
      var grp = li.parentElement.parentElement;
      li.addEventListener('pointerenter', function () { grp.classList.add('dim'); });
      li.addEventListener('pointerleave', function () { grp.classList.remove('dim'); });
    });
  }

  /* ----------------------------------------------------------- CAROUSEL -- */
  function carousel(root) {
    if (!root) return;
    var sc = root.querySelector('.scroller');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var fill = root.querySelector('.ctrack i');
    var count = root.querySelector('.ccount');
    if (!sc) return;

    function step() {
      var first = sc.firstElementChild;
      return first ? first.getBoundingClientRect().width : sc.clientWidth * 0.8;
    }
    function update() {
      var max = sc.scrollWidth - sc.clientWidth;
      var ratio = sc.clientWidth / sc.scrollWidth;
      if (fill) {
        fill.style.width = Math.min(ratio * 100, 100) + '%';
        fill.style.transform = 'translateX(' +
          (max > 0 ? (sc.scrollLeft / max) * ((1 / ratio) - 1) * 100 : 0) + '%)';
      }
      if (prev) prev.disabled = sc.scrollLeft < 4;
      if (next) next.disabled = sc.scrollLeft > max - 4;
      if (count) {
        var n = sc.children.length;
        var shown = Math.max(1, Math.round(sc.clientWidth / step()));
        count.textContent = Math.min(n, Math.round(sc.scrollLeft / step()) + shown) + ' / ' + n;
      }
    }
    if (prev) prev.addEventListener('click', function () { sc.scrollLeft -= step(); });
    if (next) next.addEventListener('click', function () { sc.scrollLeft += step(); });
    sc.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  }

  /* -------------------------------------------------------------- CHART -- */
  function chart(el, career, opts) {
    if (!el) return;
    opts = opts || {};
    var ax = axisFor(career);
    var span = ax.to - ax.from;
    var pos = function (y) { return ((y - ax.from) / span) * 100; };

    var rows = career.roles.map(function (r) {
      var to = r.to === null ? ax.to : r.to;
      var left = pos(r.from), w = Math.max(pos(to) - left, 1.2);
      var id = slug(r.company);
      var inner =
        '<div class="g">' +
          '<div class="who"><b>' + esc(r.company) + '</b><span>' + esc(r.where) + '</span></div>' +
          '<div class="rt">' +
            '<div class="top"><p class="role">' + esc(r.role) + '</p>' +
            '<span class="when">' + esc(r.dates) + '</span></div>' +
            '<div class="tracked"><div class="bar bar-' + esc(r.tone) + '" ' +
              'style="left:' + left.toFixed(2) + '%;--w:' + w.toFixed(2) + '%">' +
              '<span class="dur">' + years(r.from, to) + '</span></div></div>' +
            '<p class="line">' + esc(r.line) + '</p>' +
          '</div>' +
        '</div>';

      if (opts.expand) {
        return '<div class="crow" id="' + id + '" data-key="' + id + '">' +
          '<button class="crowbtn" type="button" aria-expanded="false" aria-controls="d-' + id + '">' +
            inner +
            '<span class="ctl" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
              'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M6 9l6 6 6-6"/></svg></span>' +
          '</button>' +
          '<div class="detail" id="d-' + id + '"><div class="inner"><div class="g">' +
            '<div class="mg"></div><div class="dbody">' +
              '<ul>' + (r.detail || []).map(function (b) {
                return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
              '<div class="tags">' + (r.tags || []).map(function (t) {
                return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
            '</div></div></div></div>' +
        '</div>';
      }
      return '<div class="crow">' + inner + '</div>';
    }).join('');

    /* The axis only needs to reserve rowpad+control space when the rows
       themselves do (opts.expand) — the plain, unpadded row mode has
       nothing to match, so the axis stays unreserved too. */
    var ticksInner =
      '<div class="g"><div></div><div class="ticks">' +
        ax.ticks.map(function (t) {
          return '<i style="left:' + pos(t).toFixed(2) + '%">' + Math.round(t) + '</i>';
        }).join('') +
        '<i class="now" style="left:' + pos(ax.now).toFixed(2) + '%">now</i>' +
      '</div></div>';

    el.innerHTML =
      '<div class="rows">' + rows + '</div>' +
      '<div class="guide" hidden><span></span></div>' +
      '<div class="axis">' + (opts.expand
        ? '<div class="axisrow">' + ticksInner + '<span class="ctlspace" aria-hidden="true"></span></div>'
        : ticksInner
      ) + '</div>';

    /* -- label fit ---------------------------------------------------------
       Computed from the bar's TARGET percentage rather than its currently
       rendered width, so it is right on the first paint instead of only
       after the grow animation finishes. */
    function fit() {
      [].forEach.call(el.querySelectorAll('.tracked'), function (track) {
        var bar = track.querySelector('.bar');
        var dur = bar && bar.querySelector('.dur');
        if (!dur) return;
        var target = parseFloat(bar.style.getPropertyValue('--w')) || 0;
        var px = track.getBoundingClientRect().width * target / 100;
        var need = (dur.getBoundingClientRect().width || dur.textContent.length * 7.2) + 26;
        bar.classList.toggle('out', px < need);
      });
    }
    fit();
    addEventListener('resize', fit, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    /* -- hover guide -------------------------------------------------------
       The TRIGGER zone is the whole row — hovering anywhere in it (the
       margin column, the job title, the description line, empty padding)
       shows the guide. The line's own DRAWN position is unrelated to that
       and stays fixed to that row's geometry: from just above its job title
       down to the bottom of its own bar, so it never reads into a
       neighbouring row or an expanded description.

       "Row" for hit-testing means `.crowbtn` where it exists (the CV page's
       expandable summary) or `.crow` itself (the homepage's plain row) —
       either way this naturally excludes an open `.detail` panel, since
       that is a sibling sitting outside both. Pointer devices only, off
       entirely under reduced motion. */
    if (FINE && !CALM) {
      var guide = el.querySelector('.guide');
      var label = guide.querySelector('span');
      var guideRows = [].slice.call(el.querySelectorAll('.crow'));

      el.addEventListener('pointermove', function (e) {
        var c = el.getBoundingClientRect();
        var hitTrack = null, hitTitle = null;

        for (var i = 0; i < guideRows.length; i++) {
          var row = guideRows[i];
          var summary = row.querySelector('.crowbtn') || row;
          var track = row.querySelector('.tracked');
          var title = row.querySelector('.top');
          if (!track || !title) continue;
          var sr = summary.getBoundingClientRect();
          if (e.clientY >= sr.top && e.clientY <= sr.bottom &&
              e.clientX >= sr.left && e.clientX <= sr.right) {
            hitTrack = track.getBoundingClientRect();
            hitTitle = title.getBoundingClientRect();
            break;
          }
        }
        if (!hitTrack) { guide.hidden = true; return; }

        /* the line's x position still reads off the track's own scale;
           clamped rather than hidden, so hovering the margin column (left
           of the track) rests the line at the row's earliest year */
        var x = e.clientX - hitTrack.left;
        if (x < 0) x = 0;
        if (x > hitTrack.width) x = hitTrack.width;

        var lineTop = hitTitle.top - c.top - 8;     // sits just above the title
        var lineBottom = hitTrack.bottom - c.top;   // stops at the bar, nothing below it
        guide.hidden = false;
        guide.style.left = (hitTrack.left - c.left + x) + 'px';
        guide.style.top = lineTop + 'px';
        guide.style.height = Math.max(lineBottom - lineTop, 0) + 'px';
        label.textContent = Math.floor(ax.from + (x / hitTrack.width) * span);
      });
      el.addEventListener('pointerleave', function () { guide.hidden = true; });
    }

    /* -- expand in place --------------------------------------------------- */
    if (opts.expand) {
      var rowEls = [].slice.call(el.querySelectorAll('.crow'));
      var open = function (row, on) {
        row.classList.toggle('open', on);
        row.querySelector('.crowbtn').setAttribute('aria-expanded', on ? 'true' : 'false');
      };
      rowEls.forEach(function (row) {
        row.querySelector('.crowbtn').addEventListener('click', function () {
          open(row, !row.classList.contains('open'));
        });
      });

      /* every row starts collapsed. The only exception is a direct deep
         link — e.g. sharing index.html#zynga opens and scrolls to that
         one role — which is a link target, not a default. */
      var target = null;
      try { target = location.hash ? el.querySelector(location.hash) : null; } catch (e) {}
      if (target && target.classList.contains('crow')) {
        open(target, true);
        setTimeout(function () {
          target.scrollIntoView({ behavior: CALM ? 'auto' : 'smooth', block: 'center' });
        }, 260);
      }

      var all = document.getElementById('expand-all');
      if (all) all.addEventListener('click', function () {
        var anyClosed = rowEls.some(function (r) { return !r.classList.contains('open'); });
        rowEls.forEach(function (r) { open(r, anyClosed); });
        all.textContent = anyClosed ? 'Collapse all' : 'Expand all';
      });
    }
  }

  return {
    calm: CALM, fine: FINE, now: NOW,
    esc: esc,
    theme: theme, reveal: reveal, nav: nav, progress: progress,
    glance: glance, carousel: carousel, chart: chart
  };
})();
