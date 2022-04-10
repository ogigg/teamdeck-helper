import { TEAMDECK_API } from "../constants/api";
import type { TimeEntry } from "../models/harvest";
import type { TeamdeckApiData } from "../models/teamdeck";

export const  addTimeEntryToTeamdeck = async (timeEntry: TimeEntry) => {
    const teamdeckApiData: TeamdeckApiData = JSON.parse(localStorage.getItem('teamdeckAPI'));
    const body = JSON.stringify({
      query: `mutation {
                createTimeEntry(
                    timeEntry:{
                        projectId: ${timeEntry.project},
                        description: "${timeEntry.name.replace(/"/g, '\\"')}",
                        minutes: ${timeEntry.minutes},
                        date: "${timeEntry.date}",
                        tagIds: [${timeEntry.tag}],
                    }
                ){
                    id, projectId
                }
            }`,
      variables: {}
    });
    const res = await fetch(TEAMDECK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teamdeckApiData.accessToken}`
      },
      body
    }).then(res => res.json());
    if (res?.data?.createTimeEntry?.id) {
        return { success: true, error: false };
    }
    return { success: false, error: true };
}