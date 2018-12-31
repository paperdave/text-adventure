// due to me being stupid, the package got published to npm, but the source .jsx never got pushed to github
// that file is now lost, and all i have is this JS file from babel
import React from 'react';
import ReactDOM from 'react-dom';
import { If } from './util.jsx';
import packagejson from '../package.json';

// a simple game engine.
let scenes = {};
let flagInitialValues = {};
let rootElement = document.querySelector("#root");
let hasStarted = false;
let currentScene = "start";
let previousScene = null;
let debugPanelOpen = false;

function rerender() {
  if (hasStarted) ReactDOM.render(React.createElement(Render, null), rootElement);
}

function error(message) {
  return [
    <h1>Error</h1>,
    <p style={{color: 'red'}}>
      {message}
    </p>,
    <DebugPanel />
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

export function setScene(newscene, src) {
  if (src) currentScene = src;
  handleClick({
    to: newscene
  });
}

export function addScenes(newScenes) {
  Object.keys(newScenes).forEach(function (name) {
    if (newScenes[name].options) {
      newScenes[name].options = newScenes[name].options.map(function (option) {
        if(option === "seperator") {
          return { is: "seperator", uid: Math.round(Math.random() * 999999).toString() };
        }
        option.uid = Math.round(Math.random() * 999999).toString();
        return option;
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
  if (name in window) return window[name];
  let value = initialValue;
  flagInitialValues[name] = initialValue;

  Object.defineProperty(window, name, {
    get: function get() {
      return value;
    },
    set: function set(y) {
      value = y;
      rerender();
    }
  });

  return value;
}

export function resetFlags() {
  Object.keys(flagInitialValues).forEach(name => {
    window[name] = flagInitialValues[name];
  });
}

function handleClick(option) {
  let newScene = scenes[option.to];

  if (typeof option.action === "function") {
    option.action();
  }

  previousScene = currentScene;
  currentScene = option.to;

  if (newScene && typeof newScene.action === "function") {
    newScene.action();
  }
  
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
        if(option.is === "seperator") {
          return <div className="option-seperator" />;
        }

        let disabled = option.if && !option.if();
        if (disabled) {
          if (!option.disabledText) return null;
        }
        
        if(!disabled) {
          let text = option.text;
          if (!React.isValidElement(text) && typeof text === "function") text = text();
          return <li key={option.uid}><a href="#" className={"option option-enabled" + (debugPanelOpen ? ((option.to in scenes) ? "" : " option-broken-link") : "")} onClick={() => handleClick(option)}>{text}</a></li>
        } else {
          let text = (option.disabledText === true) ? option.text : option.disabledText;
          if (!React.isValidElement(text) && typeof text === "function") text = text();

          return <li key={option.uid}><span className="option option-disabled">{text}</span></li>
        }
      })
    }
  </ul>
};

function toggleDebugPanel() {
  debugPanelOpen = !debugPanelOpen;
  rerender();
}
export let DebugPanel = function DebugPanel() {
  if (typeof $hideDebug === "undefined" || $hideDebug) return null;

  return <div style={{
      position: "fixed",
      left: "0",
      bottom: "0",
      paddingTop: "1em",
      paddingBottom: "1em",
      background: "#111",
      width: "100%"
    }}>
    <div style={{
      width: "500px",
      margin: "auto"
    }}>
      <button onClick={toggleDebugPanel}
        style={{
          background: "cornflowerblue",
          border: "none",
          color: "black",
          fontWeight: "bold",
          padding: "0.5em"
        }}
      >Toggle Debug Panel</button>
      <If test={debugPanelOpen}>
        <div>
          <h4>Debug - web-text-adventure@{packagejson.version}</h4>
          <li>
            <a href="#" onClick={() => setScene("start", "<Debug Panel>")}>Go To Start</a>
          </li>
          <li>
            <input id="debug-scene-id" style={{ width: "100px" }} type="text" placeholder="scene id" />
            &nbsp;&nbsp;
            <select id="debug-scene-select" onChange={() => {
              document.getElementById("debug-scene-id").value = document.getElementById("debug-scene-select").value;
            }}>
              {Object.keys(scenes).map(x => <option key={x}>{x}</option>)}
            </select>
            &nbsp;&nbsp;
            <a href="#" onClick={() => setScene(document.getElementById("debug-scene-id").value, "<Debug Panel>")}>Go To Scene</a>
          </li>
          <li>
            <a href="#" onClick={resetFlags}>Reset all Flags</a>
          </li>
        </div>
      </If>
    </div>
  </div>
}

function Render() {
  // validate the current screen
  if (!(currentScene in scenes)) {
    return error("Cannot find scene '".concat(currentScene, "'").concat(!previousScene ? "" : ", caused from scene '".concat(previousScene, "'")), true);
  }

  if (!scenes[currentScene].prompt) {
    return error("Scene '".concat(currentScene, "' is missing a prompt."), true);
  }

  if (!React.isValidElement(scenes[currentScene].prompt) && typeof scenes[currentScene].prompt !== "string" && typeof scenes[currentScene].prompt !== "function") {
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

    if (element.is === "seperator") continue;

    if (typeof element.text !== "string" && typeof element.text !== "function") {
      return error("Scene '".concat(currentScene, "', options #").concat(i, " does not contain a prompt (").concat(typeof element.text, ", expecting function or string)"), true);
    }

    if (typeof element.to !== "string") {
      return error("Scene '".concat(currentScene, "', options #").concat(i, " does not contain a valid 'to' property"), true);
    }
  }

  if(typeof template !== "function") {
    return error("Custom HTML is not passed as a function.", true);
  }

  try {
    return template(scenes[currentScene]);
  } catch (err) {
    return error(err, true);
  }
}
