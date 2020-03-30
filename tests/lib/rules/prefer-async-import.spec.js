'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('lib/rules/prefer-async-import')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

tester.run('prefer-async-import', rule, {
  valid: [
    // direct async
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            components: {
              AsyncComponent: () => import('somepath')
            },
          };
        </script>
      `,
    },
    // with const
    {
      filename: 'test.vue',
      code: `
        <script>
          const ConstAsyncComponent = () => import('somepath')
          export default {
            components: {
              ConstAsyncComponent
            },
          };
        </script>
      `,
    },
  ],

  invalid: [
    // unused method
    {
      filename: 'test.vue',
      code: `
        <script>
          import ImportedComponent from 'somepath'
          export default {
            components: {
              ImportedComponent
            }
          };
        </script>
      `,
      output: `
        <script>
          
          export default {
            components: {
              ImportedComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "ImportedComponent" should use async import.',
          line: 6,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const RequiredComponent = require('somepath')
          export default {
            components: {
              RequiredComponent
            }
          };
        </script>
      `,
      output: `
        <script>
          
          export default {
            components: {
              RequiredComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "RequiredComponent" should use async import.',
          line: 6,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const RequiredComponent = require('somepath'),
                AnotherItem = 3
          export default {
            components: {
              RequiredComponent
            }
          };
        </script>
      `,
      output: `
        <script>
          const 
                AnotherItem = 3
          export default {
            components: {
              RequiredComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "RequiredComponent" should use async import.',
          line: 7,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const AnotherItem = 3,
                RequiredComponent = require('somepath')
          export default {
            components: {
              RequiredComponent
            }
          };
        </script>
      `,
      output: `
        <script>
          const AnotherItem = 3
          export default {
            components: {
              RequiredComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "RequiredComponent" should use async import.',
          line: 7,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            components: {
              RequiredComponent: require('somepath')
            }
          };
        </script>
      `,
      output: `
        <script>
          export default {
            components: {
              RequiredComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "RequiredComponent" should use async import.',
          line: 5,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            components: {
              RequiredComponent: import('somepath')
            }
          };
        </script>
      `,
      output: `
        <script>
          export default {
            components: {
              RequiredComponent: () => import('somepath')
            }
          };
        </script>
      `,
      errors: [
        {
          message:
            'Component "RequiredComponent" has incorrect async import, should be () => import().',
          line: 5,
        },
      ],
    },
  ],
})
