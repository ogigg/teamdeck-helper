import { TeamdeckProject, TimeEntry } from "../models/harvest";

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
  
  export const taskToTagId = (entryType) => {
    /*
          todo dodać tagi
          150932 - programming tag
          150935 - meeting
          199589 - estimations
          192818 - documentation
      */
  
    let tag = "150932";
    switch (entryType) {
      case 13582722: // meeting (wg harvesta)
        tag = "150935"; // meeting - teamdeck
      default:
        tag = "150932"; // programming - teamdeck
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