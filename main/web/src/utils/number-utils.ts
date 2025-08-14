export const formatNumber = (num: number, padding: number = 2) => {
  return num.toString().padStart(padding, "0");
};

export const toHex = (num: number | string, padding: number = 3) => {
  return `0x${new Number(num)
    .toString(16)
    .toUpperCase()
    .padStart(padding, "0")}`;
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
