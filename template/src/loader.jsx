// This file handles hot-reloading and starting up 
// the game, you probably do not need to edit it.

import * as Adventure from 'web-text-adventure';
import './custom-html.jsx';

// Scene Files
const sceneCtx = require.context('../scenes/', true, /\.jsx$/);
sceneCtx.keys().forEach(file => {
    sceneCtx(file);
});

// Custom HTML

// Hot Reloading
if (module.hot) {
    module.hot.accept("./custom-html.jsx", () => {});
    module.hot.accept(sceneCtx.id, () => {
        const sceneCtx = require.context('../scenes/', true, /\.jsx$/);
        sceneCtx.keys().forEach(file => {
            sceneCtx(file);
        });
    });
}
