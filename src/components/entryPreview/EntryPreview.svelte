<script lang="ts">
  import type { TimeEntry } from './../../models/harvest';
  import Card from '@smui/card';
  import { teamdeckProjectIdToProjectName } from '../../helpers/harvest';
  import { addToTeamdeck } from '../../store';
  import CircularProgress from '@smui/circular-progress';
  import { addTimeEntryToTeamdeck } from '../../helpers/teamdeck';
  import CheckCircle from 'svelte-material-icons/CheckCircle.svelte';
  import CloseCircle from 'svelte-material-icons/CloseCircle.svelte';

  export let entry: TimeEntry;

  let spinner,
    success,
    error = false;

  addToTeamdeck.subscribe(async shouldAddToTeamdeck => {
    if (shouldAddToTeamdeck) {
      spinner = true;
      const res = await addTimeEntryToTeamdeck(entry);
      spinner = false;
      success = res.success;
      error = res.error;
    }
  });

  const minutesToHHMM = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };
</script>

<Card padded>
  <div class="card-content">
    <div class="time-entry">
      <span>{teamdeckProjectIdToProjectName(entry.project)}</span>
      <span>{entry.date}</span>
      <span>{entry.name}</span>
      <span>{minutesToHHMM(entry.minutes)}</span>
    </div>
    <div class="status">
      {#if spinner}
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      {/if}
      {#if success}
        <CheckCircle color="#339933" size="32px" />
      {/if}
      {#if error}
        <CloseCircle color="#cc0000" size="32px" />
      {/if}
    </div>
  </div>
</Card>

<style lang="scss">
  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .status {
      min-width: 40px;
    }
  }
</style>
