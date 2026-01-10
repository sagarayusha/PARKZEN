import React from 'react';

// A simple hashing function to create a pseudo-random but deterministic sequence
const simpleHash = (str: string): number[] => {
  const codes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    codes.push(str.charCodeAt(i));
  }
  return codes;
};

// Creates a seeded pseudo-random number generator
const seededRandom = (seed: number) => {
  let state = seed;
  return () => {
    const x = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
};

export const QrCode = ({ value }: { value: string }) => {
  const size = 29;
  const dotSize = 1;
  const padding = 2;
  const svgSize = size * dotSize + padding * 2;

  // Create a seed from the input value
  const seed = simpleHash(value).reduce((a, b) => a + b, 0);
  const random = seededRandom(seed);

  const dots = Array.from({ length: size * size }).map((_, i) => {
    const row = Math.floor(i / size);
    const col = i % size;

    // Exclude areas for finder patterns
    if (row < 8 && col < 8) return false;
    if (row < 8 && col > size - 9) return false;
    if (row > size - 9 && col < 8) return false;

    return random() > 0.5;
  });

  const FinderPattern = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width={7 * dotSize} height={7 * dotSize} fill="black" />
      <rect x={x + dotSize} y={y + dotSize} width={5 * dotSize} height={5 * dotSize} fill="white" />
      <rect x={x + 2 * dotSize} y={y + 2 * dotSize} width={3 * dotSize} height={3 * dotSize} fill="black" />
    </>
  );

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <svg width="200" height="200" viewBox={`0 0 ${svgSize} ${svgSize}`} fill="black">
        <rect x="0" y="0" width={svgSize} height={svgSize} fill="white" />
        {dots.map((isFilled, i) => {
          if (!isFilled) return null;
          const x = (i % size) * dotSize + padding;
          const y = Math.floor(i / size) * dotSize + padding;
          return <rect key={i} x={x} y={y} width={dotSize} height={dotSize} />;
        })}
        <FinderPattern x={padding} y={padding} />
        <FinderPattern x={svgSize - (7 * dotSize) - padding} y={padding} />
        <FinderPattern x={padding} y={svgSize - (7 * dotSize) - padding} />
      </svg>
    </div>
  );
};
