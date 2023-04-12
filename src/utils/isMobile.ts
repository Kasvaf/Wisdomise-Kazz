import { mobileSize } from "config/ui";

export const isMobile = window.matchMedia(
  `(max-width: ${mobileSize}px)`
).matches;
