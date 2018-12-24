import React from 'react';
import { addFlag } from 'web-text-adventure';

addFlag("counter", 0);

export default {
    start: {
        prompt: () => <div>
            Hello World.
            
            {(() => {
                if(counter > 0) {
                    return " Counter: " + counter;
                } else {
                    return null;
                }
            })()}
        </div>,
        options: [
            { text: "Increase Count", to: "start", action: () => counter++ }
        ]
    }
}