import * as Adventure from '../src/adventure.jsx';
import './style.css';

Adventure.addScenes({
    start: {
        prompt: "Hello World",
        options: [
            {text: "hello", to: "woah"}
        ]
    }
});
