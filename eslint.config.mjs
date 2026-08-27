import js from '@eslint/js'

export default [
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'site-dist/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        Buffer: 'readonly',
        TextDecoder: 'readonly',
        Uint8Array: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        clearTimeout: 'readonly',
        document: 'readonly',
        module: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setImmediate: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['index.js', 'test/**/*.js', 'examples/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' }
  },
  {
    files: ['test/upstream/**/*.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-useless-escape': 'off'
    }
  }
]
