# Amruth Varshan — portfolio & CV

The live site. Everything it says lives in one data file, everything it looks
like lives in one stylesheet, everything it does lives in one behaviour file,
and there's a private page for editing the data file without hand-editing
JSON.

    site-data.js   the content layer    — everything the site says
    theme.css      the theme layer      — tokens, components, responsive
    app.js         the behaviour layer  — theme toggle, motion, carousel, chart
    index.html     the one page — hero, work, writing, career, skills,
                   education, about, and the PDF print sheet
    admin.html     the private editor — a form over site-data.js, reads
                   without a token, writes to GitHub with one

No build step, no framework, no dependencies except two Google fonts. All
five files sit in the root of `amruthvarshan.github.io`. The one other thing
the repo root needs is `images/favicon.svg` — `index.html` links to it as
`/images/favicon.svg` (root-relative, so it resolves the same regardless of
domain); nothing breaks if it's ever missing, the tab just shows no icon.

This started as two pages — a homepage and a separate full CV page — but once
the career chart could expand each role in place, the second page had nothing
left to justify its existence: the chart *is* the full CV now. Everything the
CV page carried that the homepage didn't (Education, the PDF export, the print
sheet) moved onto the single page instead of being deleted.

---

## The one rule

**Content lives in `site-data.js`. Style lives in `theme.css`. Behaviour lives
in `app.js`. `index.html` contains structure only.**

It contains no sentence of content and no colour value of its own. If you find
yourself typing prose or a hex code into it, that belongs in `site-data.js` or
`theme.css` instead. In practice you shouldn't need to open `site-data.js`
directly either — that's what `admin.html` is for.

---

## The data model

`site-data.js` is plain JSON assigned to `window.SITE`, with a fixed comment
header above it that both `index.html` and `admin.html`'s generator treat as
off-limits — hand-edit the JSON below it if you want, but the header itself
gets overwritten verbatim on the next save from the admin page.

The top-level keys are ordered to match the page itself, top to bottom:

    nav            header link row — {text, href} per link, any count
    pdfButtons     header's Preview PDF / Save PDF pair — see below
    name           hero name
    title          hero byline list ("Game designer", "Narrative designer"…)
    statement      hero pitch sentence
    rev            the small "rev. 2026" margin label
    availability   hero "Currently" card's "Open to roles" line
    heroButtons    hero's row of calls to action — {text, href, style}
    work           Work section: {heading, byline, countLabel, items}
    writing        Writing section: {heading, byline, countLabel,
                   readMoreText, items}
    career         Career section: {heading, byline, countLabel,
                   expandAllText, roles}
    glance         At a glance section: {heading, byline, subtitle, lead,
                   tierLabels, groups}
    education      Education section: {heading, byline, subtitle, items}
    about          About section: {heading, byline, subtitle, marginLabel,
                   marginNote, paragraphs}
    contact        footer links — {text, href} per link

Every section (work/writing/career/glance/education/about) owns its own
heading and byline text directly, so editing what a section says and editing
its content live in the same place. `byline` can be an empty string — the
section just ends after its heading with no paragraph, the same pattern
`availability.text` uses. The section numbers (01–06) shown in the margin are
always computed from this same order, never typed or stored — reordering
which number a section gets is a page-structure change, not a content edit.

work/writing/career show a computed item count in their margin subtitle
rather than typed text: `countLabel` is just the unit noun ("projects",
"pieces", "roles") — the number itself is always `items.length` (or
`roles.length`), never hand-typed. glance/education/about instead take a
plain typed `subtitle`, since they don't have an underlying list to count.

`nav` and `heroButtons` are plain arrays — add or remove a link or a button
and the page follows, no other edit needed. `pdfButtons` isn't a list: it's
two fixed, named slots (`preview`, `save`), since each drives genuinely
different behaviour (one toggles the on-screen preview, the other opens the
print dialog) rather than being interchangeable links. Each slot has its own
`enabled`, `text` and `style` — show just one, both, or neither; reword
either; set either to `"solid"` or `"outline"` independently. Disabling one
never touches the other or the theme toggle beside them, and the header's
mobile layout (see Responsive) never breaks regardless of whether zero, one,
or two of them are showing.

---

## The admin page

`admin.html` is a private, single-page form over `site-data.js`. It's public
in the sense that anyone who finds the URL can open it — the repo is public,
so there's no hiding the path — but it ships with no credential in it and is
useless to a stranger without one.

**Reading is free.** Click **Connect** with the token field empty and it
fetches `site-data.js` straight from GitHub with no token at all, since
GitHub's API allows unauthenticated `GET`s against public repos. This is
what lets you open the form, edit, and preview on any machine — even one
that's never seen your token — at GitHub's lower unauthenticated rate limit
(60 requests/hour per IP, which is plenty for an editing session).
**Local copy** is the same idea for testing entirely offline: it reads
whatever `site-data.js` sits next to `admin.html` on whatever's serving the
page, with no network call to GitHub at all.

**Saving needs a token.** Paste a fine-grained GitHub personal access token
(scoped to just this repo, Contents: read and write) into the field and
click **Connect** again. If you already loaded data read-only, this doesn't
re-fetch and risk discarding edits you've made since — it just validates the
token and unlocks the Save button against the same file version you're
already looking at. Connect is one button either way — an empty token field
means "just read," a filled one means "read (if nothing's loaded yet) and
enable saving." **Save to GitHub** is disabled until both a real file
version and a token are present; **Download file** always works once
something's loaded, token or not, as a save-nothing way to inspect the
generated output.

On narrow screens, the header and footer both collapse — a small chevron
sits on the border between them and the rest of the page (pointing up on
the header, down on the footer, reversing once collapsed) — so the token
row and the save row don't permanently eat most of the screen on a phone.
Collapsed, the header keeps just the logo and the theme toggle above the
line and the Editor/Preview tabs below it; the footer collapses away
entirely, including the validation warnings beneath it. Neither is
persisted between visits — both start expanded on load. Desktop is
unaffected; there's nothing to collapse when there's already room for
everything.

The live preview pane renders the actual `index.html`/`theme.css`/`app.js`
with your in-progress edits substituted in — including the print sheet,
reachable via the preview's own "Preview PDF" button — so you're checking
the real page, not an approximation. The form validates a handful of
invariants before letting you save without at least a confirmation (exactly
one career role marked "Present," tier values in range, required fields on
work/writing/education non-empty) and generates the exact same fixed header
plus pretty-printed JSON that hand-editing would produce, so the file's diff
stays clean regardless of which path you edit through.

---

## The grid

The entire site is one two-column grid: a narrow right-aligned margin column
for metadata, and a content column. Every section obeys it, so a reader learns
one scanning position and never leaves it.

```html
<div class="wrap g">
  <div class="mg">Portfolio<em>rev. 2026</em></div>
  <div><!-- content --></div>
</div>
```

Below 1020px the margin column stops being a column and becomes an inline meta
line above its content. That single change is what carries the whole layout
onto a phone.

Section headers use `.shead`, which adds a section number in the margin, a
serif `h2`, an optional line of framing prose, and a rule that draws itself
left-to-right when the section is revealed. Sections are separated by air and
that drawn rule — never by a bare `<hr>`, which is what made the earlier
version feel abrupt. Sections alternate between plain paper and a raised
`.band` tone for rhythm, and that alternation now starts at the very top: the
hero carries the same raised background as the other bands, so it and Work
(the first two sections) don't repeat the same tone back to back the way
every other adjacent pair already didn't.

---

## Components

**At a glance** (`UI.glance`) — a horizontal band, placed below the career
chart. Five groups of short items, each item rendered as a chip: a flat
`--sink` fill, no border, no hover colour-shift. Border plus accent-on-hover
is this site's established language for things you can click (`.btn`,
`.cbtn`, `.tog` all use exactly it), so a chip — a label, not a control —
deliberately avoids the combination. The same markup serves every
breakpoint; `flex-wrap` reflows the identical chips rather than swapping to
a different visual language on either side of a breakpoint. Every chip does
scale up very slightly on hover (`transform:scale(1.05)`), a small tactile
nod that stops short of the border/colour-shift language reserved for real
controls.

Tools carry a `tier` (1 expert, 2 strong, 3 working); it started out as three
colours, but the accent and ink were already doing other jobs elsewhere on
the page, so reusing them here to mean "skill level" read as noise rather
than signal. The level now lives in a small tooltip, revealed on hover or
keyboard focus. The "there's more here" cue is the tiered chip's own
**dashed border** (darkening to `--muted` on hover), not an underline on the
text: an underline inside a filled box lands on the same pixel row as the
box's own bottom edge and the two visually erase each other, so that cue
needs a line of its own to own — the chip's border is that line. An untiered
chip has no border at all and so has nothing to collide with. Cursor stays
default either way. Hovering an item also dims its siblings.

**The words themselves — "Expert", "Strong", "Working" — live in
`site-data.js` at `glance.tierLabels`, not in any code file.** Rename one
there and the web tooltip picks it up immediately. The PDF doesn't use
`tierLabels` at all — Tools prints as plain chips with no tier information,
since there's no hover on paper to reveal it there. The `tier: 1/2/3`
numbers on each tool exist purely for the web tooltip and are never shown
as-is anywhere.

**Carousel** (`UI.carousel`) — one component, two uses. Native horizontal
scroll does the work, so touch swipe, trackpad and shift-wheel all come free
and keyboard users tab through cards which scrolls them into view. The arrows
and the progress rail are additions, not the mechanism; delete them and it
still works. Cards run off the right edge of the page so the row reads as
continuing rather than stopping.

**Career chart** (`UI.chart`) — the important one. Every bar is placed at its
true start on a shared axis, so the chart reads as a chart. The bar is thick
and carries the duration; the margin column carries the place; the dates sit
on the role line where a short bar can never clip them. `fit()` decides
label-inside vs label-outside from the bar's **target percentage**, not its
currently rendered width, so it is right on the first paint rather than only
after the grow animation finishes. The grow-in itself uses a spring-overshoot
easing (`--overshoot`, a curve that actually bounces past 1) rather than a
flat ease, so each bar settles with a small, one-time bounce — clipped
cleanly by the track (`overflow:hidden`) so the bounce never visually spills
past it.

The axis derives itself from the roles (`axisFor`, an internal helper private
to `chart()` — not part of the public `UI` object). Adding a workplace
needs no other edit: range, tick spacing, every bar position, every duration,
the homepage "Currently" block and the PDF strip all follow. Ticks that would
collide with the "now" marker are dropped automatically.

`opts.expand` makes each row open in place — the timeline and the full
history are one object, not the same information printed twice on two pages.
Every row starts **collapsed**; the only exception is a direct link with a
role's slug in the hash (`index.html#zynga`), which opens and scrolls to that
one row on load. That's a link target, not a default. "Expand all," the
button above the chart, is itself just a label in `career.expandAllText`
now — reword it in `site-data.js` and nothing else needs to change.

The row itself is a flex container: the existing margin-and-content grid as
one item, and the expand control (`.ctl`, a bordered circle with a chevron) as
a separate sibling. Because they're siblings rather than one absolutely
positioned over the other, the control can never collide with the dates text
next to it — regardless of how long a date string is, at any breakpoint. The
control is visible at rest, not only on hover, specifically so a reader never
has to guess that a row opens.

---

## Motion contract

Nothing animates on its own. Everything is driven by the pointer or the scroll
position, everything is interruptible, and every effect is off under
`prefers-reduced-motion` — checked once at load as `UI.calm`. Continuous
pointer-driven effects are additionally gated on `UI.fine`
(`hover:hover` and `pointer:fine`), so nothing pointer-based ever engages on
a touch device with no real hover to begin with.

Current inventory: a cursor-tracked spotlight that follows the pointer across
every major section (not just the hero) and hands off between sections with
an overlapping opacity crossfade rather than a hard cut — the position itself
glides too, via `@property`-registered `--mx`/`--my` custom properties, and
snaps instantly (no glide) on first entry into a section so it never visibly
rushes in from wherever it was last left there; magnetic pull on every button
on the page (`.btn`, `.rd`, `.cbtn`, `.tog`), composing with each control's
own existing hover transform (lift, scale, or rotate, whichever it already
had) via shared `--magx`/`--magy` CSS variables rather than one replacing the
other; a subtle scale-up on At a Glance chips; card lift and shadow; the
surname block nudging right on hero hover; the hero name staggering in
letter-by-letter once on first paint; the "8 yrs" glance figure counting up
from 0 the moment it scrolls into view (and only that one figure — the
career chart's own duration numbers stay a plain fade, deliberately, so the
chart doesn't turn into five simultaneous tickers); career bars growing from
their true start dates with a one-time spring overshoot; a single nav
underline sliding between items; sections rising once on entry and never
again; the reading rule filling across the top; excerpt rules brightening and
widening; link underlines drawing from the left; the theme toggle rotating;
carousel progress tracking scroll.

Content is never hidden behind an effect. If the script fails, `.no-js` is
simply never removed from `<body>` and the page renders complete and static.

The hover guide on the career chart deserves a specific note, since it went
through two revisions: the vertical line it draws is scoped to a single row
(from just above that row's job title down to the bottom of its own bar,
never a neighbour's), but the *trigger zone* — where hovering counts as "in
this row" — is the row's entire clickable width and height, not just the bar
itself. Those are two different rectangles on purpose: one for where the line
is allowed to show, one for where the pointer is allowed to summon it.

The spotlight deserves one too: it's implemented as a `.spotlight::before`
pseudo-element on each major section (hero, Work, each banded section,
Career, Education, the footer), not one global overlay — a single overlay
behind everything would be invisible on top of a banded section's own opaque
background, since an external element can't sit *between* a box's own
background and its own content. Making the glow part of each section's own
rendering is what lets it show through every section, banded or plain, with
the same one shared pointermove handler just deciding which section's own
`--mx`/`--my` to update based on where the cursor actually is.

---

## Theme switching

Follows the device via `prefers-color-scheme`, falls back to **dark** when the
device has no preference or the browser can't report one, and responds live if
the device setting changes mid-session.

The crossfade is a `.theming` class added to `<html>` for 560ms during a
switch and then removed — so the transition never slows down ordinary hover
states.

**Persistence is commented out** in two marked places in `app.js`. Browser
storage is blocked inside some preview frames, so it is inert here.
Uncomment both lines once this is on your own domain. (`admin.html`'s own
light/dark toggle for its own chrome is unrelated and already persists via
`localStorage` — it's a separate page with no such restriction.)

---

## Responsive

Five breakpoints:

    1260   tighten the gutter and the gap
    1080   glance band reflows to three columns; the lead figure spans the
           full row above them as an inline line rather than a side column
    1020   the margin column stops being a column and becomes an inline meta
           line; every grid collapses to one column
     760   glance reflows to two columns, with the odd group out spanning the
           full row so it isn't stranded beside a 50% gap; the carousel
           arrows are dropped (scroll, swipe and keyboard still work — the
           arrows were never the mechanism)
     640   nav becomes a scrollable strip under the name, the header's
           Preview PDF / Save PDF / theme-toggle group gets its own
           deliberate row (see below), cards resize for thumb-swiping,
           hover lift is removed where a touch device can't undo it, the
           chart's hover guide is dropped entirely, the expand control
           shrinks to 28px, the glance goes single-column, and the footer
           stacks into two explicit rows

The glance going single-column at 640 rather than staying two-up is a
consequence of the chips: two columns of groups gave each group only half
the width to wrap its chips into, and a single column of full-width groups
is what actually delivers the height reduction chips are for. It doesn't
reintroduce the older "one item per line, too long and too empty" problem,
because that came from one plain-text item per line, not from one group per
row — a group's chips still wrap several to a line.

The header's PDF-buttons-and-toggle group (`.hdr-actions`) used to rely on
`.tog{margin-left:auto}` plus flex-wrap deciding, per pixel, whether the
toggle landed neatly at the end of row one or got orphaned onto its own
near-empty line — which depended on exact font-rendering width and so looked
fine in one test and broke on a real device. It's wrapped in its own element
now: `display:contents` at desktop (completely invisible to layout — Preview
PDF, Save PDF and the toggle stay true flex children of the header exactly as
before) and a real, deliberate flex row below 640px that always gets its own
line regardless of the PDF buttons' text length or how many of them are
enabled (zero, one, or two — see `pdfButtons` above), with the two buttons
sharing remaining width (`flex:1 1 auto`) and the toggle staying fixed-size
beside them.

---

## The PDF

The page throws away its entire screen layout at print time and uses a
separate, purpose-built one-page A4 sheet, defined in `index.html`'s own
`<style>` block. Both are generated from the same `site-data.js`, so they
cannot drift apart, but neither compromises for the other.

The sheet reads the **same theme tokens as the site**, so the palette, the
serif, the accent rule and the red name block all carry through — and it
exports in whichever theme is active when you hit Save (see the caveat about
Chrome's Background Graphics setting below; the CSS is theme-correct, but
that setting is what actually lets a background colour print at all).

The PDF is a deliberately different document from the page, not a
screenshot of it — three things are dropped or reshaped for print rather
than carried straight across:

- **No timeline strip.** The page's career chart doesn't survive well as a
  static flattened bar on paper — it read as decorative rather than
  informative once you couldn't hover it. Experience is a plain list
  instead, each role marked with a small dot in the left margin and a
  hairline trailing down to the next one, the same tenure-marker language
  as the on-page chart, quietened for print.
- **No skill tiers.** The page's tooltip (`.has-tip`, hover or focus) is
  exactly how the tier shows there, and a printed page can't hover.
  Disciplines and Tools print as plain bordered chips instead — one per
  item, no colour, no grouping by level — which also happens to fix an
  earlier problem where the whole line read as one run-on fragment rather
  than a list of distinct things.
- **No Worlds.** Left off the PDF as a length/relevance call; the site
  still shows it.

Each role's date range prints exactly as `dates` in `site-data.js` — e.g.
`2022 — 2026` — with nothing appended. `years()` (the computed duration,
another helper private to `chart()`) is a chart-only figure; concatenating
it onto the printed date row was
redundant once you can already see both ends of the range.

**Projects**, in the side column, is the one thing the PDF has that the
on-screen "at a glance" area doesn't. It pulls straight from `work.items` —
the same array the site's carousel reads — filtered to entries with
`pdf: true`. Add or remove that flag on any project in `site-data.js` to
change what shows up in the PDF; nothing else needs to change, and it has
no effect on the carousel, which still shows every project regardless.
The side column is narrow, so each entry stacks as a single block (title,
jam/meta, one line) rather than the two-up grid the extra width on-screen
would allow.

**Both the header contact links (email, itch.io, LinkedIn, Medium) and every
PDF-flagged project title are real `<a href>` elements in the sheet**, not
plain text — they render invisibly (no blue, no underline; `#sheet a{
color:inherit; text-decoration:none}` matches them to their surrounding
text exactly) but are genuinely clickable once the PDF is exported and
opened in a digital viewer.

`@page` margin is **zero**, and the page margins are drawn by `#sheet`'s own
padding. That is what suppresses the browser's header and footer — the date,
the file path, the page number and the document title — in Chrome and Edge.

**On auto-download:** a web page cannot write a PDF to disk on its own. The
only way around the save dialog is to rasterise the page with a library like
html2canvas, which would turn your CV into an image — unselectable, unsearchable,
and unreadable to the applicant-tracking systems that parse most job
applications, and would lose the hyperlinks above entirely. Keeping the
browser's own PDF engine keeps the text (and the links) real. The Save button
sets the document title first, so the filename is already
`Amruth Varshan — CV` when the dialog opens.

**Both buttons are optional.** `pdfButtons.preview.enabled` /
`pdfButtons.save.enabled` in `site-data.js` control whether either shows at
all — show just one, both (the default), or neither. Every click-handler
reference is guarded for the other's absence, so disabling one never breaks
the other, and disabling both just leaves the theme toggle sitting alone in
the header with no layout side effects, mobile or desktop.

Each role carries two bullet arrays: `detail` for the expanded chart row,
`print` for the PDF. **The `print` array is your page-length dial** — if the
sheet spills onto a second page, cut from `print` first. The two columns
(`main` for Experience, `side` for Disciplines/Tools/Projects/Education)
don't reflow into each other — they're independent flex columns, not a true
multi-column layout — so the page break is set by whichever column is
taller, and keeping the two roughly balanced in height is what keeps a
longer CV closest to fitting on one page. Moving Projects into the side
column (rather than leaving it under Experience in `main`) was specifically
to fix that balance once Projects existed at all: with everything long
stacked in `main` alone, that column ran a full A4 page by itself while
`side` finished with a third of the page still empty — verified by
rendering an intentionally padded test case through an actual headless
Chromium print pass, not just estimated from CSS.

To export: **Save PDF** → destination "Save as PDF", A4, margins Default —
and open **More settings** and tick **Background graphics**. Without it,
Chrome and Edge strip every background colour from the printed page by
default, on every site, not just this one — `print-color-adjust: exact`
(already set on every element) only tells the browser to use exact colours
*if* backgrounds are allowed at all; the checkbox is the actual gate. The
Save PDF button carries a native tooltip pointing at this.

Two real bugs used to compound that, both fixed now. First: Chrome and Edge
simulate `prefers-color-scheme: light` specifically for the print preview
render, to match "printing on white paper" expectations — and the page's
own theme-follows-device listener was reacting to that simulated change,
genuinely flipping `data-theme` to light right before the PDF rendered. So a
dark export could come out white even with the checkbox on, because by print
time the theme really had changed, not because the background failed to
draw. `UI.theme()` now ignores that listener for the duration of a
`beforeprint`/`afterprint` window. Second: clicking Save PDF while the
in-page Preview was still active pulled in preview's own screen-only sizing
(a 26px margin meant for floating the sheet on a grey backdrop), pushing the
sheet just past one A4 page and producing a near-blank second page — printing
directly, without opening preview first, never showed it. That CSS is now
scoped to `@media screen`, and Save PDF also exits preview mode on click as a
second guard.

**Preview PDF** shows the sheet at true A4 on screen — since that's ordinary
in-browser rendering rather than the print pipeline, it always shows full
colour regardless of the Background Graphics setting, which makes it a good
way to confirm the CSS itself is right before blaming the export.

---

## Open items

Search for `TODO`:

- `site-data.js` — the four writing excerpts. All four `TODO`s in the file are
  these; there is no other marker anywhere in the project. Left as
  placeholders on purpose for now.

Also outstanding in `site-data.js`, though not marked `TODO`: the new role you
mentioned. Add it at the top of `career.roles` with its own `from` / `to` and
the chart, the durations, the axis and the PDF strip all adjust themselves.
Until it's there it's worth knowing that Rovio carries `to: 2026` rather than
`to: null`, so the hero's "Currently" block — which reads `career.roles[0]`
and therefore can't disagree with the chart — announces a role the chart
alongside it shows as already ended. `admin.html`'s own validation already
flags this every time the file is loaded there.

The glance lead figure (`glance.lead.value`, the "8" in "8 yrs") is also a
hand-typed string rather than computed from the career data — flagged, left
as-is for now by choice, not an oversight.

Two things this reference does not solve yet:

1. **Screenshots.** No project art anywhere. Card art will change the carousel
   proportions and is the biggest open design question left — explored once
   as a mockup (a hero-art treatment on one work card, gradient scrim over a
   key-art background) and declined for now; the flat tone-card carousel
   stays as the shipped design.
2. **Disciplines.** Combat, roguelite and quest design aren't evidenced by
   anything in the career data. They're listed flat by choice. The tier
   mechanism (the same `tier: 1/2/3` Tools uses, surfaced via the web
   tooltip) is already in the data layer if you ever want to separate proven
   from exploring — just add `tier` to those items; no `legend` field exists
   or is needed, the tooltip is self-explanatory on its own.
