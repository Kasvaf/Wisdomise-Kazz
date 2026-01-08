/**
 * TradingView chart configuration for different device types
 * Optimized based on TradingView's official mobile best practices
 */

import type { ChartingLibraryFeatureset } from '../../../../public/charting_library';

/**
 * Base features enabled for all devices
 */
const BASE_ENABLED_FEATURES: ChartingLibraryFeatureset[] = [
  'seconds_resolution',
  'use_localstorage_for_settings',
  'two_character_bar_marks_labels',
  'hide_left_toolbar_by_default',
];

/**
 * Mobile-specific enabled features
 * Based on: https://www.tradingview.com/charting-library-docs/latest/mobile_specifics/
 */
const MOBILE_ENABLED_FEATURES: ChartingLibraryFeatureset[] = [
  ...BASE_ENABLED_FEATURES,

  // Touch gesture optimizations
  'show_zoom_and_move_buttons_on_touch', // Shows zoom/scroll buttons on touch
  'pinch_scale', // Enable pinch-to-zoom gestures
  'horz_touch_drag_scroll', // Better horizontal drag behavior
  'vert_touch_drag_scroll', // Better vertical drag behavior

  // Mobile UX improvements
  'long_press_floating_tooltip', // Floating tooltip with OHLC values on long press
  // Note: 'always_show_legend_values_on_mobile' removed since legend is hidden

  // Performance optimizations
  'determine_first_data_request_size_using_visible_range', // Optimize initial data load
  'low_density_bars', // Better zoom levels for small screens
];

/**
 * Desktop-specific enabled features
 */
const DESKTOP_ENABLED_FEATURES: ChartingLibraryFeatureset[] = [
  ...BASE_ENABLED_FEATURES,
];

/**
 * Base features disabled for all devices
 */
const BASE_DISABLED_FEATURES: ChartingLibraryFeatureset[] = [
  'symbol_search_hot_key',
  'hide_price_scale_global_last_bar_value',
  'chart_style_hilo_last_price',
  'header_symbol_search',
  'header_compare',
  'save_chart_properties_to_local_storage',
  'header_resolutions',
  'header_chart_type',
  'header_settings',
  'header_indicators',
  'header_screenshot',
  'header_undo_redo',
  'legend_widget', // Hide OHLC legend inside chart by default
];

/**
 * Mobile-specific disabled features
 * Reduces clutter and improves performance on smaller screens
 */
const MOBILE_DISABLED_FEATURES: ChartingLibraryFeatureset[] = [
  ...BASE_DISABLED_FEATURES,
  'right_toolbar', // Right toolbar not needed on mobile
  'broker_button', // Reduce clutter on mobile
  'context_menus', // Better to use touch gestures
  // Note: 'legend_widget' already in BASE_DISABLED_FEATURES
];

/**
 * Desktop-specific disabled features
 */
const DESKTOP_DISABLED_FEATURES: ChartingLibraryFeatureset[] = [
  ...BASE_DISABLED_FEATURES,
  'right_toolbar', // Keep consistent with current config
];

/**
 * Get enabled features based on device type
 */
export const getEnabledFeatures = (
  deviceType: 'mobile' | 'tablet' | 'desktop'
): ChartingLibraryFeatureset[] => {
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    return MOBILE_ENABLED_FEATURES;
  }
  return DESKTOP_ENABLED_FEATURES;
};

/**
 * Get disabled features based on device type
 */
export const getDisabledFeatures = (
  deviceType: 'mobile' | 'tablet' | 'desktop'
): ChartingLibraryFeatureset[] => {
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    return MOBILE_DISABLED_FEATURES;
  }
  return DESKTOP_DISABLED_FEATURES;
};

/**
 * Base chart overrides for all devices
 */
const BASE_OVERRIDES = {
  'paneProperties.backgroundType': 'solid',
  'paneProperties.background': '#0c0c0c',

  // Hide legend (OHLC values) inside chart
  'paneProperties.legendProperties.showLegend': false,
};

/**
 * Mobile-specific chart overrides
 * Optimizes UI elements for smaller screens and touch interaction
 */
const MOBILE_OVERRIDES = {
  ...BASE_OVERRIDES,

  // Font size adjustments for mobile
  'scalesProperties.fontSize': 11,

  // Candle style optimizations (better visibility on small screens)
  'mainSeriesProperties.candleStyle.upColor': '#26a69a',
  'mainSeriesProperties.candleStyle.downColor': '#ef5350',
  'mainSeriesProperties.candleStyle.drawWick': true,
  'mainSeriesProperties.candleStyle.drawBorder': false,
  'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
  'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
  'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
  'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',

  // Chart margins for mobile
  'paneProperties.topMargin': 10,
  'paneProperties.bottomMargin': 8,

  // Price scale optimizations
  'scalesProperties.showSeriesLastValue': true,
  'scalesProperties.showSymbolLabels': true,
};

/**
 * Desktop-specific chart overrides
 */
const DESKTOP_OVERRIDES = {
  ...BASE_OVERRIDES,
};

/**
 * Get chart overrides based on device type
 */
export const getChartOverrides = (
  deviceType: 'mobile' | 'tablet' | 'desktop'
): Record<string, any> => {
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    return MOBILE_OVERRIDES;
  }
  return DESKTOP_OVERRIDES;
};
