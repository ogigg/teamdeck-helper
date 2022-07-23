<script lang="ts">
  import SegmentedButton, { Label, Segment } from '@smui/segmented-button';
  import Flatpickr from 'svelte-flatpickr';
  import { AVAILABLE_TIME_RANGES, TimeRange } from '../models/timeRange';
  import { selectedDates } from '../store';
  import dayjs from 'dayjs';
  let selected = 'Dzisiaj';
  let showDatePicker = false;

  let value, formattedValue;

  const options = {
    enableTime: false,
    mode: 'range'
  };

  function handleChange(event) {
    const [[from, to]] = event.detail;
    if (from && to) {
      selectedDates.update(() => ({
        from,
        to
      }));
    }
  }

  $: {
    if (selected === TimeRange.Custom) {
      showDatePicker = true;
    } else {
      showDatePicker = false;
    }
    let newDateRange;
    switch (selected) {
      case TimeRange.Today:
        newDateRange = {
          from: dayjs().startOf('day').add(dayjs().utcOffset(), 'minutes').toDate(),
          to: new Date()
        };
        break;
      case TimeRange.Yesterday:
        newDateRange = {
          from: dayjs()
            .subtract(1, 'day')
            .startOf('day')
            .add(dayjs().utcOffset(), 'minutes')
            .toDate(),
          to: dayjs().subtract(1, 'day').endOf('day').add(dayjs().utcOffset(), 'minutes').toDate()
        };
        break;
      case TimeRange.Last2Days:
        newDateRange = {
          from: dayjs()
            .subtract(2, 'day')
            .startOf('day')
            .add(dayjs().utcOffset(), 'minutes')
            .toDate(),
          to: new Date()
        };
        break;
      case TimeRange.LastWeek:
        newDateRange = {
          from: dayjs()
            .subtract(1, 'week')
            .startOf('day')
            .add(dayjs().utcOffset(), 'minutes')
            .toDate(),
          to: new Date()
        };
        break;
    }
    if (newDateRange) {
      selectedDates.update(() => newDateRange);
    }
  }
</script>

<SegmentedButton segments={AVAILABLE_TIME_RANGES} let:segment singleSelect bind:selected>
  <Segment {segment}>
    <Label>{segment}</Label>
  </Segment>
</SegmentedButton>
{#if showDatePicker}
  <span>Wybierz przedział:</span>
  <Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />
{/if}
