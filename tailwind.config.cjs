/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const animationDelay = require('tailwindcss-animation-delay');
const twElements = require('tw-elements/dist/plugin');

module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  safelist: [
    'bg-seeker',
    'bg-adventurer',
    'bg-explorer',
    'opacity-100',
    'opacity-50',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13dff2',
        secondary: '#e26cff',
        'primary-hover': '#02D191',
        success:'#78EFD9',
        gray:{
          light:'rgba(255, 255, 255, 0.7)',
          main:'rgba(255, 255, 255, 0.1)',
          dark:'#051D32',
          darkest:'#15171C'
        },
        newPanel: '#051D32',
        bgcolor: '#03101C',
        panel: '#051D32',
        iconbg: 'rgba(0, 250, 172, 0.1)',
        inactive: 'rgba(255,255,255, 0.8)',
        warning: '#FFDB44',
        error: '#FF3459',
        'alt-primary': '#272C3C',
        'alt-secondary': '#353A4D',
        disabled: '#262D3F',
        modal: '#12141C',
        'table-border': 'rgba(61, 68, 83, 0.67)',
        nodata: 'rgba(237, 236, 255, 0.57)',
        'conv-bg': 'rgba(255, 216, 61, 0.5)',
        'conv-text': 'rgba(255, 216, 61, 1)',
        // quiz
        description: 'rgba(237, 236, 255, 0.57)',
        'quiz-btn-bg': 'rgba(0, 0, 0, 0.37)',
        'quiz-btn-bg-hover': '#292F43',
        'quiz-btn-selected': '#1E3163',
        'quiz-label': '#9192A1',
        'wallet-input-bg': 'rgba(0, 0, 0, 0.37)',
        'wallet-input': 'rgba(237, 236, 255, 0.57)',
        paper: '#212327',
        gradientFrom: '#13dff2',
        gradientTo: '#e26cff',
        gradientFromTransparent: 'rgba(19,222,242,0.15)',
        gradientToTransparent: 'rgba(226,108,255,0.15)',

        bitcoin: '#F7931A',
        litecoin: '#345D9D',
        ethereum: '#687DE3',
        tron: '##FF0013',
        binancecoin: '#F3BA2F',
      },
      flex: {
        shrink: 'inherit',
      },
      backgroundImage: {
        adventurer: 'url(./images/adventurer.png)',
        seeker: 'url(./images/seeker.png)',
        explorer: 'url(./images/explorer.png)',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
    fontFamily: {
      inter: ['inter', ...defaultTheme.fontFamily.sans],
      campton: ['campton', ...defaultTheme.fontFamily.sans],
      poppins: ['poppins', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [animationDelay, twElements],
  experimental: {
    applyComplexClasses: true,
  },
};
