"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import HeroAlt from "@/components/heroAlt";

const FADE_DURATION = 350;

export default function Page() {
  const [page, setPage] = useState("hero");
  const [isFading, setIsFading] = useState(false);

  const switchPage = () => {
    setIsFading(true);

    setTimeout(() => {
      setPage((prev) => (prev === "hero" ? "heroalt" : "hero"));
      setIsFading(false);
    }, FADE_DURATION);
  };

  return (
    <div className={`page-transition ${isFading ? "is-fading" : ""}`}>
      {page === "hero" ? (
        <Hero onSwitchPage={switchPage} />
      ) : (
        <HeroAlt onSwitchPage={switchPage} />
      )}
    </div>
  );
}