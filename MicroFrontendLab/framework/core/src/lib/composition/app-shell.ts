export interface ShellContext {
  basePath: string;
  lang: "fa-IR" | "en-US";
}

export interface MicroFrontendFragment {}

export interface MicroFrontendApp {}

export class MicroFrontendShell {
  initialize() {}
}

// window.appShell = window.appShell ?? {};
