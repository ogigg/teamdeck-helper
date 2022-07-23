<script lang="ts">
  import Button from '@smui/button';
  import { taskToTagId, projectNameToProjectId } from '../helpers/harvest';
  import { HarvestApiData, TimeEntry, TimeEntryRequestStatus } from './../models/harvest';
  import EntryPreview from './entryPreview/EntryPreview.svelte';
  import { fetchClockifyData } from '../helpers/clockify';
  import TeamdeckHandler from './teamdeckHandler/TeamdeckHandler.svelte';
  import { addToTeamdeck, selectedDates, timeEntries } from '../store';
  import TimeRangePicker from './TimeRangePicker.svelte';
  import { onDestroy } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  export let harvestApiData: HarvestApiData;
  let harvestRequest;
  let clockifyRequest;
  let harvestDataFetched = false;

  const storeDateSubscriber = selectedDates.subscribe(v => {
    harvestDataFetched = false;
  });

  const fetchData = () => {
    addToTeamdeck.update(() => false);
    harvestDataFetched = true;

    const params = new URLSearchParams({
      from: $selectedDates.from.toISOString(),
      to: $selectedDates.to.toISOString()
    });
    const paramsClockify = new URLSearchParams({
      start: $selectedDates.from.toISOString(),
      end: $selectedDates.to.toISOString()
    });

    // harvestRequest = fetchHarvestData(params, harvestApiData).then((res: TimeEntry[]) => {
    //   return res;
    // });

    // harvestRequest = fetchClockifyData(paramsClockify).then((res: TimeEntry[]) => {
    //   console.log(res);
    //   return res;
    // });

    harvestRequest = fetch('https://api.harvestapp.com/api/v2/time_entries?' + params, {
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
          tag: taskToTagId(entry.task.id),
          status: TimeEntryRequestStatus.None,
          id: uuidv4()
        }))
      )
      .then((entries: TimeEntry[]) => {
        timeEntries.set(entries);
        return entries;
      });
  };

  onDestroy(storeDateSubscriber);
</script>

<div class="section-wrapper">
  <h3>Harvest</h3>
  <TimeRangePicker />
  {#if harvestDataFetched}
    {#await harvestRequest}
      <p>...Pobieram</p>
    {:then}
      <p>Pobrano {$timeEntries?.length} wpisów</p>
      {#each $timeEntries as timeEntry}
        <EntryPreview entry={timeEntry} />
      {/each}
      <TeamdeckHandler />
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
