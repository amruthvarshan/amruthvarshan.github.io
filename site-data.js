/* ============================================================================
   site-data.js — CONTENT LAYER
   ----------------------------------------------------------------------------
   The only file that changes what the site says. index.html reads from
   here; it contains no content of its own.

   This file is plain JSON assigned to window.SITE, generated and kept in
   sync by /admin.html — the private editor page for this repo. Editing by
   hand still works (it's just JSON below this comment), but the admin page
   is the safer path: it validates the invariants below before committing,
   where a hand edit will not. Whichever way you edit, this header is fixed
   and is reproduced verbatim by the admin page's generator — it is never
   part of the editable data and a hand edit to it will be overwritten on
   the next save from that page.

   LAYOUT ORDER
     The top-level keys below are deliberately ordered to match the page
     itself, top to bottom: nav (the header), then the hero (name/title/
     statement/availability/heroButtons), then one block per page section
     in the order it actually appears (work, writing, career, glance,
     education, about), then contact (the footer). This is for your own
     navigation reading the file top-to-bottom or filling in the admin
     form — it has no effect on rendering; index.html reads each key by
     name, not by position.

   SECTIONS
     work/writing/career/glance/education/about each carry their own
     `heading`, `byline` and (except work/writing/career) `subtitle` —
     the text in that section's own header block on the page. `byline`
     can be an empty string where the section has none today (education,
     about) and the paragraph is simply left out rather than rendered
     empty. work/writing/career show a computed item count instead of a
     typed subtitle — `countLabel` is just the unit noun ("projects",
     "pieces", "roles"); the number itself always comes from the actual
     length of that section's list, never typed by hand. The section
     numbers (01–06) shown in the margin are likewise always computed
     from this same top-to-bottom order, never stored or typed anywhere.

   NAV / HEROBUTTONS
     `nav` is the header's own link row — text and destination for each,
     in the order shown; the sliding underline and scroll-spy follow
     automatically, no matter how many links there are. `heroButtons` is
     the hero's row of calls to action — same idea, plus a `style` of
     either "solid" (filled) or "outline" for each. Both are plain
     arrays, so the count of links or buttons is just the length of the
     array — add or remove an entry and the page follows.

   PDFBUTTONS
     The header's Preview PDF / Save PDF pair — unlike nav/heroButtons
     these are two fixed, named slots (`preview`, `save`), not a list,
     since each drives its own distinct behaviour (one toggles the
     on-screen preview, the other triggers the browser's print dialog)
     rather than being an interchangeable link. Each has its own
     `enabled`, `text` and `style` — turn either off, both off, reword
     either, or set either to "solid"/"outline" independently. Disabling
     one never affects the other or the theme toggle beside them.

   TIERS (tools group only, currently)
     1 = expert    2 = strong    3 = working
   The numbers are sort order and nothing else — never shown anywhere as
   digits. An item carrying `tier` renders on the web page as a chip with a
   dashed border (the "hover for more" cue), and the matching word from
   `glance.tierLabels` appears in a tooltip on hover or keyboard focus.
   There is no colour, weight or size encoding. The PDF ignores `tier`
   entirely: paper can't hover, so Tools prints as plain chips with no
   level shown.

   AVAILABILITY
     Controls the "Open to roles" line in the hero's "Currently" card.
     `open: false` removes the line entirely — the card ends cleanly after
     the location/since line, nothing is left blank in its place. `text`
     is shown only when `open` is true, so it never needs clearing when
     toggling off.

   CAREER
     `from` / `to` are decimal years and drive the timeline geometry.
     2019.75 ≈ October 2019.  `to: null` means present — exactly one role
     should carry it, and it should be roles[0], since the hero's
     "Currently" block reads that entry directly.
     Durations are COMPUTED from these — never type "4 yrs" by hand.
     `line`   → the one-liner shown on the homepage chart.
     `detail` → the bullets revealed when a chart row is expanded in place.
     `print`  → the subset that goes on the PDF. This is your page-length dial.
     `expandAllText` is the one button above the chart, unrelated to any
     one role.

   AT A GLANCE (glance)
     Renders as a horizontal band below the career chart, five groups by
     default; a sixth wraps cleanly. Items render as chips — keep them to
     2–3 words. Only the "Tools" group is expected to carry `tier`.

   WORK
     Renders in the homepage carousel in the order given — there is no
     "see all" page, so `items` is the complete list; strongest first.
     `pdf: true` also pulls that entry into the CV PDF's Projects section.

   WRITING
     `excerpt` is the opening of the piece, 25–45 words — not a summary.
     `readMoreText` is the one button label shared by every writing card.
   ========================================================================== */

window.SITE =
{
  "nav": [
    {
      "text": "Work",
      "href": "#work"
    },
    {
      "text": "Writing",
      "href": "#writing"
    },
    {
      "text": "Career",
      "href": "#career"
    },
    {
      "text": "Skills",
      "href": "#skills"
    },
    {
      "text": "Education",
      "href": "#education"
    }
  ],
  "pdfButtons": {
    "preview": {
      "enabled": true,
      "text": "Preview PDF",
      "style": "outline"
    },
    "save": {
      "enabled": true,
      "text": "Save PDF",
      "style": "solid"
    }
  },
  "name": {
    "first": "Amruth",
    "last": "Varshan"
  },
  "title": [
    "Game designer",
    "Narrative designer",
    "Writer"
  ],
  "statement": "I build the systems that make a story happen, then write the words that land in them.",
  "rev": "rev. 2026",
  "availability": {
    "open": true,
    "text": "Open to roles"
  },
  "heroButtons": [
    {
      "text": "See the work",
      "href": "#work",
      "style": "solid"
    },
    {
      "text": "See the career",
      "href": "#career",
      "style": "outline"
    },
    {
      "text": "Get in touch",
      "href": "mailto:amruthvarshan@gmail.com",
      "style": "outline"
    }
  ],
  "work": {
    "heading": "Work",
    "byline": "Jam games, solo builds and branching text. Everything here is playable — nothing is behind a download.",
    "countLabel": "projects",
    "items": [
      {
        "title": "Setting the Stage",
        "meta": "LD54 · lead writer & designer",
        "pdf": true,
        "line": "A musical narrative puzzle game built in 72 hours. Third place for audio.",
        "href": "https://baconeta.itch.io/setting-the-stage"
      },
      {
        "title": "Eva",
        "meta": "GMTK · narrative systems",
        "pdf": true,
        "line": "An endless space shooter with one strange mechanic, written in 48 hours.",
        "href": "https://amruthvarshan.itch.io/eva"
      },
      {
        "title": "Course Correction",
        "meta": "Twine · branching dialogue",
        "line": "The opening of a text RPG where every choice costs you something.",
        "href": "https://amruthvarshan.github.io/downloads/Course Correction.html"
      },
      {
        "title": "Styx & Stones",
        "meta": "LD53 · game & narrative design",
        "pdf": true,
        "line": "An endless runner through the underworld. Unity, 72 hours, no sleep.",
        "href": "https://baconeta.itch.io/styx-and-stones"
      },
      {
        "title": "Harriet",
        "meta": "Godot · solo",
        "pdf": true,
        "line": "A small platformer built from scratch to learn the engine.",
        "href": "https://amruthvarshan.itch.io/harriet"
      },
      {
        "title": "Loony Libs",
        "meta": "Godot · solo",
        "line": "A desperate hermit's mad libs, with a very specific sense of humour.",
        "href": "https://amruthvarshan.itch.io/loony-libs"
      }
    ]
  },
  "writing": {
    "heading": "Writing",
    "byline": "Prose and verse, opening lines first. Read a piece here, then take the rest if you want it.",
    "countLabel": "pieces",
    "readMoreText": "Read the rest",
    "items": [
      {
        "title": "Mutton",
        "form": "Short story",
        "length": "2,400 words",
        "excerpt": "TODO — paste the opening lines of Mutton here. Around thirty words, so your prose is sampled in the first three seconds with no download and no decision to make.",
        "href": "https://amruthvarshan.github.io/downloads/Mutton.pdf"
      },
      {
        "title": "Siren Song",
        "form": "Poem",
        "length": "Ballad",
        "excerpt": "TODO — paste the first stanza here. A ballad about growing up and finding your place in the world.",
        "href": "https://amruthvarshan.github.io/downloads/Siren Song.pdf"
      },
      {
        "title": "Manoeuvre",
        "form": "Short story",
        "length": "1,800 words",
        "excerpt": "TODO — paste the opening here. A subversive medieval fantasy that turns out to be an elaborate punchline. Don't spoil it in the excerpt.",
        "href": "https://amruthvarshan.github.io/downloads/Manoeuvre.pdf"
      },
      {
        "title": "Wrought",
        "form": "Poem",
        "length": "Free verse",
        "excerpt": "TODO — paste the first stanza here. On the struggle and the delight of making things.",
        "href": "https://amruthvarshan.github.io/downloads/Wrought.pdf"
      }
    ]
  },
  "career": {
    "heading": "Where I've been",
    "byline": "Read it as a chart: each bar sits where it actually happened, and its length is how long it lasted. Click any row for the full detail.",
    "countLabel": "roles",
    "expandAllText": "Expand all",
    "roles": [
      {
        "company": "Rovio",
        "role": "Level Designer",
        "where": "Espoo, Finland",
        "from": 2022,
        "to": 2026,
        "dates": "2022 — 2026",
        "tone": "ink",
        "line": "Angry Birds Dream Blast — levels, UI copy, C# tooling",
        "detail": [
          "Designed and tuned levels for Angry Birds Dream Blast, a live puzzle game running a continuous content pipeline.",
          "Wrote narrative copy for features, events and UI screens, holding voice consistent across a decades-old IP.",
          "Shipped C# fixes to the in-house level editor, cutting friction for the whole design team.",
          "Researched procedural narrative systems and pitched how they could serve a live-ops content cadence."
        ],
        "print": [
          "Designed and tuned levels for Angry Birds Dream Blast on a continuous live-ops pipeline.",
          "Wrote narrative copy for features, events and UI screens across the Angry Birds IP.",
          "Shipped C# fixes to the in-house level editor, reducing friction for the design team."
        ],
        "tags": [
          "Level design",
          "UI writing",
          "C#",
          "Live ops"
        ]
      },
      {
        "company": "Zynga",
        "role": "Narrative Designer",
        "where": "Bengaluru, India",
        "from": 2019.75,
        "to": 2022,
        "dates": "2019 — 2022",
        "tone": "accent",
        "line": "Willy Wonka, The Wizard of Oz — narrative systems, in-engine",
        "detail": [
          "Designed gameplay features and the narrative systems that carried them.",
          "Wrote character, story, dialogue and UI copy inside the constraints of licensed IP approval.",
          "Built contextual narrative that justified game mechanics rather than decorating them.",
          "Implemented narrative in-engine rather than handing scripts off to someone else.",
          "Produced content that kept live games running for five-plus years.",
          "Mentored new designers through onboarding and their first shipped features."
        ],
        "print": [
          "Designed narrative systems and wrote character, story, dialogue and UI copy for licensed IPs (Willy Wonka, The Wizard of Oz).",
          "Implemented narrative in-engine; produced content sustaining live games for 5+ years.",
          "Mentored new design hires through onboarding and first shipped features."
        ],
        "tags": [
          "Narrative systems",
          "Dialogue",
          "Licensed IP",
          "In-engine",
          "Mentoring"
        ]
      },
      {
        "company": "Ubisoft",
        "role": "Game Tester",
        "where": "Pune, India",
        "from": 2019,
        "to": 2019.75,
        "dates": "Jan — Sep 2019",
        "tone": "muted",
        "line": "Ghost Recon Breakpoint — through to console release",
        "detail": [
          "Tested Tom Clancy's Ghost Recon Breakpoint across builds and platforms.",
          "Worked daily in debug tooling and JIRA, learning how a AAA console pipeline actually moves."
        ],
        "print": [
          "Tested Tom Clancy's Ghost Recon Breakpoint; daily work in debug tooling and JIRA."
        ],
        "tags": [
          "QA",
          "JIRA",
          "Console"
        ]
      },
      {
        "company": "DataTracks",
        "role": "Assistant Manager, Marketing",
        "where": "Chennai, India",
        "from": 2018.2,
        "to": 2018.9,
        "dates": "Mar — Nov 2018",
        "tone": "muted",
        "line": "Editorial oversight of the marketing team, UI copy",
        "detail": [
          "Held editorial oversight of the marketing team's output.",
          "Wrote UI copy and a wide range of campaign collateral."
        ],
        "print": [
          "Editorial oversight of the marketing team; UI copy and campaign collateral."
        ],
        "tags": [
          "Editorial",
          "UI copy"
        ]
      },
      {
        "company": "Freshworks",
        "role": "Content Writer",
        "where": "Chennai, India",
        "from": 2016.5,
        "to": 2017.5,
        "dates": "2016 — 2017",
        "tone": "muted",
        "line": "Product and marketing content to a continuous schedule",
        "detail": [
          "Wrote product and marketing content to a steady publishing schedule."
        ],
        "print": [
          "Product and marketing copy to a continuous publishing schedule."
        ],
        "tags": [
          "Copywriting"
        ]
      }
    ]
  },
  "glance": {
    "heading": "At a glance",
    "byline": "Worlds, studios, disciplines and tools. Hover any tool for how deep that skill goes.",
    "subtitle": "breadth",
    "lead": {
      "value": "8",
      "unit": "yrs",
      "note": "across five studios"
    },
    "tierLabels": {
      "1": "Expert",
      "2": "Strong",
      "3": "Working"
    },
    "groups": [
      {
        "label": "Worlds",
        "items": [
          {
            "name": "Angry Birds"
          },
          {
            "name": "Ghost Recon"
          },
          {
            "name": "Willy Wonka"
          },
          {
            "name": "The Wizard of Oz"
          }
        ]
      },
      {
        "label": "Studios",
        "items": [
          {
            "name": "Rovio"
          },
          {
            "name": "Zynga"
          },
          {
            "name": "Ubisoft"
          },
          {
            "name": "DataTracks"
          },
          {
            "name": "Freshworks"
          }
        ]
      },
      {
        "label": "Disciplines",
        "items": [
          {
            "name": "Narrative design"
          },
          {
            "name": "Systems design"
          },
          {
            "name": "Technical design"
          },
          {
            "name": "Quest design"
          },
          {
            "name": "Combat design"
          },
          {
            "name": "Roguelite design"
          }
        ]
      },
      {
        "label": "Tools",
        "items": [
          {
            "name": "Twine",
            "tier": 1
          },
          {
            "name": "Unity",
            "tier": 2
          },
          {
            "name": "articy",
            "tier": 2
          },
          {
            "name": "Godot",
            "tier": 2
          },
          {
            "name": "Jira",
            "tier": 2
          },
          {
            "name": "C#",
            "tier": 3
          }
        ]
      },
      {
        "label": "Based",
        "items": [
          {
            "name": "Espoo, Finland"
          }
        ]
      }
    ]
  },
  "education": {
    "heading": "Education",
    "byline": "",
    "subtitle": "before games",
    "items": [
      {
        "award": "B.E., Electrical & Electronics Engineering",
        "school": "SASTRA University",
        "dates": "2012 — 2016",
        "note": "Wrote, directed and produced stage plays at universities across South India."
      }
    ]
  },
  "about": {
    "heading": "About",
    "byline": "",
    "subtitle": "since 2016",
    "marginLabel": "Stage first",
    "marginNote": "then games",
    "paragraphs": [
      "I started out writing, directing and producing stage plays at universities across South India. Games turned out to be the same job with better tools and a far less forgiving audience.",
      "Since then: Ghost Recon, Angry Birds, Willy Wonka, The Wizard of Oz. Worlds that already had rules I didn't write, and room found in them anyway."
    ]
  },
  "contact": [
    {
      "text": "amruthvarshan@gmail.com",
      "href": "mailto:amruthvarshan@gmail.com"
    },
    {
      "text": "itch.io",
      "href": "https://amruthvarshan.itch.io/"
    },
    {
      "text": "LinkedIn",
      "href": "https://www.linkedin.com/in/amruthvarshan/"
    },
    {
      "text": "Medium",
      "href": "https://amruthvarshan.medium.com/"
    }
  ]
};
