import { HTMLFactory } from "react";

type Text = HTMLFactory<HTMLDivElement> | string;

interface Scene {
    prompt: Text;
    options: Option[];

    if?: () => boolean;
    action?: () => any;
}

interface Option {
    text: Text;
    to: string;

    disabledText: Text;

    if?: () => boolean;
    action?: () => any;
}

export function setRootElement(root: HTMLElement): undefined;
export function setCustomHTML(jsx: (currentScene?: Scene) => HTMLFactory<HTMLDivElement>): undefined;
export function addScenes(scenes: {[id: string]: Scene}): undefined;
export function addFlag(name: string, initialValue: any): undefined;

export const Prompt: () => HTMLFactory<HTMLDivElement>;
export const Options: () => HTMLFactory<HTMLDivElement>;