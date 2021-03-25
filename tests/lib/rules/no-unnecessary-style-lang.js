'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unnecessary-style-lang')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

tester.run('no-unnecessary-style-lang', rule, {
  valid: [
    // plain css no lang=""
    {
      filename: 'test.vue',
      code: `
      `,
    },
    // plain css no lang=""
    {
      filename: 'test.vue',
      code: `
        <template></template>
      `,
    },
    // plain css no lang=""
    {
      filename: 'test.vue',
      code: `
        <style>
          .class { color: red }
        </style>
      `,
    },
    // actual scss
    {
      filename: 'test.vue',
      code: `
        <style lang="scss">
          $color: red;
          .class { color: $color }
        </style>
      `,
    },
    // actual sass
    {
      filename: 'test.vue',
      code: `
        <style lang="sass">
          $color: red;
          .class
            color: $color
        </style>
      `,
    },
  ],

  invalid: [
    // unused scss
    {
      filename: 'test.vue',
      code: `
        <style lang="scss">
          .class { color: red }
        </style>
      `,
      output: `
        <style>
          .class { color: red }
        </style>
      `,
      errors: [
        {
          message:
            'You might not need lang="scss" here, because compilation does nothing. But still need extra loader and increase building time.',
          line: 2,
        },
      ],
    },
  ],
})
