export const formatNumber = (num: number, padding: number = 2) => {
  return num.toString().padStart(padding, "0");
};

export const toHex = (num: number | string) => {
  return `0x${new Number(num).toString(16).toUpperCase().padStart(3, "0")}`;
};
