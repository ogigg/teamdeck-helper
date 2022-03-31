<script lang="ts">
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import { Label } from '@smui/common';
  import {
    taskToTagId,
    projectNameToProjectId,
    generateTeamdeckScriptFromHarvest
  } from '../helpers/harvest';
  import dayjs from 'dayjs';
  import IconButton from '@smui/icon-button';
  import type { HarvestApiData, TimeEntry } from './../models/harvest';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import EntryPreview from './entryPreview/EntryPreview.svelte';
  import TeamdeckHandler from './teamdeckHandler/TeamdeckHandler.svelte';

  let choices = ['Dzisiaj', 'Wczoraj', 'Ostatnie 2 dni', 'Ostatni tydzień', 'Własny zakres'];
  let selected = 'Dzisiaj';
  export let harvestApiData: HarvestApiData;
  let request;
  let harvestDataFetched = false;
  let teamdeckScript = '';
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
    teamdeckScript = '';
    harvestDataFetched = false;
  }

  const fetchData = () => {
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
        teamdeckScript = generateTeamdeckScriptFromHarvest(res);
        return res;
      });
  };

  const copyToClipboard = () => {
    console.log('kopiuj');
    navigator.clipboard.writeText(teamdeckScript);
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
    {#await request}
      <p>...Pobieram</p>
    {:then timeEntries}
      <p>Pobrano {timeEntries?.length} wpisów</p>
      {#each timeEntries as timeEntry}
        <EntryPreview entry={timeEntry} />
      {/each}
      <div class="textarea-wrapper">
        <Textfield
          style="width: 100%;"
          textarea
          variant="outlined"
          bind:value={teamdeckScript}
          label="Skrypt do teamdecka"
        />
        <IconButton class="material-icons" aria-label="Copy content" on:click={copyToClipboard}
          >content_copy</IconButton
        >
      </div>
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
