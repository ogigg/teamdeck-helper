<script lang="ts">
  import Button from '@smui/button';
  import { fetchHarvestData } from '../helpers/harvest';
  import EntryPreview from './entryPreview/EntryPreview.svelte';
  import { fetchClockifyData } from '../helpers/clockify';
  import TeamdeckHandler from './teamdeckHandler/TeamdeckHandler.svelte';
  import { availableProviders, selectedDates, timeEntries } from '../store';
  import TimeRangePicker from './TimeRangePicker.svelte';
  import { onDestroy } from 'svelte';

  let requests;
  let harvestDataFetched = false;

  const storeDateSubscriber = selectedDates.subscribe(v => {
    harvestDataFetched = false;
  });

  const fetchData = () => {
    timeEntries.set([]);
    harvestDataFetched = true;

    const params = new URLSearchParams({
      from: $selectedDates.from.toISOString(),
      to: $selectedDates.to.toISOString()
    });
    const paramsClockify = new URLSearchParams({
      start: $selectedDates.from.toISOString(),
      end: $selectedDates.to.toISOString()
    });

    const reqArray = [];
    if ($availableProviders.harvest) {
      reqArray.push(fetchHarvestData(params));
    }
    if ($availableProviders.clockify) {
      reqArray.push(fetchClockifyData(paramsClockify));
    }

    requests = Promise.all(reqArray);
  };

  onDestroy(storeDateSubscriber);
</script>

<div class="section-wrapper">
  <h3>Harvest</h3>
  <TimeRangePicker />
  {#if harvestDataFetched}
    {#await requests}
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
