const dec2hex = (dec: number): string => {
  return dec.toString(16).padStart(2, '0');
};

export const generateRandomStr = (len: number): string => {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

export const randomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};
