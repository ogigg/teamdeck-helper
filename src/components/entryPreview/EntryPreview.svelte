<script lang="ts">
  import type { TimeEntry } from './../../models/harvest';
  import Card, { Content } from '@smui/card';
  import { teamdeckProjectIdToProjectName } from '../../helpers/harvest';

  export let entry: TimeEntry;

  const minutesToHHMM = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };
</script>

<Card padded>
  <div class="card-content">
    <span>{teamdeckProjectIdToProjectName(entry.project)}</span>
    <span>{entry.date}</span>
    <span>{entry.name}</span>
    <span>{minutesToHHMM(entry.minutes)}</span>
  </div>
</Card>
