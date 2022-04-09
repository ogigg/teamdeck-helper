<script lang="ts">
  import Button from '@smui/button';
  import { TEAMDECK_API } from '../../constants/api';
  import { addTimeEntryToTeamdeck } from '../../helpers/teamdeck';
  import type { TimeEntry } from '../../models/harvest';
  import type { TeamdeckApiData } from '../../models/teamdeck';
  import { addToTeamdeck } from '../../store';

  export let timeEntries: TimeEntry[] = null;

  let teamdeckApiData: TeamdeckApiData = JSON.parse(localStorage.getItem('teamdeckAPI'));

  const submit = () => {
    addToTeamdeck.update(() => true);
  };
</script>

{#if timeEntries}
  <Button variant="raised" on:click={submit}>Dodaj do teamdecka!</Button>
{/if}
