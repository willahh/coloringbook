const element = document.documentElement;
const style = getComputedStyle(element);

export const getPrimaryColor = () => {
  return style.getPropertyValue('--color-primary-500').trim();
};

export const getPrimary700Color = () => {
  return style.getPropertyValue('--color-primary-700').trim();
};

export const getSecondaryColor = () => {
  return style.getPropertyValue('--color-secondary-500').trim();
};
