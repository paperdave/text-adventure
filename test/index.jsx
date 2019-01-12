import * as Adventure from '../src/adventure.jsx';
import { Options, Prompt, DebugPanel } from '../src/adventure.jsx';
import './../template/src/style.css';

Adventure.setConfig('showBrokenLinks', true);
Adventure.setConfig('debugPanel', true);

window.$Adventure = Adventure;

Adventure.setCustomHTML(() => <div>
  <h1>Text Adventure</h1>
  <Prompt />  
  <Options />

  <DebugPanel />
</div>);

Adventure.addFlag('thing', 2);

Adventure.addScenes({
  start: {
    prompt: 'testing room, where do you go?',
    options: () => [
      {
        text: 'Tesing IFs and Disabled States',
        to: 'disabled_tests'
      },
      { text: 'broken link', to: 'nowhere'}
    ]
  },
  disabled_tests: {
    prompt: <div>
      <p>
                Tesing IFs and Disabled States
      </p>
      <p>
                There are four test options here, #2 should not be visible and #4 and #5 should be disabled.
      </p>
    </div>,
    options: [
      { text: 'escape', to: 'start'},
      'seperator',
      'seperator',
      'seperator',
      'seperator',
      'seperator',
      'seperator',
      'seperator',
      'seperator',
      { text: '#1 this should appear', to: 'start'},
      { text: '#2 this should not appear', to: 'start', if: () => false},
      { text: '#3 this should appear', to: 'start', if: () => true},
      { text: '#4 this should not appear', disabledText: '#4 this should appear disabled', to: 'start', if: () => false},
      { text: '#5 this should appear disabled', disabledText: true, to: 'start', if: () => false},
    ],
  }
});
