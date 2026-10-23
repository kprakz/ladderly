// What learners type into "What do you want to learn?": turning a question like "How to learn Python?" into the skill
// itself ("Python"), and turning down topics Ladderly won't make a path for (weapons, hard drugs, hurting people,
// breaking into other people's accounts, self-harm). The check runs in the form and again on the server, for every
// AI engine. It's a short, readable list meant to catch clear requests, not to stand in for the AI's own safety.

/** Phrases around a skill that aren't part of its name, e.g. "How do I learn" or "for me". */
const LEADING = [
  /^(?:can|could|would|will) you (?:please )?/,
  /^(?:please )?(?:help me|teach me|show me|tell me|explain)(?: (?:how )?to)?(?: learn)? /,
  /^(?:i(?: want| would like|'d like| need| plan| am planning|'m planning| am trying|'m trying| am going|'m going) to|i wanna) /,
  /^how (?:do|can|should|would|could) (?:i|you|we|one|someone|beginners?) /,
  /^how to /,
  /^(?:the )?(?:best|fastest|easiest|quickest) (?:way|ways) to /,
  /^(?:a |an |the )?(?:complete |full |beginner'?s'? |step by step )?(?:roadmap|guide|path|plan|course|tutorial|introduction|intro)s? (?:to|for|on|of|in) /,
  /^(?:start|starting|begin|beginning|get started|getting started|start learning) (?:with |on |in )?/,
  /^(?:learn|learning|study|studying|master|mastering|get better at|getting better at|improve at|improve my|get into|getting into|understand) /,
  /^(?:about |the basics of |basics of |the fundamentals of |fundamentals of )/,
  /^(?:the |a |an )/,
];
const TRAILING = [
  / (?:from scratch|from zero|step by step|for free|online|at home|on my own|by myself|by yourself|quickly|fast|easily|properly|effectively|in \d+ (?:days|weeks|months))$/,
  / (?:for me|please)$/,
];

/**
 * The skill inside what was typed: "How to learn Python?" → "Python", "I want to learn the guitar" → "guitar",
 * "Roadmap for machine learning" → "machine learning". Anything else is returned as typed (trimmed). If removing the
 * extra words would leave nothing (someone typed just "learn"), the original is kept.
 * @param {string} text What the learner typed.
 * @returns {string} The skill name, in the learner's own capitalisation.
 */
export function skillFromTopic(text: string): string {
  const original = text.trim().replace(/\s+/g, " ");
  let skill = original.replace(/[?!.]+$/, "").trim();
  // Apply the patterns to a lowercase copy and cut the same number of characters from the original, so "How to learn
  // JavaScript" keeps "JavaScript" as typed.
  for (let changed = true; changed; ) {
    changed = false;
    for (const pattern of LEADING) {
      const match = skill.toLowerCase().match(pattern);
      if (match && match[0].length < skill.length) {
        skill = skill.slice(match[0].length).trim();
        changed = true;
      }
    }
    for (const pattern of TRAILING) {
      const match = skill.toLowerCase().match(pattern);
      if (match && match.index) {
        skill = skill.slice(0, match.index).trim();
        changed = true;
      }
    }
  }
  return skill.length >= 1 ? skill : original;
}

/** Why a topic was turned down, what to tell the learner, and safer topics to offer instead. */
export type TopicRefusal = { reason: "self-harm" | "harm"; message: string; alternatives: string[] };

type Rule = { pattern: RegExp; unless?: RegExp; message: string; alternatives: string[] };

/** Words that show the topic is about staying safe or protecting others, not causing harm. */
const PROTECTIVE = /\b(?:prevent\w*|awareness|protect\w*|defen[cs]\w*|safety|safe|detect\w*|recogni[sz]\w*|avoid\w*|first aid|recovery|support\w*|helping|counsel\w*|history of|ethical|ethics|law|legal|policy|forensic\w*|investigat\w*|disposal|treatment)\b/;
/** Games, models, props and stories: "making weapons in Blender" is art, not harm. */
const PRETEND = /\b(?:games?|gaming|minecraft|roblox|unity|unreal|blender|3d model\w*|modell?ing|cosplay|props?|toys?|nerf|lego|cardboard|paper|drawing|sketch\w*|story|stories|novel|fiction|film|movie|bath)\b/;
/**
 * Combines patterns into one "unless" check.
 * @param {RegExp[]} patterns The patterns.
 * @returns {RegExp} Matches when any of them does.
 */
const anyOf = (...patterns: RegExp[]) => new RegExp(patterns.map((p) => p.source).join("|"));

const RULES: Rule[] = [
  {
    // Weapons and explosives that can hurt people.
    pattern: /\b(?:bombs?|pipe ?bombs?|ieds?|explosives|grenades?|napalm|molotov|thermite|detonators?|nerve agents?|sarin|ricin|anthrax|bio ?weapons?|chemical weapons?|dirty bombs?|ghost guns?|silencers?|suppressors?)\b/,
    unless: anyOf(PROTECTIVE, PRETEND),
    message: "Ladderly can't make a path for weapons or explosives.",
    alternatives: ["Chemistry", "Physics", "Robotics"],
  },
  {
    pattern: /\b(?:make|making|build|building|3d print\w*|homemade|diy|craft\w*|assembl\w*)\b.*\b(?:guns?|firearms?|rifles?|pistols?|ammo|ammunition|weapons?)\b/,
    unless: anyOf(PROTECTIVE, PRETEND),
    message: "Ladderly can't make a path for making weapons.",
    alternatives: ["Mechanical engineering", "3D printing", "Woodworking"],
  },
  {
    // Making or dealing illegal drugs.
    pattern: /\b(?:make|making|cook|cooking|synthesi[sz]\w*|manufactur\w*|produc\w*|extract\w*|grow|growing|sell|selling|deal|dealing|smuggl\w*|get|buy|buying)\b.*\b(?:meth|methamphetamine|crystal meth|cocaine|crack|heroin|fentanyl|lsd|mdma|ecstasy|ketamine|opium|drugs)\b/,
    unless: anyOf(PROTECTIVE, /\b(?:addict\w*|quit\w*|rehab\w*|get off|come off|sober\w*)\b/),
    message: "Ladderly can't make a path for making or getting illegal drugs.",
    alternatives: ["Chemistry", "Pharmacology", "Biology"],
  },
  {
    // Breaking into other people's accounts, devices or networks.
    pattern: /\b(?:hack|hacking|crack|cracking|break into|spy on|stalk\w*)\b(?:\W+[\w']+){0,4}?\W+(?:someone\w*|somebody\w*|(?:other|another) (?:person|people)\w*|my (?:ex|girlfriend|boyfriend|wife|husband|friend|teacher|classmate|neighbou?r)\w*|accounts?|instagram|facebook|whatsapp|snapchat|gmail|emails?|phones?|wi-?fi|passwords?|bank\w*|school|cctv|cameras?)\b/,
    unless: /\b(?:ethical|my own|own account|recover\w*|secure|security|protect\w*|defen[cs]\w*|penetration test\w*|pentest\w*|bug bount\w*|ctf|lost|forgot\w*|exams?|interviews?|tests?|jee|neet|upsc|gate|po|clerk)\b/,
    message: "Ladderly can't help with getting into accounts, phones or networks that aren't yours.",
    alternatives: ["Ethical hacking", "Cybersecurity", "Networking"],
  },
  {
    pattern: /\b(?:make|making|create|creating|write|writing|build|building|code|coding|spread\w*)\b.*\b(?:ransomware|malware|computer virus|viruses|keyloggers?|trojans?|botnets?|spyware|phishing (?:pages?|sites?|kits?|emails?)|ddos)\b/,
    unless: /\b(?:detect\w*|analy[sz]\w*|protect\w*|defen[cs]\w*|remov\w*|prevent\w*)\b/,
    message: "Ladderly can't make a path for writing malware or attacking others.",
    alternatives: ["Cybersecurity", "Malware analysis", "Ethical hacking"],
  },
  {
    // Hurting people.
    pattern: /\b(?:kill|killing|murder\w*|poison\w*|hurt|hurting|harm|harming|attack|attacking|beat up|kidnap\w*|torture|abuse|stab\w*)\b(?:\W+[\w']+){0,3}?\W+(?:someone|somebody|a person|people|humans?|my (?:\w+ )?(?:wife|husband|parents?|mom|mum|dad|father|mother|brother|sister|teacher|classmate|friend|boss|ex|girlfriend|boyfriend|neighbou?r)|kids?|children|a child|students?)\b|\b(?:get away with murder|commit (?:a )?murder|school shooting|mass shooting|become a terrorist|join (?:isis|al[- ]?qaeda)|terror attack)\b/,
    unless: anyOf(/\b(?:prevent\w*|protect\w*|self[- ]defen[cs]e|stop\w*|recogni[sz]\w*|report\w*|history of|awareness)\b/, PRETEND),
    message: "Ladderly can't make a path for hurting anyone.",
    alternatives: ["Self-defence", "First aid", "Conflict resolution"],
  },
  {
    // Fraud, scams and forgery.
    pattern: /\b(?:scam(?:ming)? (?:people|someone|somebody)|credit card fraud|carding|money laundering|launder(?:ing)? money|counterfeit\w*|fake (?:ids?|passports?|currency|notes|money|degrees?|certificates?|marksheets?|documents?)|forg(?:e|ing) (?:a |an )?(?:signatures?|documents?|certificates?)|shoplift\w*|steal(?:ing)? (?:a |an |someone'?s )?(?:cars?|bikes?|money|identity|identities)|identity theft|cheat(?:ing)? (?:in|on|during) (?:an? |my |the )?(?:exams?|tests?|boards?|board exams?))\b/,
    unless: /\b(?:prevent\w*|protect\w*|detect\w*|avoid\w*|spot\w*|recogni[sz]\w*|awareness|report\w*)\b/,
    message: "Ladderly can't make a path for scams, fraud, forgery or cheating.",
    alternatives: ["Personal finance", "Cybersecurity", "Study skills"],
  },
  {
    // Sexual content (Ladderly is used by school students).
    pattern: /\b(?:porn\w*|nudes|nsfw|hentai|sexting|child sex\w*|csam|sex with (?:a )?(?:minors?|kids?|children|child))\b/,
    unless: /\b(?:addiction|recovery|quit\w*|awareness|protect\w*|safety)\b/,
    message: "Ladderly can't make a path for that.",
    alternatives: ["Biology", "Psychology", "Health and nutrition"],
  },
];

/** Self-harm gets a caring reply with a helpline, not a "can't do that". */
const SELF_HARM = /\b(?:kill(?:ing)? myself|end(?:ing)? my (?:own )?life|suicid\w*|self[- ]?harm\w*|hurt(?:ing)? myself|cut(?:ting)? myself|want to die|wanna die|how to die(?! (?:hair|clothes|cloth|fabric|shirts?|wool|yarn|eggs?))|ways to die|painless death|overdos\w*|starv(?:e|ing) myself)\b/;
const SELF_HARM_HELP = /\b(?:prevent\w*|awareness|support\w*|counsel\w*|helpline|crisis|help (?:a |my |someone|others|people|friends?)|helping|first aid|psychology|recovery|nursing|medic\w*|pharmac\w*)\b/;

/**
 * Checks whether Ladderly should make a path for a topic. Clear requests to harm people, make weapons or drugs,
 * break into other people's accounts, defraud, or for sexual content are turned down with a short reason and safer
 * topics to try. Learning about these subjects to stay safe or protect others ("suicide prevention", "ethical
 * hacking", "how to spot scams") is allowed.
 * @param {string} text What the learner typed.
 * @returns {TopicRefusal | null} Why it was turned down, or `null` if it's fine.
 */
export function checkTopic(text: string): TopicRefusal | null {
  const t = ` ${text.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z0-9' -]+/g, " ").replace(/\s+/g, " ").trim()} `;
  if (SELF_HARM.test(t) && !SELF_HARM_HELP.test(t)) {
    return {
      reason: "self-harm",
      message:
        "It sounds like things might be really hard right now. You don't have to face this alone. In India, you can call Tele-MANAS on 14416 (free, any time), or find a helpline in your country at findahelpline.com. Talking to someone you trust can help too.",
      alternatives: ["Meditation", "Mindfulness", "Journaling"],
    };
  }
  for (const rule of RULES) {
    if (rule.pattern.test(t) && !rule.unless?.test(t)) {
      return { reason: "harm", message: rule.message, alternatives: rule.alternatives };
    }
  }
  return null;
}
