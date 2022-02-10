# eslint-plugin-frabbit-vue

internal frabbit eslint rules for Vue.js

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-frabbit-vue`:

```
$ npm install eslint-plugin-frabbit-vue --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-frabbit-vue` globally.

## Usage

Add `frabbit-vue` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "frabbit-vue"
    ]
}
```


Then configure the rules you want to use under the rules section.

```javascript
module.exports = {
  "rules": {
    "frabbit-vue/vue-no-unused-methods": "error",
    "frabbit-vue/vue-no-unused-properties": "error",
    "frabbit-vue/vue-no-unused-vuex-methods": "error",
    "frabbit-vue/vue-no-unused-vuex-properties": "error",
    "frabbit-vue/vue-static-class-order-ext": "error",
    "frabbit-vue/require-attributes": [
      "error",
      {
        "img": {
          /**
           * this attributes requred to be with values
           */
          "value": ["width", "height"],
          /**
           * this attributes required to be at list without value
           */
          "empty": ['data-my-extra-attribute'],
          /**
           * user callback, wich is another way to set rules
           * attrs here is object with attributes, like
           *   {
           *     src: 'img.png',
           *     width: '100',
           *     height: '100',
           *   }
           * this callback should return one of the:
           *  - true - no error
           *  - false - error, will says that it is callback error
           *  - string - error with returned string
           *  - object - new attributes object, will replace ALL ATRIBUTES
           *
           *  could be used for example to force change src to v-lazy directive on images
           */
          callback: 
            (attrs) => {

            if (attrs.src) {
              const src = attrs.src
              delete attrs.src
              attrs['v-lazy'] = attrs['v-lazy'] || `{src:'${src}'}`
              return attrs
            }
            return true
          }
        }
      },
      
    ]
  }
}
```

## Plugin adds Rules

Rules based on https://github.com/learningequality/kolibri tools, which packages seems to be abandoned:

Added fix mode, unused properties a commented

* `frabbit-vue/vue-no-unused-methods` - (fixable) checks for unused methods
* `frabbit-vue/vue-no-unused-properties` - (fixable) checks for unused props, data, asyncData(Nuxt.js) and computed
* `frabbit-vue/vue-no-unused-vuex-methods` - (fixable) checks for unused mapActions, mapMutations
* `frabbit-vue/vue-no-unused-vuex-properties` - (fixable) checks for unused mapGetters

Custom vue eslint rules

* `frabbit-vue/vue-static-class-order-ext` - (fixable) same as vue/static-class-order but takes into account "-", "_" class prefixes and puts them in the end, for example `class="a-class b-class -a-modifier -b-modifier"`

Additional rules

* `frabbit-vue/prefer-async-import` - (fixable) forces to use async component import, when component have v-if or placed inside client-only/lazy-hydrate `() => import('component')`
* `frabbit-vue/no-unnecessary-style-lang` - (fixable) Alpha! removes unnecessary lang="scss" if styles inside doesn't changes during scss compilation. This disables sass-loader for component and can speed up building.



## Important

Vue components templates should be html, pug is not supported by vue-eslint-parser. By the way most plugins not support pug for this reason

## Config

Plugin adds config recommended, wich is internal config for frabbit developers.



