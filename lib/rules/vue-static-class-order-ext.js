/**
 * @fileoverview Alphabetizes static class names.
 * @author Maciej Chmurski
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { defineTemplateBodyVisitor } = require('eslint-plugin-vue/lib/utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://eslint.vuejs.org/rules/static-class-names-order.html',
      description: 'enforce static class names order',
      categories: undefined,
    },
    fixable: 'code',
    schema: [],
  },
  create: context => {
    return defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='class']"(node) {
        const classList = node.value.value
        const classListWithWhitespace = classList.split(/(\s+)/)

        // Detect and reuse any type of whitespace.
        let divider = ''
        if (classListWithWhitespace.length > 1) {
          divider = classListWithWhitespace[1]
        }

        const classListNoWhitespace = classListWithWhitespace.filter(
          className => className.trim() !== ''
        )
        const prefixes = ['-', '_', ':']
        const classListSorted = classListNoWhitespace
          .sort((a, b) => {
            const aPrefixed = prefixes.includes(a[0])
            const bPrefixed = prefixes.includes(b[0])
            if (aPrefixed === bPrefixed) {
              // Оба префикснуты, или оба не префикснуты, сортируем как обычно.
              return ('' + a).localeCompare(b)
            } else {
              return aPrefixed ? 1 : -1
            }
          })
          .join(divider)

        if (classList !== classListSorted) {
          context.report({
            node,
            loc: node.loc,
            message: 'Classes should be ordered alphabetically.',
            fix: fixer =>
              fixer.replaceTextRange(
                [node.value.range[0], node.value.range[1]],
                `"${classListSorted}"`
              ),
          })
        }
      },
    })
  },
}
