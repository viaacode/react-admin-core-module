# Meemoo - React admin core module

## General

This repository contains the general meemoo React admin core module to be consumed by applications
needing an admin section using the React framework.

It is built with:

- node: `v20.x.x`
- npm: `v9.x.x`

For a complete list of packages and version check out the `package.json` file.

## Releasing

1. Make sure all PR's are merged into `main`
2. Merge the desired release branch in the `main` branch
3. Update avo2-components and avo2-react-components
4. If a new version of `react-components` is available, run `cd ui/ && npm i`.
5. Extract translations for the `admin-core-module/ui` by running `cd ui/ && npm run translations:extract`
6. Update `package.json` and `package-lock.json` by running `npm run bump`
7. Stage changes `git add .` and commit changes with message `git commit -m "x.x.x"`
8. Create a `tag` by running `git tag vx.x.x` (use the same number as used in the `package.json` `version` field)
9. Push to the remote (`git push origin --follow-tags`)
10. Check your build's progress in [Jenkins](https://ci.meemoo.be/blue/organizations/jenkins/hetarchief%2Freact-admin-core-module/activity).
11. Go to [meemoo's nexus](http://do-prd-mvn-01.do.viaa.be:8081/#browse/browse:npm-viaa:%40meemoo) and check if both the `ui` and `api` are deployed
12. Open pull requests for all repositories and make sure to use the latest version for the `@meemoo/admin-core-api` and `@meemoo/admin-core-ui`

## See your changes

In react-admin-core-module:

- Checkout in the legacy-v1.x branch.
- In the root folder, run 'npm i -f'.
- In the demo folder, run 'npm i -f'.
- Make your changes in demo/src folder.
- In the root folder, run 'npm run build-and-copy-to-client'.

- In hetarchief-proxy, run 'npm start'.
- In hetarchief-client, remove the .next-folder and run 'npm run dev'.

## Team

This project was created by:

- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:

- Ward Vercruyssen: ward.vercruyssen@studiohyperdrive.be
- Bert Verhelst: bert.verhelst@studiohyperdrive.be
- Silke Derudder: silke.derudder@studiohyperdrive.be

It was previously maintained by:

- Andry Charlier: andry.charlier@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
