const typescript = require('rollup-plugin-typescript2');
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
    external: [
        'react',
        'react-dom',
        '@babel/standalone',
        'lucide-react',
    ],
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            clean: true,
        }),
    ],
}; 