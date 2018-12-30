import React from 'react';
import { Prompt, Options, setCustomHTML } from 'web-text-adventure';
import './style.css';

setCustomHTML(() => <div>
    <h1>Text Adventure</h1>
    <Prompt />
    <Options />
</div>);
