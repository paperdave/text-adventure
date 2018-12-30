import { HTMLFactory } from "react";

export type Text = HTMLFactory<HTMLDivElement> | (() => HTMLFactory<HTMLDivElement>) | string | (() => string);

export type Scene = {
    prompt: Text;
    options: Option[];

    action?: () => any;
};

export type Option = {
    text: Text;
    to: string;

    disabledText: Text | true;

    if?: () => boolean;
    action?: () => any;
} | 'seperator';

export function setRootElement(root: HTMLElement): undefined;
export function setCustomHTML(jsx: (currentScene?: Scene) => HTMLFactory<HTMLDivElement>): undefined;
export function addScenes(scenes: {[id: string]: Scene}): undefined;
export function addFlag(name: string, initialValue: any): undefined;

export const Prompt: () => HTMLFactory<HTMLDivElement>;
export const Options: () => HTMLFactory<HTMLDivElement>;