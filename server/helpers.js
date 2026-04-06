// WES_Laboratory_DataEqualWeight column reference:
//   "FileLanguage"     — 'English' | 'French' | 'Portuguese'
//   "CategoryCode"     — e.g. '01 - essns'
//   "CategoryLanguage" — e.g. '01 - ES Samples, Sampling and Sites'
//   "QuestionKey"      — e.g. 'essns_sample_method'
//   "Question"         — e.g. '1.01 - What is your sampling method?'
//   "AdminLevelName"   — country name
//   "Province"
//   "Value"

const TABLE = '"WES_Laboratory_DataEqualWeight"';
const EN    = `"FileLanguage" = 'English'`;

// Format country name: underscores → spaces, each word capitalised
function fmtCountry(name) {
  if (!name) return name;
  return name
    .replace(/_/g, ' ')
    .replace(/\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// Parse "1.03a - ..." → [1, 3, 'a'] for multi-level numeric sort
function parseNumPrefix(str) {
  const m = (str || '').match(/^([\d.]+[a-z]?)/i);
  if (!m) return [Infinity, '', str];
  const raw    = m[1];
  const letter = raw.match(/[a-z]$/i) ? raw.slice(-1).toLowerCase() : '';
  const nums   = raw.replace(/[a-z]$/i, '').split('.').map(Number);
  return [...nums, letter];
}

// Compare questions by numeric prefix then alphabetically.
// Works with both {Question} (questions route) and {label} (summary route).
function cmpQuestions(a, b) {
  const pa = parseNumPrefix(a.Question || a.label);
  const pb = parseNumPrefix(b.Question || b.label);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const av = pa[i] ?? (typeof pb[i] === 'number' ? -Infinity : '');
    const bv = pb[i] ?? (typeof pa[i] === 'number' ? -Infinity : '');
    if (av < bv) return -1;
    if (av > bv) return  1;
  }
  return (a.Question || a.label || '').localeCompare(b.Question || b.label || '');
}

module.exports = { TABLE, EN, fmtCountry, cmpQuestions };
