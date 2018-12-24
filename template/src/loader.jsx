// This file handles hot-reloading and starting up 
// the game, you probably do not need to edit it.

import * as Adventure from 'web-text-adventure';
import customHTML from './custom-html.jsx';

// Scene Files
const sceneCtx = require.context('../scenes/', true, /\.jsx$/);
sceneCtx.keys().forEach(file => {
    Adventure.addScenes(sceneCtx(file).default);
});

// Custom HTML
Adventure.setCustomHTML(customHTML);

// Hot Reloading
if (module.hot) {
    module.hot.accept("./custom-html.jsx", () => {
        Adventure.setCustomHTML(customHTML);
    });
    module.hot.accept(sceneCtx.id, () => {
        const sceneCtx = require.context('../scenes/', true, /\.jsx$/);
        sceneCtx.keys().forEach(file => {
            Adventure.addScenes(sceneCtx(file).default);
        });
    });
}
