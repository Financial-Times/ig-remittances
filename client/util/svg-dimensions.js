const svgDimensions = (width) => {
  let dimensions;

  if (width >= 1220) {
    dimensions = { width: 1180, height: 700 };
  } else if (width >= 740) {
    dimensions = { width: 700, height: 500 };
  } else {
    dimensions = { width: 300, height: 400 };
  }

  return dimensions;
};

export default svgDimensions;
