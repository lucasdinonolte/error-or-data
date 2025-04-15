import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const makeConfig = ({ input, outName }) => [
  {
    input,
    output: [
      {
        file: `dist/${outName}.js`,
        format: 'esm',
      },
      {
        file: `dist/${outName}.cjs`,
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**'],
        exclude: ['**/*.test.*'],
        compilerOptions: {
          emitDeclarationOnly: true,
        },
      }),
    ],
  },
];

export default [
  ...makeConfig({ input: 'src/index.ts', outName: 'index' }),
  {
    input: `dist/types/index.d.ts`,
    output: [{ file: `dist/index.d.ts`, format: 'esm' }],
    plugins: [dts()],
  },
];
