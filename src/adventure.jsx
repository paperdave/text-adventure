// due to me being stupid, the package got published to npm, but the source .jsx never got pushed to github
// that file is now lost, and all i have is this JS file from babel

exports.setRootElement = setRootElement;
exports.setCustomHTML = setCustomHTML;
exports.addScenes = addScenes;
exports.addFlag = addFlag;
exports.Options = exports.Prompt = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// a simple game engine.
var scenes = {};
var rootElement = "#root";
var hasStarted = false;
var currentScene = "start";
var previousScene = null;

function rerender() {
  if (hasStarted) _reactDom.default.render(_react.default.createElement(Render, null), document.querySelector(rootElement));
}

function error(message, isDataProblem) {
  return [_react.default.createElement("h1", null, "Error"), _react.default.createElement("p", {
    style: {
      color: "red"
    }
  }, message)];
}

var template = function template() {
  return _react.default.createElement("div", null, _react.default.createElement("br", null), _react.default.createElement(Prompt, null), _react.default.createElement(Options, null));
};

function setRootElement(root) {
  rootElement = root;
}

function setCustomHTML(jsx) {
  template = jsx;
  rerender();
}

function addScenes(newScenes) {
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

function addFlag(name, initialValue) {
  if (name in window) return;
  var value = initialValue;
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
  var newScene = scenes[option.to];

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

var Prompt = function Prompt() {
  var prompt = scenes[currentScene].prompt;
  if (typeof prompt === "function") prompt = prompt();
  return _react.default.createElement("div", null, prompt);
};

exports.Prompt = Prompt;

var Options = function Options() {
  return _react.default.createElement("ul", null, scenes[currentScene].options.map(function (option) {
    if (option.if && !option.if()) return null;
    var text = option.text;
    if (typeof text === "function") text = text();
    return _react.default.createElement("li", {
      key: option.uid
    }, _react.default.createElement("a", {
      href: "#",
      onClick: function onClick() {
        return handleClick(option);
      }
    }, text));
  }));
};

exports.Options = Options;

function Render() {
  // validate the current screen
  if (!(currentScene in scenes)) {
    return error("Cannot find scene '".concat(currentScene, "'").concat(!previousScene ? "" : ", caused from scene '".concat(previousScene, "'")), true);
  }

  if (!scenes[currentScene].prompt) {
    return error("Scene '".concat(currentScene, "' is missing a prompt."), true);
  }

  if (typeof scenes[currentScene].prompt !== "string" && typeof scenes[currentScene].prompt !== "function") {
    return error("Scene '".concat(currentScene, "' has an invalid prompt type (").concat(_typeof(scenes[currentScene].prompt), ", expecting function or string)"), true);
  }

  if (!scenes[currentScene].options) {
    return error("Scene '".concat(currentScene, "' is missing an options array"), true);
  }

  if (!Array.isArray(scenes[currentScene].options)) {
    return error("Scene '".concat(currentScene, "' has an options value, but it is not an array."), true);
  }

  for (var i = 0; i < scenes[currentScene].options.length; i++) {
    var element = scenes[currentScene].options[i];

    if (typeof element.text !== "string" && typeof element.text !== "function") {
      return error("Scene '".concat(currentScene, "', options #").concat(i, " does not contain a prompt (").concat(_typeof(element.text), ", expecting function or string)"), true);
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
