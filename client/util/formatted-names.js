/**
 * @file
 * This converts country names that are usually abbreviated
 * into their more succinct forms
 */

const abbr = (name) => {
  switch (name) {
    case 'United States':
      return 'US';
    case 'United Kingdom':
      return 'UK';
    case 'United Arab Emirates':
      return 'UAE';
    default:
      return name;
  }
};

export default abbr;
