import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/demos/**',
    '**/.story/**',
    '**/__test__/**.spec.vue',
    '**/.docs/guide/**.md',
  ],

}, {
  rules: {
    'n/prefer-global/process': 'off',
    'ts/no-this-alias': 'off',
    'ts/no-empty-object-type': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'ts/no-namespace': 'off',
  },
})
