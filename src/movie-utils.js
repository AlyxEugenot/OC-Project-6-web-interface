/**
 * Format big numbers to fit in a maquette
 * @param {String} income Number in string format to format.
 * @returns String, income arg in thousands format.
 */
export function formatMovieIncome(income) {
  let nb_income = Number(income);
  if (Number.isNaN(nb_income)) {
    console.log(`ERROR: income var ${income} is not number`);
    return "?";
  }

  let div = 1;
  let unit = "";
  if (nb_income < 1000) {
    return `${nb_income}`;
  } else if (nb_income < Math.pow(10, 6)) {
    div = 100;
    unit = "k";
  } else if (nb_income < Math.pow(10, 9)) {
    div = Math.pow(10, 5);
    unit = "m";
  } else if (nb_income < Math.pow(10, 12)) {
    div = Math.pow(10, 8);
    unit = "M";
  } else {
    div = Math.pow(10, 11);
    unit = "T";
  }

  nb_income = Math.round(nb_income / div) / 10;
  return `${nb_income}${unit}`;
}

/**
 * Replaces missing img elements with gradient.
 * @param {Element} imageElement Image to replace after image source's URL n'existe plus.
 * @returns true, indicates the error was handled
 */
export function handleImageError(imageElement) {
  imageElement.onerror = ""; // Prevent infinite loop if fallback also fails

  imageElement.style = "background-image:linear-gradient(210deg, #BBBBBB, #777777, #BBBBBB)";
  return true; // Indicate that the error was handled
}
