export const formatDollars = value => (value > 1e9
  ? `${(value / 1e9).toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}bn`
  : `${(value / 1e6).toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}m`);
