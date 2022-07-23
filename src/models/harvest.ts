export interface HarvestApiData {
    token: string;
    accountId: string;
}

export enum TimeEntryRequestStatus {
    None,
    Loading,
    Success,
    Error
}
export interface TimeEntry {
    minutes: number;
    project: TeamdeckProject;
    name:  string;
    date:  string;
    tag:  string;
    status: TimeEntryRequestStatus;
}

export enum TeamdeckProject {
    Skyfld = '250349',
    Vicodo = '250558',
}

export enum TeamdeckTag {
    Meeting = '150935',
    Programming = '150932',
    Estimations = '199589',
    Documentation = '192818',
    ProjectManagement = '150936',
    ProjectDocumentation = '150934',
    Testing = '150937',
    Research = '152260',
}

export enum HarvestTag {
    Testing = '13546990',
    Meeting = '13582722',
    Documentation = '13546991',
    Programming = '13538127',
    ProjectManagement = '13538129',
    ConceptArchitecture = '17818113',
    Design = '13538126',
}
