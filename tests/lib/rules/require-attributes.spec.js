'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-attributes')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

tester.run('require-attributes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" height="100"/>
        </template>
      `,

    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <lazy-img src="test.png" width="100" height="100"/>
        </template>
      `,
      options: [{
        'lazy-img': {
          value: ['width', 'height'],
        }
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" height="100" data-lazy/>
        </template>
      `,
      options: [{
        img: {
          value: ['width', 'height'],
          empty: ['data-lazy'],
        }
      }]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" height="100"/>
        </template>
      `,
      options: [{
        img: {
          callback: (attrs) => {
            return attrs.width === attrs.height || 'Width and Height must be equal!'
          }
        }
      }],
    },
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" height="102" />
        </template>
      `,
      output: `
        <template>
          <img src="test.png" width="100" height="102" />
        </template>
      `,
      options: [{
        img: {
          callback: (attrs) => {
            return attrs.width === attrs.height || 'Width and Height must be equal!'
          }
        }
      }],
      errors: [
        {
          message:
            'User callback error. Width and Height must be equal!',
          line: 3,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" :height="100"/>
        </template>
      `,
      output: `
        <template>
          <img src="test.png" width="100" :height="100" data-lazy/>
        </template>
      `,
      options: [{
        img: {
          value: ['width', 'height'],
          empty: ['data-lazy'],
        }
      }],
      errors: [
        {
          message:
            'Attribute data-lazy is requred, at least empty on <img>!',
          line: 3,
        },{
          message:
            'Attribute height is requred, on <img>!',
          line: 3,
        },
      ],
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <img src="test.png" width="100" :height="100" v-bind:alt="100" v-on:click="click()" @click.native="click"/>
        </template>
      `,
      output: `
        <template>
          <img  width="100" :height="100" v-bind:alt="100" v-on:click="click()" @click.native="click" v-lazy="{src:'test.png'}"/>
        </template>
      `,
      options: [{
        img: {
          callback: (attrs) => {
            if (attrs.src) {
              const src = attrs.src
              delete attrs.src
              attrs['v-lazy'] = attrs['v-lazy'] || `{src:'${src}'}`
              return attrs
            }
            return true
          }
        }
      }],
      errors: [
        {
          message:
            'User callback requres update on props <img>!',
          line: 3,
        },
      ],
    },
  ],
})
