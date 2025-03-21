module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Tắt một số quy tắc ESLint trong quá trình phát triển
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/jsx-key': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
