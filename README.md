# Custom JavaScript Module Bundler

This project is a custom JavaScript module bundler that mimics the functionality of popular bundlers like Webpack. It uses Babel to parse and transpile ES6+ JavaScript code into a format that is compatible with most browsers.

## Features

- **Module Dependency Graph:** Builds a graph of module dependencies by parsing `import` statements.
- **Babel Transpilation:** Uses Babel to convert modern JavaScript syntax into widely supported ES5.
- **Bundle Output:** Outputs a single bundled JavaScript file that can be executed in the browser.

## How It Works

1. **Create Asset:** 
   - Reads the content of each JavaScript file.
   - Parses it into an Abstract Syntax Tree (AST) using Babel.
   - Identifies dependencies by looking at `import` statements.

2. **Create Graph:**
   - Constructs a dependency graph by recursively analyzing each module.
   - Maps out how each module is connected through its dependencies.

3. **Bundle:**
   - Combines all modules into a single JavaScript file.
   - Creates a simple `require` function to manage module loading and execution.