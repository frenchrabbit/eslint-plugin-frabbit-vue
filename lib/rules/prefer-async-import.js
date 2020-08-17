/**
 * @fileoverview Report used components
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('eslint-plugin-vue/lib/utils')
const casing = require('eslint-plugin-vue/lib/utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Force to use vue components async import',
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
    const importedItems = []
    const importsByItem = {}
    // const importsByPath = {}
    const requiredItems = []
    const requireByItem = {}
    // const requireByPath = {}
    const asyncItems = []

    const isAsyncImport = (node) => {
      // console.dir(node)
      // console.log(
      //   node && node.type && node.type, // === 'ArrowFunctionExpression',
      //   node.body && node.body.type, // === 'CallExpression',
      //   node.body && node.body.callee && node.body.callee.type // === 'Import'
      // )
      return (
        node &&
        node.type &&
        node.type === 'ArrowFunctionExpression' &&
        node.body &&
        (node.body.type === 'ImportExpression' ||
          (node.body.type === 'CallExpression' &&
            node.body.callee &&
            node.body.callee.type === 'Import'))
      )
    }

    const conditionalComponents = new Set()
    let components = []
    let ignoreReporting = false
    let templateLocation
    let exportNode

    const templateVisitor = {
      VElement(node) {
        if (
          (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
          utils.isHtmlWellKnownElementName(node.rawName) ||
          utils.isSvgWellKnownElementName(node.rawName) ||
          !utils.hasDirective(node, 'if')
        ) {
          return
        }

        conditionalComponents.add(node.rawName)
      },
      // "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is']"(
      //   node
      // ) {
      //   if (
      //     !node.value || // `<component :is>`
      //     node.value.type !== 'VExpressionContainer' ||
      //     !node.value.expression // `<component :is="">`
      //   )
      //     return
      //
      //   if (node.value.expression.type === 'Literal') {
      //     conditionalComponents.add(node.value.expression.value)
      //   }
      //   // } else if (ignoreWhenBindingPresent) {
      //   //   ignoreReporting = true
      //   }
      // },
      "VAttribute[directive=false][key.name='is']"(node) {
        if (!utils.hasDirective(node, 'if')) {
          return
        }
        conditionalComponents.add(node.value.value)
      },
      "VElement[name='template']"(rootNode) {
        templateLocation = templateLocation || rootNode.loc.start
      },
      "VElement[name='template']:exit"(rootNode) {
        if (
          rootNode.loc.start !== templateLocation ||
          ignoreReporting ||
          utils.hasAttribute(rootNode, 'src')
        ) {
          return
        }

        for (const comp of components) {
          const compName = comp.name

          const isConditional =
            conditionalComponents.has(compName) || // not v-if
            conditionalComponents.has(casing.kebabCase(compName)) || // not v-if
            conditionalComponents.has(casing.camelCase(compName)) || // not v-if
            conditionalComponents.has(casing.pascalCase(compName))

          if (
            isConditional && // v-if
            (asyncItems.includes(compName) || isAsyncImport(comp.node.value)) // async
          ) {
            // Valid
            continue
          }

          if (
            !isConditional // not v-if
          ) {
            if (isAsyncImport(comp.node.value)) {
              context.report({
                node: comp.node,
                message: `Component "{{compName}}" doesn't need async import`,
                data: {
                  compName,
                },
                fix: (fixer) => [
                  // fixer.replaceText(
                  //   comp.node,
                  //   `${compName}: () => import('${importsByItem[compName].source.value}')`
                  // ),
                  fixer.insertTextBefore(
                    exportNode,
                    `import ${compName} from '${comp.node.value.body.source.value}'\n`
                  ),
                  fixer.replaceText(comp.node, compName),
                ],
                // fix: (fixer) => fixer.insertTextBefore(comp.node.value, '() => '),
              })
            }
          } else {
            // Looks like import, but direct not () => {}
            if (comp.node.value.type === 'ImportExpression') {
              context.report({
                node: comp.node,
                message: `Component "{{compName}}" has incorrect async import, should be () => import().`,
                data: {
                  compName,
                },
                fix: (fixer) =>
                  fixer.insertTextBefore(comp.node.value, '() => '),
              })
            } else {
              let fix = null
              if (
                comp.node.value.type === 'CallExpression' &&
                comp.node.value.callee.name === 'require'
              ) {
                fix = (fixer) =>
                  fixer.replaceText(
                    comp.node.value,
                    `() => import('${comp.node.value.arguments[0].value}')`
                  )
              } else if (importedItems.includes(compName)) {
                fix = (fixer) => [
                  fixer.replaceText(
                    comp.node,
                    `${compName}: () => import('${importsByItem[compName].source.value}')`
                  ),
                  fixer.remove(importsByItem[compName]),
                ]
              } else if (requiredItems.includes(compName)) {
                fix = (fixer) => {
                  const declarator = requireByItem[compName]
                  const fix = [
                    fixer.replaceText(
                      comp.node,
                      `${compName}: () => import('${declarator.init.arguments[0].value}')`
                    ),
                  ]

                  if (declarator.parent.declarations.length === 1) {
                    fix.push(fixer.remove(declarator.parent))
                  } else {
                    const after = context
                      .getSourceCode()
                      .getTokenAfter(declarator)
                    const before = context
                      .getSourceCode()
                      .getTokenBefore(declarator)
                    const range = declarator.range
                    if (after.type === 'Punctuator') {
                      range[1] = after.range[1]
                    } else if (before.type === 'Punctuator') {
                      range[0] = before.range[0]
                    }
                    fix.push(fixer.removeRange(range))
                  }
                  return fix
                }
              }

              context.report({
                node: comp.node,
                message: `Component "{{compName}}" should use async import.`,
                data: {
                  compName,
                },
                fix,
              })
            }
          }
        }
      },
    }

    const scriptVisitor = Object.assign(
      {},
      {
        // import component from 'component'
        'Program > ImportDeclaration'(node) {
          // console.log('IMPORT', node)
          // console.log(node.parent.type)
          node.specifiers.forEach((specifier) => {
            if (
              specifier.type === 'ImportDefaultSpecifier' &&
              specifier.local.type === 'Identifier'
            ) {
              importedItems.push(specifier.local.name)
              importsByItem[specifier.local.name] = node
              // importsByPath[node.source.value] =
              //   importsByPath[node.source.value] || []
              // importsByPath[node.source.value].push(specifier.local.name)
            }
          })
        },
        // const component = require('component')
        'Program > VariableDeclaration'(node) {
          // console.log(node.parent.type)
          node.declarations.forEach((declarator) => {
            if (
              declarator.id.type === 'Identifier' && // Пока const {comp, other} не поддерживаются
              declarator.init.type === 'CallExpression' &&
              declarator.init.callee.name === 'require'
            ) {
              requiredItems.push(declarator.id.name)
              requireByItem[declarator.id.name] = declarator
              // const path = declarator.init.arguments[0].value
              // requireByPath[path] = requireByPath[path] || []
              // requireByPath[path].push(node)
            }

            if (isAsyncImport(declarator.init)) {
              asyncItems.push(declarator.id.name)
            }
          })
        },
      },
      utils.executeOnVue(context, (obj) => {
        components = utils.getRegisteredComponents(obj)
        exportNode = obj.parent
      })
    )

    return utils.defineTemplateBodyVisitor(
      context,
      templateVisitor,
      scriptVisitor
    )
  },
}
