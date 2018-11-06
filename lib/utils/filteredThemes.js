const FILTERED_THEMES = ["Brexit", "Visual journalism", "Crossword"];

function check(themeArray = []) {
  return themeArray.find(theme => FILTERED_THEMES.includes(theme));
}

module.exports = { check };
