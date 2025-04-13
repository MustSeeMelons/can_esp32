export const formatNumber = (num: number, padding: number = 2) => {
  return num.toString().padStart(padding, "0");
};
