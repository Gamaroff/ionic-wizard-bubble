export default [
  {
    input: 'dist/esm/index.js',
    output: {
      file: 'dist/plugin.js',
      format: 'umd',
      name: 'capacitorWizardBubble',
      globals: {
        '@capacitor/core': 'capacitorExports'
      },
      sourcemap: true,
      inlineDynamicImports: true
    },
    external: ['@capacitor/core']
  },
  {
    input: 'dist/esm/index.js',
    output: {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true
    },
    external: ['@capacitor/core']
  }
];
