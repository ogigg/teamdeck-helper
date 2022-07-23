<script lang="ts">
  import Harvest from '../../components/Harvest.svelte';
  import { availableProviders } from '../../store';

  import type { HarvestApiData } from './../../models/harvest';

  let harvestApiData: HarvestApiData | null = JSON.parse(localStorage.getItem('harvestAPI'));
  let clockifyApiData: HarvestApiData | null = JSON.parse(localStorage.getItem('clockifyAPI'));
  availableProviders.set({
    harvest: harvestApiData !== null,
    clockify: clockifyApiData !== null
  });
</script>

<section>
  <h1>Generuj skrypt</h1>
  {#if harvestApiData || clockifyApiData}
    <Harvest />
  {:else}
    <p>Brak danych do providera/providerów, ustaw je w <a href="#/settings">ustawieniach</a></p>
  {/if}
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }
</style>
