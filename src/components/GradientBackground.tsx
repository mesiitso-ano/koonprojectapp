// GradientBackground — "Favorites", made with the 21st.dev Gradient
// Builder and exported as live CSS (the builder's own Copy-CSS background,
// plus its soften-blur and grain passes). Zero dependencies: one <div> that
// fills its parent. Drop it behind your content:
// <div className="relative h-96"><GradientBackground className="absolute inset-0" /></div>
// Remix the source recipe (colors, mode, finish) in the editor:
// https://21st.dev/community/gradients/editor?from=d539f2c3-8194-46d6-91be-03f10a879624

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.500'/></svg>\"), radial-gradient(circle at 67.04% 45.93%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.844) 19.02%, rgba(255, 255, 255, 0.5) 38.05%, rgba(255, 255, 255, 0.156) 57.07%, rgba(255, 255, 255, 0) 76.1%), radial-gradient(circle at 35.47% 65.92%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.844) 12.9%, rgba(0, 0, 0, 0.5) 25.8%, rgba(0, 0, 0, 0.156) 38.7%, rgba(0, 0, 0, 0) 51.6%), radial-gradient(circle at 48.33% 20.11%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.844) 16.75%, rgba(0, 0, 0, 0.5) 33.5%, rgba(0, 0, 0, 0.156) 50.25%, rgba(0, 0, 0, 0) 67%), radial-gradient(circle at 80.81% 88.03%, rgba(50, 50, 50, 1) 0%, rgba(50, 50, 50, 0.844) 10.28%, rgba(50, 50, 50, 0.5) 20.55%, rgba(50, 50, 50, 0.156) 30.83%, rgba(50, 50, 50, 0) 41.1%)",
          backgroundSize: "120px 120px, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "0 0, center, center, center, center",
          backgroundBlendMode: "overlay, normal, normal, normal, normal",
        }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.500,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain-d539f2c3">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-d539f2c3)" />
      </svg>
    </div>
  );
}
