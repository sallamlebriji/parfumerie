import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export const AutoPlayVideo = ({ src, className = "" }) => {
  const videoRef = useRef(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!pausedByUser.current) video.play().catch(() => {});
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, failed]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    pausedByUser.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  if (failed) return null;

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mettre la video en pause" : "Lire la video"}
        className="absolute left-8 top-8 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-ink shadow-xl transition hover:scale-105"
      >
        {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
      </button>
    </>
  );
};
