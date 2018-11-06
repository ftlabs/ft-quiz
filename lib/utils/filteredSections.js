const FILTERED_SECTIONS = [
  "FT Magazine",
  "Weekend",
  "Opinion",
  "The Big Read",
  "Series",
  "Lex",
  "SpecialReports",
  "Visual journalism",
  "Financial Commentary",
  "Crossword"
];

function check(themeArray = []) {
  return themeArray.find(theme => FILTERED_SECTIONS.includes(theme));
}

module.exports = { check };
