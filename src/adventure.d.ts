import { HTMLFactory } from "react";

/** Displayable Text */
export type Text = HTMLFactory<HTMLDivElement> | (() => HTMLFactory<HTMLDivElement>) | string | (() => string);

/** The state of the game, show a prompt and a list of options */
export interface Scene {
    /** The prompt this scene shows */
    prompt: Text;
    /** The list of options you have */
    options: Option[] | (() => Option[]);

    /** Handler for when this scene is activated, if returned it will be activated multiple times */
    action?: () => any;
}
export interface SceneWithID extends Scene {
    /** Unique Identifier */
    id: string;
}

/** A single item in a list of options */
export type Option = {
    /** What will be displayed here */
    text: Text;
    /** Target scene if clicked on */
    to: string;
    
    /** Text to show when `if` returns false, or `true` to copy `text` */
    disabledText: Text | true | (() => null);

    /** If this returns false, the option will be hidden or the disabled text will be shown, you won't be able to click on it. */
    if?: () => boolean;
    /** When clicking, this handler will be ran */
    action?: () => any;
} | 'seperator';

interface Config {
    collapseSeperators: boolean,
    debugPanel: boolean | null,
    showBrokenLinks: boolean
}

/** Sets an config value, change engine behavior */
export function setConfig<T extends keyof Config>(name: T, value: Config[T]): undefined;
/** Gets an config value */
export function getConfig<T extends keyof Config>(name: T): Config[T];

/** Sets the root element, defaults to `document.querySelector('#root')` */
export function setRootElement(root: HTMLElement): undefined;
/** Sets the Custom HTML Renderer, See `Prompt`, `Options`, and `DebugPanel` */
export function setCustomHTML(jsx: (currentScene?: Scene) => HTMLFactory<HTMLDivElement>): undefined;
/** Updates the scene list with more scenes, if a scene already exists it will be replaced */
export function addScenes(scenes: {[id: string]: Scene}): undefined;
/** Adds a global variable, and sets an initial value */
export function addFlag<T>(name: string, initialValue: T): T;

/** Resets all flags set with `addFlag` to their initial value */
export function resetFlags();
/** Sets the current scene. */
export function setScene(newscene: string, src?: string);

/** Returns a object mapping all registered flags to their current value */
export function getAllFlags(): {[id: string]: any}
/** Gets all the scenes */
export function getAllScenes(): {[id: string]: Scene};
/** Get all of a scene's information from it's id */
export function getSceneInfo(id: string): Scene;
/** Get the current Scene's ID */
export function getScene(): string;

/** Contains the prompt of the current scene. Used with setCustomHTML */
export const Prompt: () => HTMLFactory<HTMLDivElement>;
/** Contains the options list of the current scene. Used with setCustomHTML */
export const Options: () => HTMLFactory<HTMLDivElement>;
/** Contains the Debug Panel (optional). Used with setCustomHTML */
export const DebugPanel: () => HTMLFactory<HTMLDivElement>;
