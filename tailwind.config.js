import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  safelist: ['opacity-100', 'opacity-50', 'intro-style'],
  theme: {
    screens: {
      'mobile': { max: '750px' },
      'max-md': { max: '750px' },
      'max-sm': { max: '640px' },
      'max-xs': { max: '420px' },
      'tablet': { min: '751px', max: '1439px' },
      'xs': '420px',
      ...defaultTheme.screens,
    },
    extend: {
      backgroundImage: {
        'pro-gradient':
          'linear-gradient(254deg, #E09501 -59.2%, #FFDA6C 138.76%)',
        'brand-gradient':
          'linear-gradient(88deg, var(--color-brand-700) -82.15%, var(--color-brand-200) 172.78%)',
      },
      flex: { shrink: 'inherit' },
      aspectRatio: { '4/3': '4 / 3' },
      fontSize: { xxs: '0.625rem' },
      width: {
        '2xs': '24px',
        'xs': '32px',
        'sm': '36px',
        'md': '40px',
        'lg': '44px',
        'xl': '48px',
        '2xl': '56px',
      },
      height: {
        '2xs': '24px',
        'xs': '32px',
        'sm': '36px',
        'md': '40px',
        'lg': '44px',
        'xl': '48px',
        '2xl': '56px',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const colors = theme('colors');
      const surfaces = Object.keys(colors).filter(key =>
        key.startsWith('v1-surface-l'),
      );
      addUtilities(
        {
          ...surfaces.reduce((acc, k, i) => {
            acc[`.bg-${k}`] = {
              '--tw-surface-l-current': colors[k],
              '--tw-surface-l-next': colors[surfaces[i + 1] || k],
              '--tw-surface-l-prev': colors[surfaces[i - 1] || k],
            };
            return acc;
          }, {}),
          '.bg-v1-surface-l-next': {
            backgroundColor: 'var(--tw-surface-l-next)',
          },
          '.bg-v1-surface-l-current': {
            backgroundColor: 'var(--tw-surface-l-current)',
          },
          '.bg-v1-surface-l-prev': {
            backgroundColor: 'var(--tw-surface-l-prev)',
          },
        },
        ['responsive', 'hover'],
      );
      addUtilities({
        '.scrollbar-none': {
          'scrollbarWidth': 'none',
          '-webkit-scrollbar-width': 'none',
        },
        '.scrollbar-thin': {
          'scrollbarWidth': 'thin',
          '-webkit-scrollbar-width': 'thin',
        },
        '.scrollbar-auto': {
          'scrollbarWidth': 'auto',
          '-webkit-scrollbar-width': 'auto',
        },
      });
    },
  ],
};
