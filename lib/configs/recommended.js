module.exports = {
  parser: require.resolve('vue-eslint-parser'),
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'import',
    'unused-imports',
    'unicorn',
    'sonarjs',
    'security',
  ],
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:sonarjs/recommended',
    'plugin:security/recommended',
    '@vue/typescript/recommended',
    'plugin:import/errors',
  ],
  rules: {
    'frabbit-vue/vue-no-unused-methods': ['error', 'keep'],
    'frabbit-vue/vue-no-unused-properties': ['error', 'keep'],
    'frabbit-vue/vue-no-unused-vuex-methods': ['error', 'keep'],
    'frabbit-vue/vue-no-unused-vuex-properties': ['error', 'keep'],
    'frabbit-vue/vue-static-class-order-ext': 'error',
    'frabbit-vue/prefer-async-import': 'warn',
    'frabbit-vue/no-unnecessary-style-lang': 0,

    // eslint
    'logical-assignment-operators': [
      'error',
      'always',
      { enforceForIfStatements: true },
    ],
    'no-else-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-irregular-whitespace': 'error',
    'no-await-in-loop': 'error',
    'require-atomic-updates': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-unused-labels': 'error',
    'no-loop-func': 'error',
    'no-undef-init': 'error',
    'no-octal-escape': 'error',
    'no-lonely-if': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-useless-call': 'error',
    'no-useless-return': 'error',
    'require-await': 'error',
    'wrap-iife': ['error', 'inside'],
    'no-undefined': 0,
    curly: ['error', 'all'],
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': [2, 'always', { requireForBlockBody: false }],
    yoda: ['error', 'never', { exceptRange: true }],
    'no-useless-computed-key': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': [
      'error',
      'always',
      { avoidExplicitReturnArrows: true },
    ],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-numeric-literals': 'error',
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-invalid-this': ['error', { capIsConstructor: false }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: true,
      },
    ],
    'no-async-promise-executor': 'error',
    'no-useless-concat': 'error',
    'prefer-template': 'error',
    // custom
    'no-restricted-properties': [
      2,
      {
        object: 'todoDissallow',
      },
    ],
    'no-restricted-syntax': [
      'error',
      // {
      //   "selector": "FunctionExpression",
      //   "message": "Function expressions are not allowed."
      // },
      {
        selector:
          "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        message: 'setTimeout must always be invoked with two arguments.',
      },
    ],
    // Индусы?
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'max-depth': ['error', 4],
    'max-lines': [
      'error',
      { max: 250, skipBlankLines: true, skipComments: true },
    ],
    'max-lines-per-function': [
      'error',
      { max: 50, skipBlankLines: true, skipComments: true },
    ],

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'sort-vars': 'warn',
    'quote-props': ['error', 'as-needed'],
    'prefer-object-spread': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'operator-assignment': 'warn',

    // Vue

    'vue/require-prop-types': 'error',
    'vue/require-default-prop': 'error',
    'vue/eqeqeq': 'error',
    'vue/no-irregular-whitespace': 'error',
    'vue/no-reserved-component-names': 'error',
    'vue/prefer-template': 'error',
    'vue/space-in-parens': 'error',
    'vue/object-curly-spacing': 'error',
    'vue/no-static-inline-styles': [
      'error',
      {
        allowBinding: false,
      },
    ],
    'vue/no-useless-v-bind': [
      'warn',
      {
        ignoreIncludesComment: true,
        ignoreStringEscape: true,
      },
    ],
    'vue/no-useless-mustaches': [
      'warn',
      {
        ignoreIncludesComment: true,
        ignoreStringEscape: true,
      },
    ],
    'vue/no-useless-concat': 'warn',

    'vue/static-class-names-order': 'off',
    'vue/no-unsupported-features': [
      'error',
      {
        version: '^2.6.0',
        ignores: [],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/match-component-import-name': 'warn',
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/no-duplicate-attr-inheritance': 'warn',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-potential-component-option-typo': [
      'error',
      {
        presets: ['vue', 'nuxt'],
        threshold: 5,
      },
    ],
    'vue/no-this-in-before-route-enter': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/prefer-true-attribute-shorthand': 'warn',
    'vue/prefer-prop-type-boolean-first': 'error',

    // TODO: отступы в <script>

    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
        ignores: [],
      },
    ],
    'vue/valid-v-bind-sync': 'error',
    'vue/valid-v-slot': 'error',
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/attributes-order': [
      'warn',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      },
    ],
    'vue/no-constant-condition': 'warn',
    'vue/v-on-handler-style': ['error',
      ["method", "inline-function"], // ["method", "inline-function"] | ["method", "inline"] | "inline-function" | "inline"
      {
        "ignoreIncludesComment": true
      }],
    'vue/component-tags-order': [
      'error',
      {
        order: ['docs', 'template', 'script', 'style'],
      },
    ],
    // 'vue/no-restricted-static-attribute': [
    //   'error',
    //   {
    //     key: 'stlye',
    //     message: 'Using "stlye" is not allowed. Use "style" instead.',
    //   },
    // ],
    // 'vue/no-template-target-blank': [
    //   'error',
    //   {
    //     allowReferrer: true,
    //     enforceDynamicLinks: 'always',
    //   },
    // ],
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['lazy-hydrate', 'no-ssr', 'client-only'],
      },
    ],
    'vue/no-unused-properties': [
      'error',
      {
        groups: ['props', 'data', 'computed', 'methods', 'setup'],
        ignorePublicMembers: true,
      },
    ],
    'vue/padding-line-between-blocks': ['error', 'always'],

    // Unicorn
    'unicorn/better-regex': 'warn',
    'unicorn/catch-error-name': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/custom-error-definition': 'off',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/expiring-todo-comments': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': 'error',
    'unicorn/import-index': 'warn',
    'unicorn/new-for-builtins': 'off',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-for-loop': 'warn',
    'unicorn/no-hex-escape': 'warn',
    'unicorn/no-keyword-prefix': 'warn',
    'unicorn/no-nested-ternary': 'warn',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-null': 'warn',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-reduce': 'off',
    'unicorn/no-unreadable-array-destructuring': 'off',
    'unicorn/no-unsafe-regex': 'warn',
    'unicorn/no-unused-properties': 'off',
    'unicorn/no-useless-undefined': 'warn',
    'unicorn/no-zero-fractions': 'warn',
    'unicorn/no-object-as-default-parameter': 'warn',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-add-event-listener': 'warn',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-dataset': 'warn',
    'unicorn/prefer-event-key': 'off',
    'unicorn/prefer-flat-map': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-modern-dom-apis': 'warn',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-node-append': 'warn',
    'unicorn/prefer-node-remove': 'warn',
    'unicorn/prefer-optional-catch-binding': 'warn',
    'unicorn/prefer-set-has': 'warn',
    'unicorn/prefer-query-selector': 'warn',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-replace-all': 'warn',
    'unicorn/prefer-spread': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/prefer-trim-start-end': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/string-content': 'off',
    'unicorn/throw-new-error': 'warn',
    // 'unicorn/catch-error-name': 0,

    'no-nested-ternary': 'off',

    // TODO: https://eslint.vuejs.org/rules/no-restricted-syntax.html
    //'vue/no-restricted-syntax': 'error',

    // 'vue-i18n/no-unused-keys': ['error', {
    //   src: "./",
    //   extensions: ['.js', '.vue']
    // }]
    // 'unicorn/filename-case': 0,
    // 'tree-shaking/no-side-effects-in-initialization': 2,

    // 'unicorn/prevent-abbreviations': 0,

    // 'vue-scoped-css/no-parsing-error': 'error',
    // 'vue-scoped-css/require-selector-used-inside': 'error',
    // 'vue-scoped-css/no-unused-keyframes': 'error',
    // 'vue-scoped-css/no-unused-selector': 'error',
    // 'vue-scoped-css/require-scoped': 'error',

    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in types are first
          'external',
          'internal',
          ['sibling', 'parent'], // Then sibling and parent types. They can be mingled together
          'index', // Then the index file
          'object',
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/no-unused-modules': [
      2,
      {
        unusedExports: true,
        missingExports: true,
        ignoreExports: ['**/pages/**', '**/layouts/**'],
      },
    ],

    'unused-imports/no-unused-imports': 'error',
  },
  // "overrides": [
  //   {
  //     "files": ["*.vue"],
  //     "rules": {
  //       "indent": "off"
  //     }
  //   }
  // ]
  settings: {
    'import/resolve': {
      extensions: ['.vue', '.js', '.ts'],
    },
    'import/resolver': 'nuxt',
    // {
    //       webpack: {
    //         config: 'webpack.config.js',
    //       },
    //     },
  },
}
