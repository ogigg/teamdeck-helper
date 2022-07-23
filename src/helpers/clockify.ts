import dayjs from "dayjs";
import { CLOCKIFY_API } from "../constants/api";
import { ClockifyAPI, ClockifyProject, Workspace } from "../models/clockify";
import { TeamdeckProject, TeamdeckTag, TimeEntry, TimeEntryRequestStatus } from "../models/harvest";
import { v4 as uuidv4 } from 'uuid';
import { timeEntries } from "../store";

const WORKSPACE = "623215e7dd0ec81cc3c77e9a";
const USER_ID = "611670145d7e6a46eb7c84a3";

export const fetchClockifyData = (params) => {
  const clockifyAPI: ClockifyAPI = JSON.parse(localStorage.getItem('clockifyAPI'));
  return fetch(
    `${CLOCKIFY_API}workspaces/${WORKSPACE}/user/${USER_ID}/time-entries?${params}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": clockifyAPI.apiKey,
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
        date: dayjs(entry.timeInterval.start).format('YYYY-MM-DD'),
        tag: TeamdeckTag.Programming,
        status: TimeEntryRequestStatus.None,
        id: uuidv4()
      }))
    ).then((entries: TimeEntry[]) => {
      timeEntries.update(storeEntries => [...storeEntries, ...entries]);
      return entries;
    });}


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

export const getWorkspaces = (): Promise<Workspace[]>=> {
  const clockifyAPI: ClockifyAPI = JSON.parse(localStorage.getItem('clockifyAPI'));
  return fetch(`${CLOCKIFY_API}workspaces`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": clockifyAPI.apiKey,
    },
  }).then(res => res.json())
}

export const getProjects = (workspaceId): Promise<Workspace[]>=> {
  const clockifyAPI: ClockifyAPI = JSON.parse(localStorage.getItem('clockifyAPI'));
  return fetch(`${CLOCKIFY_API}workspaces/${workspaceId}/projects`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key":  clockifyAPI.apiKey,
    },
  }).then(res => res.json())
}