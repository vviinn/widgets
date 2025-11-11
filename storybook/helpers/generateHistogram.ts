export const generateHistogram = (start: number, end: number, frequencies: number[]) => {
  const histogram = [];
  const numIntervals = frequencies.length;
  const step = (end - start) / numIntervals;

  for (let i = 0; i < numIntervals; i++) {
    const intervalStart = Math.round(start + i * step);
    const intervalEnd = Math.round(start + (i + 1) * step);

    histogram.push({
      value: {
        frequency: frequencies[i],
        interval: {
          start: intervalStart,
          end: intervalEnd,
        },
      },
      label: `[${intervalStart}-${intervalEnd})`,
      active: true,
    });
  }

  return histogram;
};
