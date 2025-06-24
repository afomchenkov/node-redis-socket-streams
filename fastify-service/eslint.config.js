import neo from 'neostandard';

export default [
  ...neo({
    ts: true,
  }),
  {
    rules: {
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/comma-dangle': 'off',
      '@stylistic/semi': 'off',
    },
  },
];
