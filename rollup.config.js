const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime', '@babel/standalone'],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
        }),
    ],
};
