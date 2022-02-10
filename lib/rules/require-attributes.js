/**
 * @fileoverview Alphabetizes static class names, same as vue/static-class-order but takes into account "-", "_" class prefixes and puts them in the end, for example `class="a-class b-class -a-modifier -b-modifier"`
 * @author maddocnc @ frenchrabbit https://github.com/frenchrabbit/eslint-plugin-frabbit-vue
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const {defineTemplateBodyVisitor} = require('eslint-plugin-vue/lib/utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://github.com/frenchrabbit/eslint-plugin-frabbit-vue',
      description: 'Require attributes on tags, default img width+height',
      categories: undefined,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            value: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            empty: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
          }
        },
      },
      {
        // editor callback
      }
    ],
  },
  create: (context) => {
    const rules = {
      img: {value: ['width', 'height']},
      ...context.options[0]
    }


    const names = Object.keys(rules)

    return defineTemplateBodyVisitor(context, {
      VElement (node) {
        const {name, startTag} = node
        const {attributes} = startTag

        const callback = rules[name]?.callback

        if (!names.includes(name)) {
          return
        }

        let attrsValues = attributes.reduce((acc, atr) => {
          const name = atr.key.name.directive ? 'v-'+atr.key.name.name : atr.key.name
          acc[name] = atr.value?.value || ''
          return acc
        }, {})


        const attrsRange = attributes.reduce((acc, atr) => [Math.min(acc[0], atr.range[0]), Math.max(acc[1], atr.range[1])]
        , [9999999,0])


        if (typeof callback === 'function') {

          const edit = callback(attrsValues)

          // no error here
          if (edit === true) {
            return
          }

          const report = {
            node,
            loc: node.loc,
            message: `User callback error. ${typeof edit === 'string' ? edit : ''}`
          }

          if (typeof edit === 'object') {

            const text = Object.keys(edit).reduce((acc, key) => {
              acc += ` ${key}`
              const empty = (edit[key] === undefined && edit[key] === '')
              return acc + (empty  ? '' :  `="${edit[key]}"`)
            }, '')
            report.message = `User callback requres update on props <${name}>!`
            report.fix = (fixer) => fixer.replaceTextRange(attrsRange, text)
          }

          context.report(report)
        }

        rules[name].empty?.forEach((attr) => {

          if (!attrsValues[attr] && attrsValues[attr] !== '') {
            context.report({
              node,
              loc: node.loc,
              message: `Attribute ${attr} is requred, at least empty on <${name}>!`,
              fix: (fixer) => fixer.insertTextAfterRange(attrsRange, ' ' + attr)
            })
          }
        })

        rules[name].value?.forEach((attr) => {
          if (!attrsValues[attr]) {
            context.report({
              node,
              loc: node.loc,
              message: `Attribute ${attr} is requred, on <${name}>!`
            })
          }
        })

      }
      // "VAttribute[directive=false][key.name='class']"(node) {
      //   const classList = node.value.value
      //   const classListWithWhitespace = classList.split(/(\s+)/)
      //
      //   // Detect and reuse any type of whitespace.
      //   let divider = ''
      //   if (classListWithWhitespace.length > 1) {
      //     divider = classListWithWhitespace[1]
      //   }
      //
      //   const classListNoWhitespace = classListWithWhitespace.filter(
      //     (className) => className.trim() !== ''
      //   )
      //   const prefixes = ['-', '_', ':']
      //   const classListSorted = classListNoWhitespace
      //     .sort((a, b) => {
      //       const aPrefixed = prefixes.includes(a[0])
      //       const bPrefixed = prefixes.includes(b[0])
      //       if (aPrefixed === bPrefixed) {
      //         // Оба префикснуты, или оба не префикснуты, сортируем как обычно.
      //         return ('' + a).localeCompare(b)
      //       } else {
      //         return aPrefixed ? 1 : -1
      //       }
      //     })
      //     .join(divider)
      //
      //   if (classList !== classListSorted) {
      //     context.report({
      //       node,
      //       loc: node.loc,
      //       message: 'Classes should be ordered alphabetically.',
      //       fix: (fixer) =>
      //         fixer.replaceTextRange(
      //           [node.value.range[0], node.value.range[1]],
      //           `"${classListSorted}"`
      //         ),
      //     })
      //   }
      // },
    })
  },
}
