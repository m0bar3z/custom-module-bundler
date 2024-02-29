import fs from 'fs';
import babel from '@babel/core';
import path from 'path';

/**
 * Abstract Syntax Tree:
 * a higher level model of that tells us alot of imformation about
 * the code we are parsing! https://astexplorer.net/
 */

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babel.parse(content);
  
  const dependencies = [];
  
  babel.traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  })

  const id = ID++;
  // transpile the module with babel
  const { code } = babel.transformFromAst(ast, null, {
    // presets? how to do the transformation, just a set of rules to tell babel 
    // how to transofrm my code
    // env preset just tells babel: make sure my code is goiing to run on every popular
    // browser
    presets: ["@babel/preset-env"]
  })

  return {
    id,
    filename,
    dependencies,
    code
  }
}

function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);

      asset.mapping[relativePath] = child.id;
      queue.push(child);
    })
  }

  return queue;
}

function bundle(graph) {
  let modules = '';

  graph.forEach(mod => {
    modules = modules + `${mod.id}: [
      function (require, module, exports) { 
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],`;
  })

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} } 

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `

  return result;
}

const graph = createGraph('./example/entry.js');
const result = bundle(graph);
console.log(result);
