<script lang="ts">
  import type { HarvestApiData } from './../../models/harvest';
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { setContext } from 'svelte';
  let form: HarvestApiData = JSON.parse(localStorage.getItem('harvestAPI')) ?? {
    token: '',
    accountId: ''
  };
  setContext('harvestAPI', form);

  const onSubmit = () => {
    localStorage.setItem('harvestAPI', JSON.stringify(form));
    push('/');
  };
</script>

<section>
  <h1>Ustawienia!</h1>
  <div class="section-wrapper">
    <h3>Harvest</h3>
    <p>
      Klucz API mozesz znaleźć tutaj: <a
        href="https://id.getharvest.com/developers"
        rel="noopener noreferrer"
        target="_blank">https://id.getharvest.com/developers</a
      >
    </p>
    <form on:submit|preventDefault={onSubmit} class="harvest-form">
      <Textfield variant="outlined" bind:value={form.token} label="Token" />
      <Textfield variant="outlined" bind:value={form.accountId} label="Account Id" />
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
