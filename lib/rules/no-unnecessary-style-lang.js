/**
 * @fileoverview Report plain css styles wrapped with <style lang="">
 * @author maddocnc @ frenchrabbit https://github.com/frenchrabbit/eslint-plugin-frabbit-vue
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

// const utils = require('eslint-plugin-vue/lib/utils')
// const casing = require('eslint-plugin-vue/lib/utils/casing')
const sass = require('sass')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Report plain css styles wrapped with <style lang="">',
      category: 'essential',
      url: '',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreWhenBindingPresent: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const styleElement = context.parserServices
      .getDocumentFragment()
      .children.find(
        (node) => node.type === 'VElement' && node.name === 'style'
      )
    return {
      Program(node) {
        const langAttr = styleElement.startTag.attributes.find(
          (attr) => attr.key.name === 'lang'
        )

        const lang = (langAttr && langAttr.value.value) || 'css'
        // console.log(lang, styleElement)

        // if (!['sass', 'scss'].includes(lang)) {
        if (lang !== 'scss') {
          return
        }

        const originalStyle = styleElement.children.map((el) => el.value).join()

        // console.log(originalStyle)
        try {
          const { css } = sass.renderSync({
            data: originalStyle,
          })

          const compiledStyle = css.toString('utf-8')

          const cleanStyle = (string) => string.replace(/\s|;/gi, '')

          const cleanedOriginal = cleanStyle(originalStyle)
          const cleanedCompiled = cleanStyle(compiledStyle)
          // console.log(
          //   cleanedOriginal === cleanedCompiled,
          //   `"${cleanedOriginal}" <> "${cleanedCompiled}"`
          // )
          if (cleanedOriginal === cleanedCompiled) {
            const range = langAttr.range
            range[0]--
            // console.log(langAttr)

            context.report({
              node: styleElement.startTag,
              message: `You might not need lang="{{lang}}" here, because compilation does nothing. But still need extra loader and increase building time.`,
              data: {
                lang,
              },
              fix: (fixer) => fixer.removeRange(range),
            })
          }
        } catch (e) {
          // definetly not css, can't compile because of unresolved import etc
          console.error(e)
          return
        }

        // if (styleElement.attributes)
      },
    }
    // const templateVisitor = {
    //   '*'(node) {
    //     console.log(node)
    //     if (node.name !== 'template') {
    //       return
    //     }
    //     console.log()
    //   },
    // }
    // const scriptVisitor = {}
    // // console.log(context.parserServices.getDocumentFragment())
    // return utils.defineTemplateBodyVisitor(
    //   context,
    //   templateVisitor,
    //   scriptVisitor
    // )
  },
}
