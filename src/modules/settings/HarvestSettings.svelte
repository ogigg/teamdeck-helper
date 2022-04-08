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

<h3>Harvest</h3>
<p>
  Klucz API mozesz znaleźć tutaj: <a
    href="https://id.getharvest.com/developers"
    rel="noopener noreferrer"
    target="_blank">https://id.getharvest.com/developers</a
  >
</p>
<form on:submit|preventDefault={onSubmit} class="form">
  <Textfield variant="outlined" bind:value={form.token} label="Token" />
  <Textfield variant="outlined" bind:value={form.accountId} label="Account Id" />
  <Button type="submit" variant="raised">Zapisz</Button>
</form>

<style lang="scss">
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
