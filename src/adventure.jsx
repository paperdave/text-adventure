// due to me being stupid, the package got published to npm, but the source .jsx never got pushed to github
// that file is now lost, and all i have is this JS file from babel
import React from 'react';
import ReactDOM from 'react-dom';

// a simple game engine.
let scenes = {};
let rootElement = document.querySelector("#root");
let hasStarted = false;
let currentScene = "start";
let previousScene = null;

function rerender() {
  if (hasStarted) ReactDOM.render(React.createElement(Render, null), rootElement);
}

function error(message) {
  return [
    <h1>Error</h1>,
    <p style={{color: 'red'}}>
      {message}
    </p>
  ];
}

let template = () => <div>
  <h1>Text Adventure</h1>
  <Prompt />
  <Options />
</div>

export function setRootElement(root) {
  rootElement = root;
}

export function setCustomHTML(jsx) {
  template = jsx;
  rerender();
}

export function addScenes(newScenes) {
  Object.keys(newScenes).forEach(function (name) {
    if (newScenes[name].options) {
      newScenes[name].options.forEach(function (option) {
        option.uid = Math.round(Math.random() * 999999).toString();
      });
    }
  });
  scenes = Object.assign(scenes, newScenes);

  if (!hasStarted && 'start' in newScenes) {
    hasStarted = true;
  }

  rerender();
}

export function addFlag(name, initialValue) {
  if (name in window) return;
  let value = initialValue;

  Object.defineProperty(window, name, {
    get: function get() {
      return value;
    },
    set: function set(y) {
      value = y;
      rerender();
    }
  });
}

function handleClick(option) {
  let newScene = scenes[option.to];

  if (typeof option.action === "function") {
    option.action();
  }

  if (newScene && typeof newScene.action === "function") {
    newScene.action();
  }

  previousScene = currentScene;
  currentScene = option.to;
  rerender();
}

export let Prompt = function Prompt() {
  let prompt = scenes[currentScene].prompt;
  if (typeof prompt === "function") prompt = prompt();
  return <div>{prompt}</div>;
};

export let Options = function Options() {
  return <ul>
    {
      scenes[currentScene].options.map(function (option) {
        if (option.if && !option.if()) return null;
        let text = option.text;
        if (typeof text === "function") text = text();

        return <li key={option.uid}><a href="#" onClick={() => handleClick(option)}>{text}</a></li>
      })
    }
  </ul>
};

function Render() {
  // validate the current screen
  if (!(currentScene in scenes)) {
    return error("Cannot find scene '".concat(currentScene, "'").concat(!previousScene ? "" : ", caused from scene '".concat(previousScene, "'")), true);
  }

  if (!scenes[currentScene].prompt) {
    return error("Scene '".concat(currentScene, "' is missing a prompt."), true);
  }

  if (typeof scenes[currentScene].prompt !== "string" && typeof scenes[currentScene].prompt !== "function") {
    return error("Scene '".concat(currentScene, "' has an invalid prompt type (").concat(typeof scenes[currentScene].prompt, ", expecting function or string)"), true);
  }

  if (!scenes[currentScene].options) {
    return error("Scene '".concat(currentScene, "' is missing an options array"), true);
  }

  if (!Array.isArray(scenes[currentScene].options)) {
    return error("Scene '".concat(currentScene, "' has an options value, but it is not an array."), true);
  }

  for (let i = 0; i < scenes[currentScene].options.length; i++) {
    let element = scenes[currentScene].options[i];

    if (typeof element.text !== "string" && typeof element.text !== "function") {
      return error("Scene '".concat(currentScene, "', options #").concat(i, " does not contain a prompt (").concat(typeof element.text, ", expecting function or string)"), true);
    }

    if (typeof element.to !== "string") {
      return error("Scene '".concat(currentScene, "', options #").concat(i, " does not contain a valid 'to' property"), true);
    }
  }

  try {
    return template();
  } catch (err) {
    return error(err, true);
  }
}
