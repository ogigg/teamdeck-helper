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
  import type { HarvestApiData } from './../models/harvest';

  let choices = ['Dziś', 'Wczoraj', 'Ostatnie 2 dni', 'Ostatni tydzień'];
  let selected = 'Dziś';
  export let harvestApiData: HarvestApiData;
  let request;
  let harvestDataFetched = false;
  let teamdeckScript = '';

  const fetchData = () => {
    harvestDataFetched = true;
    let from = new Date();
    let to = new Date();

    if (selected === choices[0]) {
      from = dayjs().startOf('day').toDate();
    }
    if (selected === choices[1]) {
      from = dayjs().subtract(2, 'day').startOf('day').toDate();
      to = dayjs().subtract(1, 'day').startOf('day').toDate();
    }
    if (selected === choices[2]) {
      from = dayjs().subtract(2, 'day').startOf('day').toDate();
    }
    if (selected === choices[3]) {
      from = dayjs().subtract(7, 'day').startOf('day').toDate();
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
      .then(res => {
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
  {#if harvestDataFetched}
    {#await request}
      <p>...Pobieram</p>
    {:then timeEntries}
      <p>Pobrano {timeEntries?.length} wpisów</p>
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
