const ord = {
  name: 0,
  title: 1,
  subtitle: 2,
  label: 3,
  hint: 4,
  description: 5,
  placeholder: 6,
};

export default {
  sort: (a, b) => {
    if (a in ord && b in ord) {
      return ord[a] - ord[b];
    }
    if (a in ord) return -1;
    if (b in ord) return 1;
    return a.localeCompare(b);
  },

  locales: ['en'], // locale files will be generated for these langs
  input: ['src/**/*.{ts,tsx}'],
  output: 'src/i18n/$LOCALE/$NAMESPACE.yml',
  defaultValue: '',

  i18nextOptions: {
    react: {
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b', 'em'],
    },
  },
};
