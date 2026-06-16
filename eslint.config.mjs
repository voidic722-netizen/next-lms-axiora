import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Izinkan any yang eksplisit di area boundary (service layer)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Matikan karena sudah dihandle TypeScript
      'react/prop-types': 'off',
      // Wajibkan key pada list render
      'react/jsx-key': 'error',
      // Cegah penggunaan alert() — gunakan toast dari sonner
      'no-alert': 'error',
    },
  },
]

export default eslintConfig
