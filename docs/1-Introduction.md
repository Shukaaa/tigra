# Tigra

> This project is in early development. It's not ready for production use. (It's also a learning project for me.)

Tigra stands for TypeScript Integration & Proficient HTML Rendering Approach. <br/>

It is a simple markup language that is built on top of HTML. It is designed for reusing HTML components and for writing HTML in a more concise way.

Benefits of Tigra:
- Import HTML or Tigra components / code
- Import markdown files
- Create Templates
- Share Data between components and templates
- minify script-tags and style-tags
- use TypeScript inside script-tags
- use SCSS inside style-tags (soon)

## Installation

```sh
npm install tigra
```

## Compiling

Compile a file or a folder with the following command:

```sh
tigra compile <input>
```

You can also use the `--outDir` option to specify the output directory (default is out):

```sh
tigra compile <input> --outDir=dist
```