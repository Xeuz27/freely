// import eslintPluginAstro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
	// ...eslintPluginAstro.configs['flat/recommended'],
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks
		},
		rules: {
			'@typescript-eslint/no-unused-expressions': 'warn',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn'
		}
	},
	{
		ignores: ['dist/**', '.astro/**', 'node_modules/**']
	}
]
