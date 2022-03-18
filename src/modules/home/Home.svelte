<script lang="ts">
  import Harvest from '../../components/Harvest.svelte';

  import type { HarvestApiData } from './../../models/harvest';

  let harvestApiData: HarvestApiData | null = JSON.parse(localStorage.getItem('harvestAPI'));
</script>

<section>
  <h1>Home!</h1>
  {#if harvestApiData}
    <Harvest {harvestApiData} />
  {:else}
    <p>Brak danych do harvesta, ustaw je w <a href="#/settings">ustawieniach</a></p>
  {/if}
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }
</style>
