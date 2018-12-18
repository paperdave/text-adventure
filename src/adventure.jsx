// a simple game engine.

let scenes = {};
let rootElement = "#root";
let hasStarted = false;

let rerender = () => {};

function error(message, isDataProblem ) {
    return [
        <h1 style={{ }}>Error</h1>,
        <p style={{ color: "red" }}>{message}</p>,
        <div style={{ opacity: "0.5"}}>
            {
                (isDataProblem ? <div>
                    This was caused by a problem in the adventure data.
                </div> : <div>
                                This was caused by the text adventure game engine, not the adventure data.
                </div>)
            }
        </div>
    ]
}

export function setRootElement(root) {
    rootElement = root;
}

export function addScenes(newScenes) {
    Object.keys(newScenes).forEach(name => {
        if (newScenes[name].options) {
            newScenes[name].options.forEach(option => {
                option.uid = Math.round(Math.random() * 999999).toString();
            })
        }
    });

    scenes = Object.assign(scenes, newScenes);

    if (!hasStarted && 'start' in newScenes) {
        hasStarted = true;
        ReactDOM.render(<Adventure />, document.querySelector(rootElement));
    }

    rerender();
}

export function addFlag(name, initialValue) {
    
    if(name in window) return;

    var value = initialValue;
    Object.defineProperty(window, name, {
        get: () => value,
        set: (y) => {
            value = y;
            rerender();
        }
    });
}

class Adventure extends React.Component {
    constructor() {
        super();
        rerender = this.rerender.bind(this);
    }

    state = {
        scene: 'start',
        previousScene: 'none',
        hotReloadValue: Math.random()
    }
    
    rerender() {

        this.setState({
            scene: this.state.scene,
            previousScene: this.state.previousScene,
            hotReloadValue: Math.random(),
        });
    }

    handleClick(option) {
        let newScene = scenes[option.to];

        if (typeof option.action === "function") {
            option.action();
        }

        if (newScene && typeof newScene.action === "function") {
            newScene.action();
        }

        this.setState({
            scene: option.to,
            previousScene: this.state.scene,
            hotReloadValue: this.state.hotReloadValue,
        });
    }

    render() {
        // validate the current screen
        if(!(this.state.scene in scenes)) {
            return error(`Cannot find scene '${this.state.scene}'${!this.state.previousScene ? "" : `, caused from scene '${this.state.previousScene}'`}`, true);
        }
        if (!scenes[this.state.scene].prompt) {
            return error(`Scene '${this.state.scene}' is missing a prompt.`, true);
        }
        if (typeof scenes[this.state.scene].prompt !== "string" && typeof scenes[this.state.scene].prompt !== "function") {
            return error(`Scene '${this.state.scene}' has an invalid prompt type (${typeof scenes[this.state.scene].prompt}, expecting function or string)`, true);
        }
        if (!scenes[this.state.scene].options) {
            return error(`Scene '${this.state.scene}' is missing an options array`, true);
        }
        if (!Array.isArray(scenes[this.state.scene].options)) {
            return error(`Scene '${this.state.scene}' has an options value, but it is not an array.`, true);
        }
        for (let i = 0; i < scenes[this.state.scene].options.length; i++) {
            let element = scenes[this.state.scene].options[i];
            if (typeof element.text !== "string" && typeof element.text !== "function") {
                return error(`Scene '${this.state.scene}', options #${i} does not contain a prompt (${typeof element.text}, expecting function or string)`, true)
            }
            if (typeof element.to !== "string") {
                return error(`Scene '${this.state.scene}', options #${i} does not contain a valid 'to' property`, true)
            }
        }

        try {
            let prompt = scenes[this.state.scene].prompt;
            if(typeof prompt === "function") prompt = prompt();

            return [
                <h1>Adventure</h1>,
                <div className="prompt">
                    { prompt }
                </div>,
                <ul className="options">
                    {
                        scenes[this.state.scene].options.map(option => {
                            if (option.if && !option.if()) return null;

                            let text = option.text;
                            if(typeof text === "function") text = text();
                            return <li key={option.uid}><a href="#" onClick={this.handleClick.bind(this,option)}>{text}</a></li>
                        })
                    }
                </ul>
            ];
        } catch (err) {
            return error(err, false);
        }
    }
}