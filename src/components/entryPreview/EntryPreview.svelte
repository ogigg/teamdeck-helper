<script lang="ts">
  import { TimeEntry, TimeEntryRequestStatus } from './../../models/harvest';
  import Card from '@smui/card';
  import { teamdeckProjectIdToProjectName } from '../../helpers/harvest';
  import CircularProgress from '@smui/circular-progress';
  import CheckCircle from 'svelte-material-icons/CheckCircle.svelte';
  import CloseCircle from 'svelte-material-icons/CloseCircle.svelte';

  export let entry: TimeEntry;

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
      {#if entry.status === TimeEntryRequestStatus.Loading}
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      {/if}
      {#if entry.status === TimeEntryRequestStatus.Success}
        <CheckCircle color="#339933" size="32px" />
      {/if}
      {#if entry.status === TimeEntryRequestStatus.Error}
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
