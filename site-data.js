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
     A group's own `pdf: true` is what pulls it into the CV PDF's side
     column — same idea as `work` items' `pdf` flag. This used to be
     decided by matching a group's `label` text ("Disciplines", "Tools")
     directly, which silently broke the PDF the moment either group was
     renamed; `pdf` is independent of the label, so renaming a group here
     never affects whether it shows in the PDF.

   WORK
     Renders in the homepage carousel in the order given — there is no
     "see all" page, so `items` is the complete list; strongest first.
     `pdf: true` also pulls that entry into the CV PDF's Projects section.

   WRITING
     `excerpt` is the opening of the piece, 25–45 words — not a summary.
     `readMoreText` is the one button label shared by every writing card.

   CONTACT / PDFCONTACT
     `contact` is the footer's list — the first entry is the email line,
     everything after it becomes a social icon (matched by `text` against
     a fixed icon set in index.html; an unrecognised name falls back to
     plain text rather than breaking). `pdfContact` is a separate, shorter
     list for the PDF header specifically — deliberately independent of
     `contact` rather than a filtered view of it, since the two rarely
     want the same items in the same order (the PDF has no room for every
     social link, and wants the portfolio URL itself, which the footer
     doesn't need since visitors are already on it). Editing one never
     affects the other.
   ========================================================================== */

window.SITE =
{
  "nav": [
    {
      "text": "Showcase",
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
      "text": "Summary",
      "href": "#skills"
    }
  ],
  "pdfButtons": {
    "preview": {
      "enabled": false,
      "text": "Preview CV",
      "style": "outline"
    },
    "save": {
      "enabled": true,
      "text": "Download CV",
      "style": "solid"
    }
  },
  "name": {
    "first": "Amruth",
    "last": "Varshan"
  },
  "title": [
    "Experienced Generalist Designer"
  ],
  "statement": "I design words, worlds, and systems. Fluent enough across the development pipeline to be useful in most rooms.",
  "rev": "v. 2026",
  "availability": {
    "open": true,
    "text": "Open to roles on projects that interest me"
  },
  "heroButtons": [
    {
      "text": "Showcase",
      "href": "#work",
      "style": "solid"
    },
    {
      "text": "Writing",
      "href": "#writing",
      "style": "solid"
    },
    {
      "text": "Career",
      "href": "#career",
      "style": "outline"
    }
  ],
  "work": {
    "heading": "Showcase",
    "byline": "Some of the endeavours I've embarked on over the course of my career, from game jams to personal learning projects.",
    "countLabel": "projects",
    "items": [
      {
        "title": "Setting the Stage",
        "meta": "LD54 · Lead Writer & Designer",
        "pdf": true,
        "line": "Musical, narrative puzzle game made in 72h for LD 54. Placed 3rd in the Audio category.",
        "href": "https://baconeta.itch.io/setting-the-stage"
      },
      {
        "title": "Styx & Stones",
        "meta": "LD53 · Game & Narrative Design",
        "pdf": true,
        "line": "Endless runner made in 72h for Ludum Dare 53. In charge of game and narrative design.",
        "href": "https://baconeta.itch.io/styx-and-stones"
      },
      {
        "title": "Eva",
        "meta": "GMTK 2021 · Writing & Narrative Systems",
        "pdf": true,
        "line": "Endless space shooter with a unique mechanic made in 48h. Game & SFX design + sourcing.",
        "href": "https://amruthvarshan.itch.io/eva"
      },
      {
        "title": "Wyrglade",
        "meta": "Twine · Dialogue Choices",
        "line": "Created as part of a design test to demonstrate the reactivity of NPC dialogue to player agency.",
        "href": "https://amruthvarshan.github.io/downloads/The%20Approach%20to%20Wyrglade.html"
      },
      {
        "title": "Harriet",
        "meta": "Godot · Learning Project",
        "pdf": true,
        "line": "A simple 2D platformer with a quirky flavour. Scripting and levels designed from scratch.",
        "href": "https://amruthvarshan.itch.io/harriet"
      },
      {
        "title": "Course Correction",
        "meta": "Twine · Branching Dialogue",
        "line": "Opening sequence of a text-based role-playing experience with a branching narrative.",
        "href": "https://amruthvarshan.github.io/downloads/Course Correction.html"
      },
      {
        "title": "Star Wars RPG",
        "meta": "Twine · Star Wars",
        "pdf": false,
        "line": "Player-driven narrative test with branching dialogue to evaluate IP-driven writing & design.",
        "href": "https://amruthvarshan.github.io/aspyr-writing-test/scene-one.html"
      },
      {
        "title": "Tricky Life",
        "meta": "Twine · Life Sim",
        "pdf": false,
        "line": "Narrative systems vertical slice for a casual life sim game on mobile. Created for a design test.",
        "href": "https://amruthvarshan.github.io/downloads/tricky-life.html"
      }
    ]
  },
  "writing": {
    "heading": "Writing",
    "byline": "A selective assortment of my work  to display my skill with language, and versatility with style, in various literary formats.",
    "countLabel": "works",
    "readMoreText": "Read more",
    "items": [
      {
        "title": "Mutton",
        "form": "Short Story",
        "length": "1453 words",
        "excerpt": "I’ve always loved the amber darkness. Once-busy roads bathed in the golden gloom of street lights. The city, her secrets mine and mine alone as her people slumbered...",
        "href": "https://amruthvarshan.github.io/downloads/Mutton.pdf"
      },
      {
        "title": "Siren Song",
        "form": "Ballad",
        "length": "900 words",
        "excerpt": "Brinehall was its prideful name / What Verdyn used to call his home / At long, at last, he was truly free / To wander wild and freely roam",
        "href": "https://amruthvarshan.github.io/downloads/Siren Song.pdf"
      },
      {
        "title": "Manoeuvre",
        "form": "Short Story",
        "length": "1,740 words",
        "excerpt": "Louis felt suffocated, as though he could not move. He was surrounded by people he loved – his queen, his men. Yet, he could not shake the feeling that he was somehow restricted, held back...",
        "href": "https://amruthvarshan.github.io/downloads/Manoeuvre.pdf"
      },
      {
        "title": "Wrought",
        "form": "Poem",
        "length": "309 words",
        "excerpt": "So strange a thing it is, to create / Wrought in passion, sheathed in love / Wrapped in envy, and forged in hate",
        "href": "https://amruthvarshan.github.io/downloads/Wrought.pdf"
      },
      {
        "title": "A Review of Death Stranding",
        "form": "Game Review",
        "length": "4545 words",
        "excerpt": "People say art is subjective. If you ask me, that’s a little reductive. The entire spectrum of human experience is subjective. And art is about the purest way to...",
        "href": "https://amruthvarshan.medium.com/death-stranding-a-game-where-you-see-dead-people-using-a-foetus-3bc052265c5"
      },
      {
        "title": "Scene Writing Test",
        "form": "Scene",
        "length": "2 pages",
        "excerpt": "Ayana is visiting her aunt, Vina, at the border of the tribal lands. The two women converse about trivial things as Ayana helps...",
        "href": "https://amruthvarshan.github.io/downloads/Scene.pdf"
      },
      {
        "title": "A Review of Detroit: Become Human",
        "form": "Game Review",
        "length": "2893 words",
        "excerpt": "What is a little girl’s life worth? This is the first question Detroit: Become Human asks you, and it asks it again quite a number of times...",
        "href": "https://amruthvarshan.medium.com/melodrama-unrealised-potential-a-game-by-david-cage-35dd82c8ec4e"
      },
      {
        "title": "Project Syzygy",
        "form": "Chapter",
        "length": "1425 words",
        "excerpt": "The opening chapter of a WIP sci-fi novel that tries to grapple with how immortality affects purpose.",
        "href": "https://amruthvarshan.github.io/downloads/Project%20Syzygy.pdf"
      },
      {
        "title": "A Review of Titanfall 2",
        "form": "Game Review",
        "length": "2849 words",
        "excerpt": "Critique is much easier when you’re, well, critical of something. To critique Titanfall 2 then, would be to try and define the unpinnable quality of what constitutes fun...",
        "href": "https://amruthvarshan.medium.com/titanfall-2-a-game-that-knows-exactly-what-it-is-and-wants-to-be-78f1975aa088"
      },
      {
        "title": "Roses",
        "form": "Poem",
        "length": "126 words",
        "excerpt": "An original comic poem, written based on a writing prompt.",
        "href": "https://amruthvarshan.github.io/downloads/Roses.pdf"
      }
    ]
  },
  "career": {
    "heading": "Career",
    "byline": "A brief history of my experience with some of the biggest names in games, and my work on some of the biggest IPs.",
    "countLabel": "roles",
    "expandAllText": "Expand all",
    "roles": [
      {
        "company": "Zynga",
        "role": "Senior Game Designer",
        "where": "Bangalore, India",
        "from": 2025.9,
        "to": null,
        "dates": "2025 - Present",
        "tone": "accent",
        "line": "Reviving live-ops for The Wizard of Oz Magic Match 3 (released in 2016)",
        "detail": [
          "Thorough and detailed technical design documentation",
          "Rapid and high-fidelity playable design prototypes with AI tools",
          "Long-term thinking for roadmap planning and product strategy",
          "Guidance for younger designers on live-ops and game design",
          "Data-driven gameplay balancing for features and events",
          "Establishment and optimisation of production processes",
          "Design of compelling gameplay systems and experiences",
          "Alignment of design quality and business goals"
        ],
        "print": [
          "Thorough and detailed technical design documentation",
          "Rapid and high-fidelity playable design prototypes with AI tools",
          "Long-term thinking for roadmap planning and product strategy",
          "Guidance for younger designers on live-ops and game design",
          "Data-driven gameplay balancing for features and events",
          "Establishment and optimisation of production processes",
          "Design of compelling gameplay systems and experiences",
          "Alignment of design quality and business goals"
        ],
        "tags": [
          "Roadmap",
          "Product",
          "AI Prototyping",
          "Vision",
          "Mentorship"
        ]
      },
      {
        "company": "Rovio",
        "role": "Senior Level Designer",
        "where": "Espoo, Finland",
        "from": 2022.9,
        "to": 2025.9,
        "dates": "2022 - 2025",
        "tone": "ink",
        "line": "Live-ops, levels, and design for Angry Birds Dream Blast",
        "detail": [
          "Designed spreadsheet tools to optimise content management",
          "Refined and documented processes to improve pipelines",
          "Evaluated editor tools and designed improvements",
          "Onboarded new hires on processes and tools",
          "Prototyped and iterated to polish game mechanics",
          "Worked with Art & Audio to unify the narrative of mechanics",
          "Assisted the team with technical setup and development tools",
          "Balanced level content carefully to curated the player experience",
          "Liaised with internal & external partners to unify quality guidelines",
          "Researched procedural narrative systems on learning days"
        ],
        "print": [
          "Designed spreadsheet tools to optimise content management",
          "Refined and documented processes to improve pipelines",
          "Evaluated editor tools and designed improvements",
          "Onboarded new hires on processes and tools",
          "Assisted the team with technical setup and development tools",
          "Balanced level content carefully to curated the player experience",
          "Mentored juniors on designing for casual games",
          "Liaised with internal & external partners to unify quality guidelines"
        ],
        "tags": [
          "2D Level Design",
          "Processes",
          "Mentorship",
          "Technical Design",
          "Tools"
        ]
      },
      {
        "company": "Zynga",
        "role": "Narrative Designer",
        "where": "Bangalore, India",
        "from": 2019.75,
        "to": 2022.825,
        "dates": "2019 - 2022",
        "tone": "accent",
        "line": "Learned writing for an established IP (Willy Wonka)",
        "detail": [
          "Detailed design docs for gameplay features and narrative systems",
          "Character, story, dialogue, flavour, UI writing",
          "In-engine technical implementation of narrative",
          "Content to sustain live games for 5+ years",
          "Match-3 level design using Unity (designed 300+ & reviewed 1500+)",
          "Expansive writing on established IPs (Willy Wonka, Wizard of Oz)",
          "Code (C#) fixes for custom, in-house match-3 level editor",
          "Mentoring new hires on level design"
        ],
        "print": [
          "Gameplay features and narrative systems",
          "Character, story, dialogue & UI writing",
          "Contextual narrative for game mechanics",
          "In-engine implementation of narrative",
          "Content to sustain live games for 5+ years",
          "Match-3 level design using Unity",
          "Code fixes (C#) for in-house level editor"
        ],
        "tags": [
          "Narrative Systems",
          "2D Level Design",
          "Implementation",
          "Scripting",
          "Licensed IP"
        ]
      },
      {
        "company": "Ubisoft",
        "role": "Game Tester",
        "where": "Pune, India",
        "from": 2019,
        "to": 2019.75,
        "dates": "Jan - Sep 2019",
        "tone": "ink",
        "line": "Tom Clancy's Ghost Recon Breakpoint shipped on PC & console",
        "detail": [
          "Deployed comprehensive test cases for PvE missions",
          "Built proficiency with JIRA and game debug tools",
          "Learned the basics of game development and production",
          "Compiled detailed quality reports on overall build health"
        ],
        "print": [
          "Tested Tom Clancy’s Ghost Recon Breakpoint",
          "Built proficiency with game debug tools and JIRA"
        ],
        "tags": [
          "QA",
          "JIRA",
          "Production"
        ]
      },
      {
        "company": "DataTracks",
        "role": "Assistant Manager, Marketing",
        "where": "Chennai, India",
        "from": 2018.2,
        "to": 2018.9,
        "dates": "Mar - Nov 2018",
        "tone": "muted",
        "line": "Led the content marketing team through a website rebrand",
        "detail": [
          "Opinion pieces on subjects of data and finance",
          "Editorial oversight of company communications",
          "Upkeep of multiple company websites"
        ],
        "print": [
          "Editorial oversight of the marketing team"
        ],
        "tags": [
          "Editorial",
          "UI copy",
          "Direction"
        ]
      },
      {
        "company": "Freshworks",
        "role": "Content Writer",
        "where": "Chennai, India",
        "from": 2016.5,
        "to": 2017.5,
        "dates": "2016 - 2017",
        "tone": "muted",
        "line": "UI copy and varied marketing collateral",
        "detail": [
          "Product, website and social media copy, newsletters, articles, and more",
          "Conceptualised and executed marketing campaigns from start-to-finish",
          "Created engaging material in various forms such as infographics and whitepapers"
        ],
        "print": [
          "UI copy and varied marketing collateral"
        ],
        "tags": [
          "Copywriting",
          "Marketing"
        ]
      }
    ]
  },
  "glance": {
    "heading": "Summary",
    "byline": "A compilation of my journey over the years – the skills I've picked up, the IPs I've contributed to, and the experience I've accumulated.",
    "subtitle": "proficiencies",
    "lead": {
      "value": "8",
      "unit": "yrs",
      "note": "across three global studios"
    },
    "tierLabels": {
      "1": "Expert",
      "2": "Advanced",
      "3": "Strong"
    },
    "groups": [
      {
        "label": "IPs",
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
        "label": "STUDIOS",
        "items": [
          {
            "name": "Rovio"
          },
          {
            "name": "Zynga"
          },
          {
            "name": "Ubisoft"
          }
        ]
      },
      {
        "label": "DISCIPLINES",
        "items": [
          {
            "name": "Narrative Design",
            "tier": 1
          },
          {
            "name": "Systems Design",
            "tier": 1
          },
          {
            "name": "Roguelite Design",
            "tier": 2
          },
          {
            "name": "Combat Design",
            "tier": 2
          },
          {
            "name": "Technical Design",
            "tier": 3
          }
        ],
        "pdf": true
      },
      {
        "label": "SKILLS",
        "items": [
          {
            "name": "Writing",
            "tier": 1
          },
          {
            "name": "Twine",
            "tier": 1
          },
          {
            "name": "Unity",
            "tier": 2
          },
          {
            "name": "Scripting",
            "tier": 2
          },
          {
            "name": "Documentation",
            "tier": 1
          },
          {
            "name": "Unreal",
            "tier": 3
          },
          {
            "name": "Mentorship",
            "tier": 2
          },
          {
            "name": "Collaboration",
            "tier": 1
          },
          {
            "name": "Godot",
            "tier": 3
          },
          {
            "name": "Tooling",
            "tier": 2
          }
        ],
        "pdf": true
      },
      {
        "label": "CURRENTLY",
        "items": [
          {
            "name": "Bangalore, India"
          }
        ]
      }
    ]
  },
  "education": {
    "heading": "Education",
    "byline": "",
    "subtitle": "background",
    "items": [
      {
        "award": "B.E., Electrical & Electronics Engineering",
        "school": "SASTRA University",
        "dates": "2012 - 2016",
        "note": "Wrote, directed, and produced stage plays at universities across South India."
      }
    ]
  },
  "about": {
    "heading": "About",
    "byline": "",
    "subtitle": "who i am",
    "marginLabel": "a writer turned",
    "marginNote": "generalist designer",
    "paragraphs": [
      "Hi there! My name is Amruth Varshan and I'm an expert at designing words, worlds, and systems. I'm fluent enough across the game development pipeline to be useful in most rooms.",
      "I have a strong understanding of the tools and technology involved, and the ability to creatively circumvent their limitations. I want to become a creative director for games."
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
  ],
  "pdfContact": [
    {
      "text": "amruthvarshan@gmail.com",
      "href": "mailto:amruthvarshan@gmail.com"
    },
    {
      "text": "amruthvarshan.github.io",
      "href": "https://amruthvarshan.github.io/"
    },
    {
      "text": "LinkedIn",
      "href": "https://www.linkedin.com/in/amruthvarshan/"
    }
  ]
};
