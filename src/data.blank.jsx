// blank starter file
import { addFlag } from './adventure.jsx';

addFlag("some_variable", false);

export default {
    start: {
        prompt: "Hello World",
        options: [
            { text: "Do Nothing", to: "start" }
        ]
    }
}