# Web Text Adventure
This is a text adventure game engine built with React.

[Example Live Here](https://imdaveead.github.io/text-adventure/example/example.html)

to get started:
1. install nodejs and npm
1. run `npx web-text-adventure`
1. run `cd adventure`
1. run `npm i -D`
1. npm `npm start`
1. a live development server is now running
1. edit stuff

you can run `npm start` at any point to start

To make production build

1. run `npm build`
1. your build is inside `dist`

## Concepts
### Scenes
A scene is a single screen of information, it contains one or more options. These options
will link you to other scenes.

### Flags
Flags are essentially just global variables, but the system will keep track of their initial value
so you can reset them with `resetFlags()`, and whenever a change is made to the flag, it reupdates the
UI on screen.

### Single Instance
You can only run one instance of the game engine per page, as it sets global variables.
