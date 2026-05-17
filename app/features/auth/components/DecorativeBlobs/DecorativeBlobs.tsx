import { BLOBS } from "./constants";

export function DecorativeBlobs() {
  return (
    <>
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full mix-blend-multiply pointer-events-none ${i % 2 === 0 ? "breathing-blob" : "breathing-blob-slow"}`}
          style={{
            ...blob.style,
            backgroundColor: blob.color,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
          }}
        />
      ))}
    </>
  );
}
