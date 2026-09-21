import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export const AutoPlayVideo = ({ src, className = "", playLabel = "Lire la vidéo", pauseLabel = "Mettre la vidéo en pause" }) => {
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
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute bottom-6 end-6 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-brand-ink shadow-lg transition hover:scale-105"
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-px" />}
      </button>
    </>
  );
};
