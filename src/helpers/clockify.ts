import { ClockifyProject } from "../models/clockify";
import { TeamdeckProject, TeamdeckTag } from "../models/harvest";

const WORKSPACE = "623215e7dd0ec81cc3c77e9a";
const USER_ID = "611670145d7e6a46eb7c84a3";

export const fetchClockifyData = (params) => fetch(
    `https://api.clockify.me/api/v1/workspaces/${WORKSPACE}/user/${USER_ID}/time-entries?${params}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "MDNkODlkZDktODgwMS00NzE5LThlZGQtMjllOGQ1OGViMTZk",
      },
    }
  )
    .then((res) => res.json())
    .then((res) =>
      res.map((entry) => ({
        minutes: Math.round(
          (new Date(entry.timeInterval.end).getTime() -
            new Date(entry.timeInterval.start).getTime()) /
            60000
        ),
        project: projectNameToProjectId(entry.projectId),
        name: entry.description,
        date: entry.timeInterval.start,
        tag: TeamdeckTag.Programming,
      }))
    )


    export const projectNameToProjectId = (projectName) => {
        if (projectName === ClockifyProject.Piiink) {
            return TeamdeckProject.Piiink;
          }
          if (projectName === ClockifyProject.Moodup) {
            return TeamdeckProject.Moodup;
          }
          if (projectName === ClockifyProject.Unicomm) {
            return TeamdeckProject.Unicomm;
          }
          return "";
        };