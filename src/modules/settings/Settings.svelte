<script lang="ts">
  import HarvestSettings from './HarvestSettings.svelte';
  import TeamdeckSettings from './TeamdeckSettings.svelte';
  import ClockifySettings from './ClockifySettings.svelte';
</script>

<section>
  <h1>Ustawienia</h1>
  <div class="section-wrapper">
    <HarvestSettings />
  </div>
  <div class="section-wrapper">
    <ClockifySettings />
  </div>
  <div class="section-wrapper">
    <TeamdeckSettings />
  </div>
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }

  .section-wrapper {
    margin-top: 1rem;
    -webkit-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    padding: 1rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &.teamdeck-form {
      margin-top: 1.5rem;
    }
  }
</style>
