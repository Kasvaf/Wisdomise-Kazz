/**
 * Device detection utilities for responsive chart configuration
 */

/**
 * Detects if the current device is a mobile device
 * Uses both viewport width and user agent detection for accuracy
 */
export const isMobileDevice = (): boolean => {
  // Check viewport width (tablets and phones typically < 768px)
  const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

  // Check user agent for mobile/tablet devices
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return isMobileViewport || isMobileUserAgent;
};

/**
 * Detects if the device has touch capability
 */
export const isTouchDevice = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - for older browsers
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Gets the current viewport size category
 */
export const getViewportSize = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Determines optimal chart configuration based on device
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) {
    return getViewportSize() === 'tablet' ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

/**
 * Chart mark size configuration per device type
 * Smaller sizes on mobile/tablet for better visibility and reduced overlap
 */
export const MARK_SIZES = {
  mobile: 16,
  tablet: 16,
  desktop: 25,
} as const;

/**
 * Gets the appropriate mark size for the given device type
 */
export const getMarkSize = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
): number => {
  return MARK_SIZES[deviceType];
};
