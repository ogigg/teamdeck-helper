<script lang="ts">
  import Button from '@smui/button';
  import { addTimeEntryToTeamdeck } from '../../helpers/teamdeck';
  import { TimeEntryRequestStatus } from '../../models/harvest';
  import { timeEntries } from '../../store';

  const submit = () => {
    timeEntries.update(entries =>
      entries.map(entry => ({ ...entry, status: TimeEntryRequestStatus.Loading }))
    );
    $timeEntries.forEach(timeEntry => {
      addTimeEntryToTeamdeck(timeEntry).then(res => {
        timeEntries.update(entries =>
          entries.map(storeEntry => {
            if (storeEntry.id === timeEntry.id) {
              return {
                ...storeEntry,
                status: res.success ? TimeEntryRequestStatus.Success : TimeEntryRequestStatus.Error
              };
            }
            return storeEntry;
          })
        );
      });
    });
  };
</script>

{#if $timeEntries}
  <Button variant="raised" on:click={submit}>Dodaj do teamdecka!</Button>
{/if}
