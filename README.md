# dektol 🎞

> a simple photography portfolio website maker

### system dependencies

| name   | min. version |
| :----- | -----------: |
| `node` |     `16.0.0` |
| `yarn` |      `1.0.0` |

### simple cms setup + downloading the project + running

this project uses [prismic](https://prismic.io) as it’s data source.

prismic provides a way to clone the project and upload the custom type definitions contained on this github repository with a single command:

```bash
$ npx prismic-cli theme https://github.com/vitordino/dektol
```

the command above will prompt you to login/register on prismic, and then it will:

1. create a repository with the chosen subdomain
2. upload the custom types
3. download the project files (contained on this github repo)
4. install the dependencies

after this is done, certify your terminal is on the right folder, then you can run the project locally:

```bash
# to start a development server
$ yarn dev

# to build the static site
$ yarn build # outputs to ./dist directory
```

### advanced cms setup: protected content api

by default, prismic will start your content under a "public api for master only" so all your content is queryable across the interwebs without any gate.

if you wish to hide this content from other people, you’ll need to change the setting on `prismic repo settings` → `api & security` → `content api` → `repository security`

then you will need to add a `PRISMIC_TOKEN` on your `.env` file for the project access the newly secured api.

you can get this token by using the `generate an access token` section on the same page, it should give you a `permanent access token`.

### advanced cms setup: custom types

if you wish to develop your own prismic custom types to extend the website content capabilities, it’s handy to use a script to download the jsons and automatically generate it’s typescript counterparts.

for this, you’ll need to provide a `PRISMIC_TYPES_TOKEN` on your `.env` file.

you can get this token by clicking `prismic repo settings` → `api & security` → `custom types api` and filling in the `generate a new token` form.

then copy the resulting token and paste it on the `.env` file.

### commit standard

this repo follows the [gitmoji](https://gitmoji.carloscuesta.me/) specification, and enforce it with a custom git-hook.

if you want to contribute to it, make sure you’re following it.
