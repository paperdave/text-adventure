import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import packagejson from '../package.json';

let $global = (typeof window !== 'undefined') ? window : ((typeof global !== 'undefined') ? global : {});

// a simple game engine.
if (!('$adventure_flags' in $global)) $global.$adventure_flags = {};
let scenes = {null: true};
let rootElement = (typeof document !== 'undefined') ? document.querySelector('#root') : null;
let hasStarted = false;
let currentScene = 'start';
let previousScene = null;
let debugPanelOpen = false;
let config = {
  collapseSeperators: true,
  debugPanel: null,
  showBrokenLinks: false
};

export function setConfig(name, value) {
  config[name] = value;
}
export function getConfig(name) {
  if(name === 'debugPanel' && config[name] === null) return !$hideDebug;
  return config[name];
}

export function getAllScenes() {
  return scenes;
}

function rerender() {
  if (hasStarted && typeof document !== 'undefined') ReactDOM.render(React.createElement(Render, null), rootElement);
}

function deepcopy(v) {
  return (v instanceof Date)
    ? new Date(v.getTime())
    : (
      typeof v === 'undefined'
        ? undefined
        : JSON.parse(JSON.stringify(v))
    );
}

function error(message) {
  return <Fragment>
    <h1>Error</h1>
    
    <p style={{color: 'red'}}>
      {message}
    </p>

    <p>
      <a href="#" onClick={() => {
        setScene(previousScene);
      }}>Go Back One Step</a>
    </p>
    
    <DebugPanel />

  </Fragment>;
}

let template = () => <div>
  <h1>Text Adventure</h1>
  <Prompt />
  <Options />
</div>;

export function setRootElement(root) {
  rootElement = root;
}

export function setCustomHTML(jsx) {
  template = jsx;
  rerender();
}

export function setScene(newscene, src) {
  if(newscene === null) return;
  if (src) currentScene = src;
  handleClick({
    to: newscene
  });
}

export function getScene() {
  return currentScene;
}

export function getSceneInfo(id) {
  return scenes[id];
}

export function getAllFlags() {
  return Object.keys($adventure_flags).reduce((obj, id) => {
    obj[id] = $global[id];
    return obj;
  },{});
}

export function addScenes(newScenes) {
  Object.keys(newScenes).forEach(function (name) {
    if (typeof newScenes[name].options === 'object') {
      newScenes[name].options = newScenes[name].options.map(function (option) {
        if(option === 'seperator') {
          return { is: 'seperator', uid: Math.round(Math.random() * 999999).toString() };
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
  if (name in $global) return $global[name];
  let value = initialValue;
  // deep copy the object, JSON.stringify->parse is the fastest, but does not work on Date.
  $adventure_flags[name] = deepcopy(initialValue);
  
  Object.defineProperty($global, name, {
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
  Object.keys($adventure_flags).forEach(name => {
    let value = $adventure_flags[name];
    // Deep copy again.
    $global[name] = deepcopy(value);
  });
}

function handleClick(option) {
  if (option.to === null) return;
  let newScene = scenes[option.to];

  if (typeof option.action === 'function') {
    option.action();
  }

  previousScene = currentScene;
  currentScene = option.to;

  if (newScene && typeof newScene.action === 'function') {
    newScene.action();
  }
  
  rerender();
}

export let Prompt = function Prompt() {
  let prompt = scenes[currentScene].prompt;
  if (typeof prompt === 'function') prompt = prompt();
  if (typeof prompt === 'string') prompt = <div><p>{prompt}</p></div>;
  if (React.isValidElement(prompt)) {
    if (prompt.type === 'div') {
      if(prompt.props.className) {
        prompt = React.cloneElement(prompt, { className: prompt.props.className + 'prompt' });
      } else {
        prompt = React.cloneElement(prompt, { className: 'prompt' });
      }
    } else {
      prompt = <div className="prompt">{prompt}</div>;
    }
  }
  return <Fragment>{prompt}</Fragment>;
};

export let Options = function Options() {
  let lastRenderedOption = null;
  let options = scenes[currentScene].options;
  if (typeof options === 'function') {
    options = options();
    options = options.map(function (option) {
      if (option === 'seperator') {
        return { is: 'seperator', uid: Math.round(Math.random() * 999999).toString() };
      }
      option.uid = Math.round(Math.random() * 999999).toString();
      return option;
    });
  }

  return <ul className="option-ul">
    {
      options.map(function (option, index) {
        if(option.is === 'seperator') {
          if(lastRenderedOption === 'seperator') return null;

          lastRenderedOption = 'seperator';
          return <li className="option-seperator" />;
        }

        let disabled = option.if && !option.if();
        if (disabled) {
          if (!option.disabledText) return null;
        }
        if (!disabled) {
          lastRenderedOption = null;
          let text = option.text;
          if (!React.isValidElement(text) && typeof text === 'function') text = text();
          if(text === undefined || text === null) return null;

          return <li
            className={'option-li option-li-enabled' + ((config.showBrokenLinks || debugPanelOpen) ? ((option.to in scenes) ? '' : ' option-li-broken-link') : '')} 
            key={option.uid}>
            <a
              href="#"
              className={'option option-enabled' + ((config.showBrokenLinks || debugPanelOpen) ? ((option.to in scenes) ? '' : ' option-broken-link') : '')}
              onClick={() => handleClick(option)}
            >
              {text}
            </a>
          </li>;
        } else {
          let text = (option.disabledText === true) ? option.text : option.disabledText;
          if (!React.isValidElement(text) && typeof text === 'function') text = text();
          if(text === undefined || text === null) return null;

          return <li className="option-li option-li-disabled" key={option.uid}><span className="option option-disabled">{text}</span></li>;
        }
      })
    }
  </ul>;
};

function toggleDebugPanel() {
  debugPanelOpen = !debugPanelOpen;
  rerender();
}
export let DebugPanel = function DebugPanel() {
  if ((config.debugPanel !== null) ? (!config.debugPanel) : (typeof $hideDebug === 'undefined' || $hideDebug)) return null;

  return <div style={{
    position: 'fixed',
    left: '0',
    bottom: '0',
    paddingTop: '1em',
    paddingBottom: '1em',
    background: '#111',
    width: '100%'
  }}>
    <div style={{
      width: '500px',
      margin: 'auto'
    }}>
      <button onClick={toggleDebugPanel}
        style={{
          background: 'cornflowerblue',
          border: 'none',
          color: 'black',
          fontWeight: 'bold',
          padding: '0.5em'
        }}
      >Toggle Debug Panel</button>
      
      {
        debugPanelOpen
          ? <div>
            <h4>Debug - web-text-adventure@{packagejson.version}</h4>
            <li>
              <a href="#" onClick={() => setScene('start', '<Debug Panel>')}>Go To Start</a>
            </li>
            <li>
              <input id="debug-scene-id" style={{ width: '100px' }} type="text" placeholder="scene id" />
              &nbsp;&nbsp;
              <select id="debug-scene-select" onChange={() => {
                document.getElementById('debug-scene-id').value = document.getElementById('debug-scene-select').value;
              }}>
                {Object.keys(scenes).map(x => <option key={x}>{x}</option>)}
              </select>
              &nbsp;&nbsp;
              <a href="#" onClick={() => setScene(document.getElementById('debug-scene-id').value, '<Debug Panel>')}>Go To Scene</a>
            </li>
            <li>
              <a href="#" onClick={resetFlags}>Reset all Flags</a>
            </li>
          </div>
          : null
      }
    </div>
  </div>;
};

function Render() {
  // validate the current screen
  if (!(currentScene in scenes)) {
    return error('Cannot find scene \''.concat(currentScene, '\'').concat(!previousScene ? '' : ', caused from scene \''.concat(previousScene, '\'')), true);
  }

  if (!scenes[currentScene].prompt) {
    return error('Scene \''.concat(currentScene, '\' is missing a prompt.'), true);
  }

  if (!React.isValidElement(scenes[currentScene].prompt) && typeof scenes[currentScene].prompt !== 'string' && typeof scenes[currentScene].prompt !== 'function') {
    return error('Scene \''.concat(currentScene, '\' has an invalid prompt type (').concat(typeof scenes[currentScene].prompt, ', expecting function or string)'), true);
  }

  if (!scenes[currentScene].options) {
    return error('Scene \''.concat(currentScene, '\' is missing an options array'), true);
  }

  let options = scenes[currentScene].options;
  if (typeof options === 'function') options = options();

  if (!Array.isArray(options)) {
    return error('Scene \''.concat(currentScene, '\' has an options value, but it is not an array or function.'), true);
  }
  
  for (let i = 0; i < options.length; i++) {
    let element = options[i];

    if (element.is === 'seperator') continue;

    if (typeof element.text !== 'string' && typeof element.text !== 'function') {
      return error('Scene \''.concat(currentScene, '\', options #').concat(i, ' does not contain a prompt (').concat(typeof element.text, ', expecting function or string)'), true);
    }

    if (typeof element.to !== 'string' && element.to !== null) {
      return error('Scene \''.concat(currentScene, '\', options #').concat(i, ' does not contain a valid \'to\' property'), true);
    }
  }

  if(typeof template !== 'function') {
    return error('Custom HTML is not passed as a function.', true);
  }

  try {
    return template(scenes[currentScene]);
  } catch (err) {
    return error(err, true);
  }
}
