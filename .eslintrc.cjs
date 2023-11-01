module.exports = {
  settings: {
    'react': { version: 'detect' },
    'import/extensions': ['.ts', '.js', '.tsx'],
    'import/resolver': {
      typescript: {
        // alwaysTryTypes: true,
        project: __dirname,
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: [
    'import',
    'react',
    'react-hooks',
    '@typescript-eslint',
    'unused-imports',
    'eslint-plugin-unicorn',
  ],
  extends: [
    'plugin:unicorn/recommended',
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',

    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:tailwindcss/recommended',

    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 'complexity': ['error', 11],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    'quotes': ['error', 'single', { avoidEscape: true }],

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prefer-math-trunc': 'off',
    'unicorn/prefer-string-slice': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
    'unicorn/no-array-reduce': 'off',

    // 'quote-props': ['error', 'consistent-as-needed'],
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-bind': 'error',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off', // if(x) where x is not boolean
    '@typescript-eslint/no-misused-promises': 'off', // no promise return where not necessary
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/naming-convention': 'error',

    // import
    'import/default': 'off',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-relative-packages': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': [
      'error',
      // { unusedExports: true, missingExports: true },
    ],
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-default': 'error',
    'import/no-unresolved': ['error', { ignore: ['\\.svg$'] }],
    'import/no-unassigned-import': [
      'error',
      { allow: ['**/*.css', 'tw-elements'] },
    ],
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowArrowFunction: true,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true, // The true value here is for backward compatibility
        allowLiteral: true,
        allowObject: true,
      },
    ],
    'import/max-dependencies': [
      'error',
      {
        max: 15,
        ignoreTypeImports: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
      },
    ],

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'tailwindcss/no-custom-classname': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
