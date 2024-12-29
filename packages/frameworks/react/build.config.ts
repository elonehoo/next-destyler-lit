import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: ['react'],
  clean: false,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
