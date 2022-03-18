<script lang="ts">
  import type { HarvestApiData } from './../../models/harvest';

  let harvestApi: HarvestApiData | null = JSON.parse(localStorage.getItem('harvestAPI'));
</script>

<section>
  <h1>Home!</h1>
  {#if harvestApi}
    <p>{harvestApi.accountId}</p>
    <p>{harvestApi.token}</p>
  {:else}
    <p>Brak danych do harvesta, ustaw je w <a href="#/settings">ustawieniach</a></p>
  {/if}
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }
</style>
