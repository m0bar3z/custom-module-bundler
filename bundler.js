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

  return {
    id,
    filename,
    dependencies
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

const graph = createGraph('./example/entry.js');
console.log(graph);