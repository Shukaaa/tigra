# Tigra Basics

## Importing Markup Components

### Importing HTML files

You can import HTML files with the `import` tag, for example:

```html
<import:markup src="components/footer/footer.html"></import:markup>
```

This will import the HTML file `components/footer/footer.html` and insert it at this position.

> Note: Tigra's custom tags can not be used inside the head tag.

### Importing Tigra files

It's the same as importing HTML files:

```html
<import:markup src="components/footer/footer.tigra"></import:markup>
```

## Creating Templates

You can create templates with the `template` tag, for example:

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tigra Example</title>
</head>
<body>
    <import:markup src="components/header/header.html"></import:markup>
    <main class="container">
        <template:outlet></template:outlet>
    </main>
    <import:markup src="components/footer/footer.html"></import:markup>
</body>
</html>
```

We see here that the `template` has an `outlet` tag. This is where the content of the template will be inserted.

Now we can use this template in another file:

```html
<template:use src="../templates/template.tigra"></template:use>

<p>Lorem nom nom</p>
```

We define the `template:use` tag at the top of the file. The `src` attribute is the path to the template file. <br/>
Now the content of this file will be inserted into the `outlet` tag of the template.

## Injecting Data into Templates

You can inject data into templates with a custom data attribute, for example:

```html
<template:use src="../templates/template.tigra" data-title="New Page Title"></template:use>

<p>Lorem nom nom</p>
```

Now the name of the template data variable is `title`. We can use this variable in the template file with the `template:data` tag and the `name` attribute:

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tigra Example</title>
</head>
<body>
    <import:markup src="components/header/header.html"></import:markup>
    <main class="container">
        <h1>
            <template:data name="title"></template:data>
        </h1>
        <template:outlet></template:outlet>
    </main>
    <import:markup src="components/footer/footer.html"></import:markup>
</body>
</html>
```

## Change title of the page with template data

Tigra does not support tigra-tags inside the head tag. That's why we can't use the `template:data` tag inside the head tag. <br/>
Instead we can use the `meta` tag for this special case:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta inject-title name="title">
</head>
```

We can use the `inject-title` attribute to tell Tigra that this meta tag should be used to change the title of the page. <br/>
The `name` attribute is the name of the template data variable.