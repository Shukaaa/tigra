# Tigra

> This project is in early development. It's not ready for production use. (It's also a learning project for me.)

Tigra stands for TypeScript Integration & Proficient HTML Rendering Approach. <br/>

It is a simple markup language that is built on top of HTML. It is designed for reusing HTML components and for writing HTML in a more concise way.

Benefits of Tigra:
- Import HTML or Tigra components / code
- Create Templates
- use TypeScript inside script-tags (soon)
- use SCSS inside style-tags (soon)
- Import markdown files (soon)

## Installation

```sh
npm install tigra
```

## Create a Tiagra example project

```sh
tigra new <projectName>
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