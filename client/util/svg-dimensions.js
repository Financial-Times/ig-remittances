const svgDimensions = (width) => {
  if (width >= 1220) {
    return { width: 1180, height: 700 };
  }

  if (width >= 740) {
    return { width: 700, height: 500 };
  }

  return { width: 300, height: 400 };
};

export default svgDimensions;
