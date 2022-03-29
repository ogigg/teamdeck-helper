<script lang="ts">
  import type { HarvestApiData } from './../../models/harvest';
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { setContext } from 'svelte';

  let harvestForm: HarvestApiData = JSON.parse(localStorage.getItem('harvestAPI')) ?? {
    token: '',
    accountId: ''
  };
  let clockifyForm: HarvestApiData = JSON.parse(localStorage.getItem('ClockifyAPI')) ?? {
    token: '',
    accountId: ''
  };
  setContext('harvestAPI', harvestForm);

  const onHarvestSubmit = () => {
    localStorage.setItem('harvestAPI', JSON.stringify(harvestForm));
    push('/');
  };
  const onClockifySubmit = () => {
    localStorage.setItem('ClockifyAPI', JSON.stringify(clockifyForm));
    push('/');
  };
</script>

<section>
  <h1>Ustawienia</h1>
  <div class="section-wrapper">
    <h3>Harvest</h3>
    <p>
      Klucz API mozesz znaleźć tutaj: <a
        href="https://id.getharvest.com/developers"
        rel="noopener noreferrer"
        target="_blank">https://id.getharvest.com/developers</a
      >
    </p>
    <form on:submit|preventDefault={onHarvestSubmit} class="harvest-form">
      <Textfield variant="outlined" bind:value={harvestForm.token} label="Token" />
      <Textfield variant="outlined" bind:value={harvestForm.accountId} label="Account Id" />
      <Button type="submit" variant="raised">Zapisz</Button>
    </form>
  </div>
  <div class="section-wrapper">
    <h3>Clockify</h3>
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
  </div>
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }

  .section-wrapper {
    -webkit-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    padding: 1rem;
  }

  .harvest-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
