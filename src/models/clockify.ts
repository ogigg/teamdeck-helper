
export enum ClockifyProject {
    Moodup = '623256b24826f23d0c15a159',
    Piiink = '6232160427682e625afee5e5',
    Unicomm = '623256ab4826f23d0c15a125',
}

export interface ClockifyAPI {
    apiKey: string;
    workspace: Workspace;
}

export interface Workspace {
    id: string;
    name: string;
}
