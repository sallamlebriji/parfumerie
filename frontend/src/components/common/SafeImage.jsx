import { useEffect, useState } from "react";

export const imageFallbacks = {
  perfume: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
  boutique: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1400&q=85",
  gift: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1400&q=85",
  category: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85"
};

export const SafeImage = ({ src, fallbackSrc = imageFallbacks.perfume, alt = "", ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [usedFallback, setUsedFallback] = useState(!src);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setUsedFallback(!src);
  }, [src, fallbackSrc]);

  const handleError = (event) => {
    if (!usedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setUsedFallback(true);
      setCurrentSrc(fallbackSrc);
      return;
    }
    event.currentTarget.style.visibility = "hidden";
  };

  return <img {...props} src={currentSrc} alt={alt} onError={handleError} />;
};
