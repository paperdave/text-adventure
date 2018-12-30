import * as Adventure from '../src/adventure.jsx';
import './style.css';

Adventure.addScenes({
    start: {
        prompt: "testing room, where do you go?",
        options: [
            {
                text: "Tesing IFs and Disabled States",
                to: "disabled_tests"
            }
        ]
    },
    disabled_tests: {
        prompt: <div>
            <p>
                Tesing IFs and Disabled States
            </p>
            <p>
                There are four test options here, #2 should not be visible and #4 should be disabled.
            </p>
        </div>,
        options: [
            { text: "escape", to: "start"},
            "seperator",
            { text: "#1 this should appear", to: "start"},
            { text: "#2 this should not appear", to: "start", if: () => false},
            { text: "#3 this should appear", to: "start", if: () => true},
            { text: "#4 this should not appear", disabledText: "#4 this should appear disabled", to: "start", if: () => false},
        ],
    }
});
