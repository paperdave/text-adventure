import data from './data.jsx';
import * as Adventure from './adventure.jsx';

Adventure.addScenes(data);

if(module.hot) module.hot.accept("./data.jsx", () => {
    Adventure.addScenes(data);
});