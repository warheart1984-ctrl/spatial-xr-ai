import { assertNever } from "./assert-never.js";
import { TONE_LAW_ID, ROUTER_VERSION } from "./types.js";
import type {
  HandoffToken,
  RouterTrace,
  RoutingDecision,
  TargetFront,
} from "./types.js";

const VISUAL_HANDOFF_PHRASE =
  "render visual generate image picture perfection no upgrade no fixes create what is described";

type KeywordRule = { id: string; pattern: RegExp };

const EQUALIZER_KEYWORDS: KeywordRule[] = [
  { id: "negotiate", pattern: /\bnegotiat(?:e|ion|ing)\b/i },
  { id: "deadline", pattern: /\bdeadlines?\b/i },
  { id: "ultimatum", pattern: /\bultimatums?\b/i },
  { id: "pressure", pattern: /\bpressures?\b/i },
  { id: "demand", pattern: /\bdemands?\b/i },
  { id: "offer", pattern: /\boffers?\b/i },
  { id: "terms", pattern: /\bterms\b/i },
  { id: "contract", pattern: /\bcontracts?\b/i },
  { id: "settlement", pattern: /\bsettlements?\b/i },
  { id: "framing", pattern: /\bfram(?:e|ing)\b/i },
  { id: "counter", pattern: /\bcounter[- ]?(?:fram(?:e|ing)|offer)?\b/i },
  { id: "refuse", pattern: /\brefus(?:e|al|ing)\b/i },
  { id: "leverage", pattern: /\bleverage\b/i },
  { id: "walk-away", pattern: /\bwalk[- ]away\b/i },
  { id: "written-breakdown", pattern: /\bwritten breakdown\b/i },
  { id: "threat", pattern: /\bthreat(?:en(?:ing|ed|s)?|s)?\b/i },
  { id: "compliance", pattern: /\bcompl(?:y|iance)\b/i },
  { id: "counsel", pattern: /\b(?:lawyer|counsel|attorney)\b/i },
  { id: "one-on-one", pattern: /\b(?:1-on-1|one[- ]on[- ]one)\b/i },
  { id: "bargain", pattern: /\bbargain(?:ing)?\b/i },
  { id: "urgent", pattern: /\b(?:asap|urgent|immediately|sign today|limited time)\b/i },
];

const ANALYST_KEYWORDS: KeywordRule[] = [
  { id: "policy", pattern: /\bpolic(?:y|ies)\b/i },
  { id: "systemic", pattern: /\bsystemic\b/i },
  { id: "pattern", pattern: /\bpatterns?\b/i },
  { id: "risk", pattern: /\brisks?\b/i },
  { id: "residual", pattern: /\bresidual\b/i },
  { id: "r_r", pattern: /\br_r\b/i },
  { id: "dashboard", pattern: /\bdashboard\b/i },
  { id: "ooda", pattern: /\booda\b/i },
  { id: "governance", pattern: /\bgovernance\b/i },
  { id: "dependency", pattern: /\bdependenc(?:y|ies)\b/i },
  { id: "firewall", pattern: /\bfirewall\b/i },
  { id: "strategic", pattern: /\bstrategic\b/i },
  { id: "exposure", pattern: /\bexposure\b/i },
  { id: "likelihood", pattern: /\blikelihood\b/i },
  { id: "impact", pattern: /\bimpact\b/i },
  { id: "matrix", pattern: /\b(?:5\s*[x×]\s*5|matrix)\b/i },
  { id: "fail-closed", pattern: /\bfail[- ]closed\b/i },
  { id: "control-effectiveness", pattern: /\bcontrol effectiveness\b/i },
];

function matchKeywords(utterance: string, rules: KeywordRule[]): string[] {
  const hits: string[] = [];
  for (const rule of rules) {
    if (rule.pattern.test(utterance)) {
      hits.push(rule.id);
    }
  }
  return hits;
}

function detectHandoffToken(utterance: string): HandoffToken | null {
  if (utterance.includes("EQUALIZER_TACTICAL_V1")) {
    return "EQUALIZER_TACTICAL_V1";
  }
  if (utterance.includes("ANALYST_SYSTEMIC_V1")) {
    return "ANALYST_SYSTEMIC_V1";
  }
  return null;
}

function detectVisualHandoff(utterance: string): "VISUAL_HANDOFF_V1" | null {
  return utterance.includes(VISUAL_HANDOFF_PHRASE) ? "VISUAL_HANDOFF_V1" : null;
}

function frontForToken(token: HandoffToken): TargetFront {
  switch (token) {
    case "EQUALIZER_TACTICAL_V1":
      return "LINGUISTIC_EQUALIZER";
    case "ANALYST_SYSTEMIC_V1":
      return "SYSTEMIC_ANALYST";
    default:
      return assertNever(token);
  }
}

export function routeUtterance(utterance: string): {
  routing_decision: RoutingDecision;
  router_trace: RouterTrace;
} {
  const matched_handoff_token = detectHandoffToken(utterance);
  const matched_equalizer_keywords = matchKeywords(utterance, EQUALIZER_KEYWORDS);
  const matched_analyst_keywords = matchKeywords(utterance, ANALYST_KEYWORDS);
  const visual_handoff = detectVisualHandoff(utterance);

  let target_front: TargetFront;
  let handoff_token: HandoffToken;
  let trigger_reason: string;
  let rule_id: string;

  if (matched_handoff_token !== null) {
    target_front = frontForToken(matched_handoff_token);
    handoff_token = matched_handoff_token;
    trigger_reason = `Explicit handoff token ${matched_handoff_token}`;
    rule_id = "explicit_handoff_token";
  } else if (
    matched_equalizer_keywords.length > matched_analyst_keywords.length
  ) {
    target_front = "LINGUISTIC_EQUALIZER";
    handoff_token = "EQUALIZER_TACTICAL_V1";
    trigger_reason = "Direct negotiation context detected";
    rule_id = "equalizer_keyword_majority";
  } else if (
    matched_analyst_keywords.length > matched_equalizer_keywords.length
  ) {
    target_front = "SYSTEMIC_ANALYST";
    handoff_token = "ANALYST_SYSTEMIC_V1";
    trigger_reason = "Systemic policy/pattern/risk context detected";
    rule_id = "analyst_keyword_majority";
  } else if (matched_equalizer_keywords.length > 0) {
    target_front = "LINGUISTIC_EQUALIZER";
    handoff_token = "EQUALIZER_TACTICAL_V1";
    trigger_reason = "Tied Dual-Front signals; 1-on-1 tactical terms present";
    rule_id = "tie_prefer_equalizer_when_tactical_present";
  } else {
    target_front = "SYSTEMIC_ANALYST";
    handoff_token = "ANALYST_SYSTEMIC_V1";
    trigger_reason =
      "No tactical negotiation context; defaulting to systemic analyst";
    rule_id = "default_analyst";
  }

  return {
    routing_decision: {
      target_front,
      handoff_token,
      trigger_reason,
      injected_tone_law: TONE_LAW_ID,
    },
    router_trace: {
      router_version: ROUTER_VERSION,
      matched_equalizer_keywords,
      matched_analyst_keywords,
      matched_handoff_token,
      visual_handoff,
      rule_id,
    },
  };
}
