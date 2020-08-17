'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-async-import')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

tester.run('prefer-async-import', rule, {
  valid: [
    // no-vif
    {
      filename: 'test.vue',
      code: `
        <template>
          <imported-component></imported-component>
        </template>
        <script>
          import ImportedComponent from 'somepath'
          export default {
            components: {
              ImportedComponent
            }
          };
        </script>
      `,
    },
    // direct async
    {
      filename: 'test.vue',
      code: `
        <template>
          <async-component v-if="true"></async-component>
        </template>
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
        <template>
          <const-async-component v-if="true"></const-async-component>
        </template>
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
        <template>
          <imported-component v-if="true"></imported-component>
        </template>
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
        <template>
          <imported-component v-if="true"></imported-component>
        </template>
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
          line: 9,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
          line: 9,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
          line: 10,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
          line: 10,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
        <script>
          export default {
            components: {
              RequiredComponent: require('somepath')
            }
          };
        </script>
      `,
      output: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
          line: 8,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
        <script>
          export default {
            components: {
              RequiredComponent: import('somepath')
            }
          };
        </script>
      `,
      output: `
        <template>
          <required-component v-if="true"></required-component>
        </template>
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
          line: 8,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component></required-component>
          <another-required-component></another-required-component>
        </template>
        <script>
          export default {
            components: {
              RequiredComponent: () => import('somepath'),
              AnotherRequiredComponent: () => import('somepath2')
            }
          };
        </script>
      `,
      output: `
        <template>
          <required-component></required-component>
          <another-required-component></another-required-component>
        </template>
        <script>
          import RequiredComponent from 'somepath'
import AnotherRequiredComponent from 'somepath2'
export default {
            components: {
              RequiredComponent,
              AnotherRequiredComponent
            }
          };
        </script>
      `,
      errors: [
        {
          message: 'Component "RequiredComponent" doesn\'t need async import',
          line: 9,
        },
        {
          message:
            'Component "AnotherRequiredComponent" doesn\'t need async import',
          line: 10,
        },
      ],
    },
    ,
    {
      filename: 'test.vue',
      code: `
        <template>
          <required-component></required-component>
          <another-required-component></another-required-component>
        </template>
        <script>
          import RequiredComponent from 'somepath'
          export default {
            components: {
              RequiredComponent,
              AnotherRequiredComponent: () => import('somepath2')
            }
          };
        </script>
      `,
      output: `
        <template>
          <required-component></required-component>
          <another-required-component></another-required-component>
        </template>
        <script>
          import RequiredComponent from 'somepath'
          import AnotherRequiredComponent from 'somepath2'
export default {
            components: {
              RequiredComponent,
              AnotherRequiredComponent
            }
          };
        </script>
      `,
      errors: [
        {
          message:
            'Component "AnotherRequiredComponent" doesn\'t need async import',
          line: 11,
        },
      ],
    },
  ],
})
