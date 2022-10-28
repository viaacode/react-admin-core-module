# Meemoo - React admin core module

## General

This repository contains the general meemoo React admin core module to be consumed by applications
needing an admin section using the React framework.

It is built with:
- node: `v16.x.x` ( ~ `lts/gallium`)
- npm: `v8.x.x`

For a complete list of packages and version check out the `package.json` file.

## Releasing

- Build your code locally to identify any build errors
- Open a pull request to `legacy-v1.x`
- Wait for approval
- Check out `legacy-v1.x` locally
- Merge your approved pull request
- Run `$ npm version minor/patch` after merging to `legacy-v1.x`.
    - Don't use `$ npm version major` as this will conflict with the changes in the `main` branch.
- Push code and tags to `legacy-v1.x` using:
    - `$ git push origin --tags`
- Check your build's progress in [Jenkins](https://ci.meemoo.be/blue/organizations/jenkins/hetarchief%2Freact-admin-core-module/activity).
- Upgrade the versions in the (hetarchief) [client](https://github.com/viaacode/hetarchief-client/) and [proxy](https://github.com/viaacode/hetarchief-proxy/) repositories and perform any necessary changes.
    - ⚠️ Make sure to run linting, testing and builds in each repository
- Open pull requests for each repository and refer to the pull request you opened initially.

## Team

This project was created by:
- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Ward Vercruyssen: ward.vercruyssen@studiohyperdrive.be
- Bert Verhelst: bert.verhelst@studiohyperdrive.be

It was previously maintained by:
- Andry Charlier: andry.charlier@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
