export enum TimeRange {
    Today = 'Dzisiaj',
    Yesterday = 'Wczoraj',
    Last2Days = 'Ostatnie 2 dni',
    LastWeek = 'Ostatni tydzień',
    Custom = 'Własny zakres'
}

export const AVAILABLE_TIME_RANGES: TimeRange[] = [
    TimeRange.Today,
    TimeRange.Yesterday,
    TimeRange.Last2Days,
    TimeRange.LastWeek,
    TimeRange.Custom
];