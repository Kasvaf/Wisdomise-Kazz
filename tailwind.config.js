export default {
  theme: {
    extend: {
      width: {
        '2xs': '24px',
        xs: '32px',
        sm: '36px',
        md: '40px',
        lg: '44px',
        xl: '48px',
        '2xl': '56px',
      },
      height: {
        '2xs': '24px',
        xs: '32px',
        sm: '36px',
        md: '40px',
        lg: '44px',
        xl: '48px',
        '2xl': '56px',
      },
    },
  },
  plugins: [
    ({ addUtilities, theme }) => {
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
    },
  ],
};
