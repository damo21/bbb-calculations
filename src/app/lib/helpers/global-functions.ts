export const camelToSpace = (camelCaseStr: string): string => {
  return camelCaseStr.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const splitStringIntoArray = (string: string): string[] => {
  // split string every 20 characters and return array
  return string.match(/.{1,20}/g) || [];
};

export const formatWeight = (weight: number): string => {
  // 72.5 -> "72.5", 100 -> "100"
  return `${Math.round(weight * 100) / 100}`;
};
