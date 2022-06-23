<script lang="ts">
  import Button from '@smui/button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import { Label } from '@smui/common';
  import { fetchHarvestData } from '../helpers/harvest';
  import dayjs from 'dayjs';
  import type { HarvestApiData, TimeEntry } from './../models/harvest';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import EntryPreview from './entryPreview/EntryPreview.svelte';
  import { fetchClockifyData } from '../helpers/clockify';
  import TeamdeckHandler from './teamdeckHandler/TeamdeckHandler.svelte';
  import { addToTeamdeck } from '../store';

  let choices = ['Dzisiaj', 'Wczoraj', 'Ostatnie 2 dni', 'Ostatni tydzień', 'Własny zakres'];
  let selected = 'Dzisiaj';
  export let harvestApiData: HarvestApiData;
  let harvestRequest;
  let clockifyRequest;
  let harvestDataFetched = false;
  let showDatePicker = false;

  let value, formattedValue;
  let selectedDates = [];

  const options = {
    enableTime: false,
    mode: 'range',

    onChange(selectedDateRange, dateStr) {
      selectedDates = selectedDateRange;
    }
  };

  function handleChange(event) {
    const [selectedDates, dateStr] = event.detail;
    console.log({ selectedDates, dateStr });
  }

  $: {
    if (selected === 'Własny zakres') {
      showDatePicker = true;
    } else {
      showDatePicker = false;
    }
    harvestDataFetched = false;
  }

  const fetchData = () => {
    addToTeamdeck.update(() => false);
    harvestDataFetched = true;
    let from = new Date();
    let to = new Date();

    if (selected === choices[0]) {
      from = dayjs().startOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
    }
    if (selected === choices[1]) {
      from = dayjs().subtract(1, 'day').startOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
      to = dayjs().subtract(1, 'day').endOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
    }
    if (selected === choices[2]) {
      from = dayjs().subtract(2, 'day').startOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
    }
    if (selected === choices[3]) {
      from = dayjs().subtract(7, 'day').startOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
    }
    if (selected === choices[4]) {
      from = dayjs(selectedDates[0]).startOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
      to = dayjs(selectedDates[1]).endOf('day').add(dayjs().utcOffset(), 'minutes').toDate();
    }

    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString()
    });
    const paramsClockify = new URLSearchParams({
      start: from.toISOString(),
      end: to.toISOString()
    });

    harvestRequest = fetchHarvestData(params, harvestApiData).then((res: TimeEntry[]) => {
      return res;
    });

    harvestRequest = fetchClockifyData(paramsClockify).then((res: TimeEntry[]) => {
      console.log(res);
      return res;
    });
  };
</script>

<div class="section-wrapper">
  <h3>Harvest</h3>
  <SegmentedButton segments={choices} let:segment singleSelect bind:selected>
    <Segment {segment}>
      <Label>{segment}</Label>
    </Segment>
  </SegmentedButton>
  {#if showDatePicker}
    <span>Wybierz przedział:</span>
    <Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />
  {/if}
  {#if harvestDataFetched}
    {#await harvestRequest}
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
