<script lang="ts">
  import Button from '@smui/button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import { Label } from '@smui/common';
  import { taskToTagId, projectNameToProjectId } from '../helpers/harvest';
  import dayjs from 'dayjs';
  import type { HarvestApiData, TimeEntry } from './../models/harvest';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import EntryPreview from './entryPreview/EntryPreview.svelte';
  import TeamdeckHandler from './teamdeckHandler/TeamdeckHandler.svelte';
  import { addToTeamdeck, selectedDates } from '../store';
  import TimeRangePicker from './TimeRangePicker.svelte';

  export let harvestApiData: HarvestApiData;
  let request;
  let harvestDataFetched = false;

  selectedDates.subscribe(e => {
    console.log(e);
  });
  const fetchData = () => {
    addToTeamdeck.update(() => false);
    harvestDataFetched = true;
    let from = new Date();
    let to = new Date();

    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString()
    });

    request = fetch('https://api.harvestapp.com/api/v2/time_entries?' + params, {
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
      .then((res: TimeEntry[]) => {
        return res;
      });
  };
</script>

<div class="section-wrapper">
  <h3>Harvest</h3>
  <TimeRangePicker />
  {#if harvestDataFetched}
    {#await request}
      <p>...Pobieram</p>
    {:then timeEntries}
      <p>Pobrano {timeEntries?.length} wpisów</p>
      {#each timeEntries as timeEntry}
        <EntryPreview entry={timeEntry} />
      {/each}
      <TeamdeckHandler {timeEntries} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}

  <Button variant="raised" on:click={fetchData}>Pobierz dane</Button>
</div>

<style lang="scss">
  .section-wrapper {
    -webkit-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .textarea-wrapper {
    display: flex;
    align-items: center;
    justify-content: stretch;
  }
</style>
