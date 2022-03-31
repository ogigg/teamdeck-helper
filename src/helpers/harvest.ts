import { HarvestTag, TeamdeckProject, TeamdeckTag, TimeEntry } from "../models/harvest";

export const projectNameToProjectId = (projectName) => {
    if (projectName.toLowerCase().includes("vicodo")) {
      return TeamdeckProject.Vicodo;
    }
    if (projectName.toLowerCase().includes("skyfld")) {
      return TeamdeckProject.Skyfld;
    }
    return "";
  };

export const teamdeckProjectIdToProjectName = (projectId: TeamdeckProject) => {
  switch (projectId) {
    case TeamdeckProject.Skyfld:
      return 'Skyfld'
    case TeamdeckProject.Vicodo:
      return 'Vicodo'
    default:
      return projectId;
  }
  };
  
  export const taskToTagId = (entryType: HarvestTag): TeamdeckTag => {
    let tag = TeamdeckTag.Programming;
    switch (entryType) {
      case HarvestTag.Meeting:
        tag = TeamdeckTag.Meeting;
      case HarvestTag.Programming:
        tag = TeamdeckTag.Programming;
      case HarvestTag.Testing:
        tag = TeamdeckTag.Testing;
      case HarvestTag.ConceptArchitecture:
        tag = TeamdeckTag.Research;
      case HarvestTag.Design:
        tag = TeamdeckTag.Research;
      case HarvestTag.Documentation:
        tag = TeamdeckTag.ProjectDocumentation;
      case HarvestTag.ProjectManagement:
        tag = TeamdeckTag.ProjectManagement;
      default:
        tag = TeamdeckTag.Programming;
    }
    return tag;
  };

  export const generateTeamdeckScriptFromHarvest = (res: TimeEntry[]): string => {
      return `
      const res = ${JSON.stringify(res)};
      res.map(entry => {
          fetch("https://app.teamdeck.io/api/walls/23765/time-entries", {
          "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en,de;q=0.9,pl;q=0.8,en-US;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
          },
          "referrer": "https://app.teamdeck.io/organizations/23765/calendar",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify( 
          {
              "minutes": entry.minutes,
              "description": entry.name.replace(/"/g, '\\"'),
              "project_id": [
                  entry.project
              ],
              "resource_id": [
                  278072
              ],
              "intervals": [
                  {
                      "start_date": entry.date,
                      "end_date": entry.date
                  }
              ],
              "weekend_booking": true,
              "holidays_booking": true,
              "vacations_booking": true,
              "tags": [{id: entry.tag, dataType: "tag"}]
          }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
          });
      })
      `
  }

export const fetchHarvestData = (params, harvestApiData) => fetch('https://api.harvestapp.com/api/v2/time_entries?' + params, {
  headers: {
    Authorization: `Bearer ${harvestApiData.token}`,
    'Harvest-Account-Id': harvestApiData.accountId,
    'User-Agent': 'Harvest API Example'
  }
})
  .then(res => res.json())
  .then(res =>
    res.time_entries.map(entry => ({
      minutes: Math.round(entry.hours * 60),
      project: projectNameToProjectId(entry.project.name),
      name: entry.notes,
      date: entry.spent_date,
      tag: taskToTagId(entry.task.id)
    }))
  )