export interface HarvestApiData {
    token: string;
    accountId: string;
}

export interface TimeEntry {
    minutes: number;
    project: TeamdeckProject;
    name:  string;
    date:  string;
    tag:  string;
}

export enum TeamdeckProject {
    Skyfld = '250349',
    Vicodo = '250558',
}