import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import path from 'path';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import babel from '@rollup/plugin-babel';
import ignoreImport from 'rollup-plugin-ignore-import';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import json from '@rollup/plugin-json';

const generateDts = Boolean(process.env.DTS);

const resolveRoot = path.resolve.bind(null, __dirname);

const outputOptions = {
  exports: 'named',
  preserveModules: true,
  preserveModulesRoot: 'src',
};

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const regexesOfPackages = externalPackages.map(
  packageName => new RegExp(`^${packageName}(\\/.*)?`),
);

const config = {
  input: './src/index.ts',
  plugins: [
    json(),
    commonjs(),
    nodeResolve({
      mainFields: ['module', 'main', 'native', 'browser'],
      browser: true,
      extensions: ['.ts', '.js', '.tsx'],
    }),
    alias({
      entries: {
        '@': resolveRoot('./src'),
      },
    }),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: process.env.NODE_ENV === 'production',
      jsx: 'automatic',
      tsconfig: 'tsconfig.json',
    }),
    babel({
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
      exclude: 'node_modules/**/*',
      extensions: ['.js', '.ts', '.tsx'],
    }),
    svgr(),

    postcss({
      modules: false,
      extract: false,
      inject: true,
    }),

    generateDts &&
      ignoreImport({
        extensions: ['.less', '.css'],
        body: 'export default undefined;',
      }),
    generateDts && dts(),
  ],
  output: generateDts
    ? {
        ...outputOptions,
        preserveModules: false,
        format: 'esm',
        dir: 'lib/dts',
      }
    : [
        {
          ...outputOptions,
          format: 'esm',
          dir: 'lib/esm',
        },
        {
          ...outputOptions,
          format: 'cjs',
          dir: 'lib/cjs',
        },
      ],
  external: [...regexesOfPackages],
};

export default config;
