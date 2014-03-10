# chant-client
:sushi:

This is just my challenge to develop client side by TypeScript.

:sushi:

# set up

### Install nodejs (skip if you already have node)
Install nvm
```sh
cd
git clone git://github.com/creationix/nvm .nvm
source .nvm/nvm.sh
nvm ls
nvm ls-remote
nvm install 0.11.0
# if you need
nvm alias default 0.11.0
```
### Install grunt
Install grunt-cli
```sh
npm install -g grunt-cli
which grunt
```
### Install node_modules
```sh
cd $GOPATH/src/chant/client
npm install
```
### build
```sh
cd $GOPATH/src/chant/client
grunt build
```
