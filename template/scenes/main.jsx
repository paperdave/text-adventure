import React from 'react';
import { addFlag, addScenes } from 'web-text-adventure';

addFlag("counter", 5);

addScenes({
    start: {
        // this can also not be a function, but since it has dynamic content,
        // it must be a function.
        prompt: () => <div>
            Hello World. Count: {counter}.
        </div>,
        
        options: [
            {
                text: "Increase Count",
                to: "start",
                action: () => counter++
            },
            {
                text: "Decrease Count",
                textDisabled: true, // this can also be a string
                to: "start",
                action: () => counter--,
                if: () => counter > 0
            },
        ]
    }
});