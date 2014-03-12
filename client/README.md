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
### Install cli tools
Install grunt-cli
```sh
npm install -g grunt-cli
which grunt
```
Install bower
```sh
npm install -g bower
which bower
```
### Install node_modules
```sh
cd $GOPATH/src/chant/client
npm install
```
### Install bower components
```sh
cd $GOPATH/src/chant/client
bower install
```
### build
```sh
cd $GOPATH/src/chant/client
grunt build
```
