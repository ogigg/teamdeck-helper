<script lang="ts">
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { TEAMDECK_API } from '../../constants/api';
  import type {
    GoogleLoginResponse,
    GraphQlResponse,
    TeamdeckApiData,
    TeamdeckTokenExchangeResponse
  } from '../../models/teamdeck';
  import HarvestSettings from './HarvestSettings.svelte';
  import TeamdeckSettings from './TeamdeckSettings.svelte';
</script>

<section>
  <h1>Ustawienia</h1>
  <div class="section-wrapper">
    <HarvestSettings />
  </div>
  <div class="section-wrapper">
    <!-- <h3>Clockify</h3>
    <p>
      Klucz API mozesz znaleźć tutaj: <a
        href="https://app.clockify.me/user/settings"
        rel="noopener noreferrer"
        target="_blank">https://app.clockify.me/user/settings</a
      >
    </p>
    <form on:submit|preventDefault={onClockifySubmit} class="harvest-form">
      <Textfield variant="outlined" bind:value={clockifyForm.token} label="Api Key" />
      <Textfield variant="outlined" bind:value={clockifyForm.accountId} label="Account Id" />
      <Button type="submit" variant="raised">Zapisz</Button>
    </form>
  </div> -->
    <div class="section-wrapper">
      <TeamdeckSettings />
    </div>
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
