/**
 * Short definitions for career skill labels.
 * Keys must match strings in data/careers.json → skills[].
 */

export const SKILL_DEFS: Record<string, string> = {
  'Problem solving':
    'Break fuzzy problems into steps and find a workable fix without freezing.',
  Communication:
    'Say what you mean clearly — writing, talking, or presenting — so others can act.',
  'Blueprint reading':
    'Read plans and diagrams accurately so builds match the design, not a guess.',
  Storytelling:
    'Shape facts into a narrative people care about and remember.',
  'Data analysis':
    'Turn raw numbers into patterns, questions, and decisions.',
  Organization:
    'Keep work, files, and priorities in an order that scales under pressure.',
  'Wiring & circuits':
    'Install and troubleshoot electrical paths safely and to code.',
  'Safety codes':
    'Know the rules that keep people and sites out of harm’s way.',
  'Knife & cooking technique':
    'Core kitchen craft — cuts, heat, timing — that makes food consistent.',
  'Menu creation':
    'Design dishes that fit cost, season, kitchen capacity, and taste.',
  'Speed under pressure':
    'Stay accurate when the ticket rail is full and the clock is mean.',
  'Food safety':
    'Handle, store, and serve food so guests don’t get sick.',
  'Measuring & cutting':
    'Precise mark-and-cut work so pieces fit the first time.',
  'Tool mastery':
    'Use the right tools well — and keep them honest.',
  Finishing:
    'The last-mile craft that makes a build look intentional, not almost.',
  'SQL & spreadsheets':
    'Pull, clean, and reshape data so analysis isn’t stuck in a CSV swamp.',
  'Data viz':
    'Chart and layout numbers so the insight is obvious at a glance.',
  Statistics:
    'Know when a pattern is real, noisy, or just wishful thinking.',
  Programming:
    'Write code that solves a real problem and can be changed later.',
  'System design':
    'Sketch how pieces fit — APIs, data, scale — before you dig the trench.',
  Debugging:
    'Hunt bugs with calm hypotheses instead of random poking.',
  'Experiment design':
    'Set up tests that answer a clear question without fooling yourself.',
  'Technical writing':
    'Explain complex work so a smart non-expert can follow it.',
  'Lab methods':
    'Run procedures carefully, repeatedly, and with clean records.',
  Typography:
    'Choose and set type so text feels intentional and readable.',
  Layout:
    'Arrange elements so hierarchy and flow feel natural.',
  'Design tools':
    'Fluent in the software that turns ideas into shippable files.',
  'Brand thinking':
    'Keep visuals and voice aligned with who the product is for.',
  'Video editing':
    'Cut, pace, and polish footage into something people finish watching.',
  'Social trends':
    'Sense what’s rising on platforms before it’s already stale.',
  'On-camera/production':
    'Shoot and perform with enough craft that the idea isn’t fighting the gear.',
  'User research':
    'Talk to real people and turn their friction into product truth.',
  Wireframing:
    'Sketch structure fast so the team debates flow, not polish.',
  Prototyping:
    'Make a clickable draft that proves (or kills) an idea early.',
  'Visual design':
    'Color, type, and space that feel cohesive — not decorative noise.',
  'Patient care':
    'Attend to someone’s needs with skill, dignity, and follow-through.',
  'Clinical judgment':
    'Read symptoms and context, then choose the next right clinical move.',
  'Staying calm':
    'Keep a cool head when stakes are high and others are spiraling.',
  'Explaining clearly':
    'Translate expert knowledge into plain language people can use.',
  Patience:
    'Give people (and processes) the time they need without checking out.',
  'Lesson planning':
    'Design learning that has a goal, a path, and a way to check it landed.',
  Mentoring:
    'Help someone grow by coaching, not just correcting.',
  'Active listening':
    'Hear what’s said — and what’s under it — before you respond.',
  Empathy:
    'Understand another person’s experience without making it about you.',
  Assessment:
    'Judge progress or need fairly, with criteria you can explain.',
  Confidentiality:
    'Protect private information like trust depends on it — because it does.',
  Prioritization:
    'Decide what matters now versus later when everything feels urgent.',
  Strategy:
    'Choose a direction and tradeoffs that compound, not just busywork.',
  'Working with data':
    'Use numbers as a decision tool, not a vibe check.',
  'Campaign strategy':
    'Plan messages, channels, and timing so attention turns into action.',
  'Copy & messaging':
    'Write words that carry the brand and move someone to do a thing.',
  Analytics:
    'Read performance signals and adjust without chasing vanity metrics.',
  Creativity:
    'Generate options that are fresh and still on-brief.',
  Persuasion:
    'Help someone see a path they weren’t considering — without the ick.',
  'Relationship building':
    'Earn trust over time so work gets easier for everyone involved.',
  Negotiation:
    'Find agreements that stick because both sides can live with them.',
  Resilience:
    'Bounce back from no’s, misses, and rough days without hardening.',
  Bookkeeping:
    'Keep money records clean enough that reality and the books agree.',
  'Attention to detail':
    'Catch the small miss that would become a big mess later.',
  'Tax & compliance':
    'Stay on the right side of rules that don’t care about good intentions.',
  Spreadsheets:
    'Model and track work in grids that don’t fall apart at scale.',
  Planning:
    'Map work, owners, and timing so delivery isn’t a surprise.',
  'Risk management':
    'Spot what could go wrong early and decide what to do about it.',
  'Process design':
    'Build repeatable ways of working that make quality the default.',
  'UI engineering':
    'Turn designs into production interfaces that stay maintainable.',
  'Design systems':
    'Shared components and tokens so product UI stays coherent at scale.',
  'Product sense':
    'Judge what is worth shipping for users, not just what is buildable.',
  Python:
    'Write clear scripts and services for data, models, and tooling.',
  'Model training':
    'Train and tune models with data, metrics, and honest failure analysis.',
  MLOps:
    'Get models into production and keep them reliable after launch.',
  Evaluation:
    'Measure quality with tests, rubrics, and metrics that catch regressions.',
  'Product strategy':
    'Choose where the product wins and what to cut without losing the plot.',
  'AI literacy':
    'Know what models can and cannot do so you do not ship magic theater.',
  'Evaluation design':
    'Define how you know an AI feature is good enough to trust.',
  'Stakeholder clarity':
    'Keep partners aligned on goals, tradeoffs, and what done means.',
  'Prompt systems':
    'Structure prompts, tools, and versions so behavior stays controllable.',
  Observability:
    'See what production is doing before users have to tell you.',
  'Incident response':
    'Diagnose and recover when systems fail without making it worse.',
  'Prompt design':
    'Write instructions and examples that steer model output reliably.',
  'Eval design':
    'Build rubrics and datasets that measure the right kind of quality.',
  'Data labeling':
    'Create clean labeled examples humans and models can learn from.',
  'Quality analysis':
    'Find patterns in failures and turn them into fixes that stick.',
  'Interaction design':
    'Shape flows and controls so people know what to do next.',
  'AI UX patterns':
    'Design for uncertainty, edits, citations, and recovery when models miss.',
  'CNC machining':
    'Program and run CNC machines to cut model parts to print.',
  'Precision measuring':
    'Check parts with calipers, gauges, and other tools so they meet the print.',
  'CAD & CAM':
    'Use design and manufacturing software to turn drawings into cut paths.',
  'Circuit design':
    'Design electrical circuits that meet power, signal, and safety requirements.',
  'Systems analysis':
    'Break a whole electrical system into parts and see how they interact.',
  Mathematics:
    'Use math to size, model, and check electrical designs.',
};

export const skillDefinition = (skill: string): string =>
  SKILL_DEFS[skill] ??
  'A capability that shows up in the day-to-day of this career.';
