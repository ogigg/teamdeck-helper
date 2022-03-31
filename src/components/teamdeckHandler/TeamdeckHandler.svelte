<script lang="ts">
  import Button from '@smui/button';
  import { TEAMDECK_API } from '../../constants/api';
  import type { TimeEntry } from '../../models/harvest';
  import type { TeamdeckApiData } from '../../models/teamdeck';

  export let timeEntries: TimeEntry[] = null;

  let teamdeckApiData: TeamdeckApiData = JSON.parse(localStorage.getItem('teamdeckAPI'));

  const addToTeamdeck = () => {
    console.log(timeEntries);
    fetch(TEAMDECK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teamdeckApiData.accessToken}`
      },
      body: JSON.stringify({
        query: `mutation {
  createTimeEntry(
		timeEntry:{
      projectId: ${timeEntries[0].project},
      description: ${timeEntries[0].name},
      minutes: ${timeEntries[0].minutes},
      date: ${timeEntries[0].date},
      tagIds: [${timeEntries[0].tag}],
    }
  ){
    id, projectId
  }
}`,
        variables: {}
      })
    }).then(res => res.json());
  };
</script>

{#if timeEntries}
  <Button variant="raised" on:click={addToTeamdeck}>Dodaj do teamdecka!</Button>
{/if}
