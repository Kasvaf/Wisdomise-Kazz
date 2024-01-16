/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const animationDelay = require('tailwindcss-animation-delay');
const twElements = require('tw-elements/dist/plugin');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
    './node_modules/@wisdomise/widgets/dist/**/*.js',
    './node_modules/@wisdomise/utils/dist/**/*.js',
  ],
  safelist: ['opacity-100', 'opacity-50'],
  theme: {
    screens: {
      'mobile': { max: '750px' },
      'max-md': { max: '750px' },
      'max-sm': { max: '640px' },
      'max-xs': { max: '420px' },
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'primary': '#13dff2',
        'secondary': '#e26cff',
        'primary-hover': '#02D191',
        'success': '#40F19C',
        'page': '#25262D',
        'gray': {
          light: 'rgba(255, 255, 255, 0.7)',
          main: 'rgba(255, 255, 255, 0.1)',
          dark: '#051D32',
          darkest: '#15171C',
          icon: '#D9D9D9',
        },
        'warning': '#FFDB44',
        'error': '#F14056',
        'alt-primary': '#272C3C',
        'alt-secondary': '#353A4D',
        'nodata': 'rgba(237, 236, 255, 0.57)',
        'description': 'rgba(237, 236, 255, 0.57)',
        'paper': '#212327',
        'gradientFrom': '#13dff2',
        'gradientTo': '#e26cff',
        'gradientFromTransparent': 'rgba(19,222,242,0.15)',
        'gradientToTransparent': 'rgba(226,108,255,0.15)',
      },
      flex: {
        shrink: 'inherit',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      fontSize: {
        xxs: '0.625rem',
      },
    },
    fontFamily: {
      jakarta: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [animationDelay, twElements, typography, 'tailwindcss/nesting'],
  experimental: {
    applyComplexClasses: true,
  },
};
