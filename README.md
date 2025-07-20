# dektol 🎞

> a simple photography portfolio website maker

### system dependencies

| name   | min. version |
| :----- | -----------: |
| `node` |     `22.6.0` |

### setup

this project uses local file system as it’s data source.

currently, this project is divided between:

1. cli: reading local system and creating an http api
2. static website generator: that consumes the api and outputs plain html/css/js

```bash
# install dependencies:
$ bun i

# to start the cli/api:
$ bun --watch cli/serve.ts

# to start a development server for the static website generator:
$ bun dev

# to build the static site:
$ bun build # outputs to ./dist directory
```

### commit standard

this repo follows the [gitmoji](https://gitmoji.carloscuesta.me/) specification, and enforce it with a custom git-hook.

if you want to contribute to it, make sure you’re following it.
