/** The hero's backdrop: an aurora mesh with a masked grid over it, anchored to
 *  the top of the section. Static — the hero adds its own parallax by rendering
 *  this inside a motion wrapper. */
export function PageBackdrop() {
  const mask = "radial-gradient(ellipse 65% 55% at 50% 0%, black, transparent 75%)";
  return (
    <>
      {/* Aurora mesh — layered, offset blooms in violet / indigo / fuchsia. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(40% 40% at 30% 0%, rgba(139, 92, 246, 0.20), transparent 70%)",
            "radial-gradient(45% 45% at 70% 8%, rgba(99, 102, 241, 0.16), transparent 72%)",
            "radial-gradient(35% 38% at 52% 14%, rgba(217, 70, 239, 0.12), transparent 70%)",
          ].join(", "),
        }}
      />
      {/* Masked grid sits over the aurora for structure. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </>
  );
}
