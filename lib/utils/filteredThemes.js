const FILTERED_THEMES = [
  "Brexit",
  "Visual journalism",
  "Crossword",
  "Online MBA"
];

function check(themeArray = []) {
  return themeArray.find(theme => FILTERED_THEMES.includes(theme));
}

module.exports = { check };
