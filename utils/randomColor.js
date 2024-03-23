export const generateRandomColor = () => {
  let color = "";
  do {
    color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  } while (isLightColor(color) || color.toLowerCase() === "#ffffff");

  return color;
};

export const isLightColor = (color) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};