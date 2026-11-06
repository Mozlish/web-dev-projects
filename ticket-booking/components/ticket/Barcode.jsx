// A decorative barcode drawn from the PNR. It looks the part, but it isn't a real,
// scannable format: a real ticket would use a QR code library.
export default function Barcode({ value }) {
  const bars = [];
  let x = 0;

  for (const char of value) {
    const code = char.charCodeAt(0); // "R" -> 82, which is 1010010 in binary
    // Read the character's 7 binary digits: 1 = a thick bar, 0 = a thin one
    for (let bit = 0; bit < 7; bit++) {
      const width = (code >> bit) & 1 ? 3 : 1;
      bars.push({ x, width });
      x += width + 2; // the bar plus a gap
    }
  }

  return (
    <svg
      viewBox={`0 0 ${x} 48`}
      preserveAspectRatio="none"
      className="h-14 w-full"
      role="img"
      aria-label={`Barcode for ${value}`}
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.width} height="48" className="fill-current" />
      ))}
    </svg>
  );
}
