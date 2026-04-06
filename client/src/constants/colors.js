export const COUNTRY_COLORS = {
  'Democratic Republic Of The Congo': { bg: '#2D3561', text: '#fff' },
  Senegal:                            { bg: '#C87DA8', text: '#fff' },
  Uganda:                             { bg: '#6B3FA0', text: '#fff' },
};

const FALLBACK_PALETTES = [
  { bg: '#009FDB', text: '#fff' },
  { bg: '#4CAF50', text: '#fff' },
  { bg: '#FF7043', text: '#fff' },
  { bg: '#00838F', text: '#fff' },
];

export function getCountryStyle(country, index) {
  return COUNTRY_COLORS[country] ?? FALLBACK_PALETTES[index % FALLBACK_PALETTES.length];
}

export const VALUE_COLORS = [
  '#2D3561', '#C87DA8', '#6B3FA0', '#009FDB', '#F6A623',
  '#4CAF50', '#E53935', '#00838F', '#FF7043', '#8D6E63',
];

export function getValueColor(index) {
  return VALUE_COLORS[index % VALUE_COLORS.length];
}
