<script lang="ts">
  import type { HarvestApiData } from './../../models/harvest';
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { setContext } from 'svelte';
  import IconButton from '@smui/icon-button';
  import type { ClockifyAPI, Workspace } from '../../models/clockify';
  import { getProjects, getWorkspaces } from '../../helpers/clockify';
  import Select, { Option } from '@smui/select';

  const initialForm: ClockifyAPI = {
    apiKey: '',
    workspace: {
      id: '',
      name: ''
    }
  };
  let workspaceRequest, selectedWorkspace, workspaces;
  let form: ClockifyAPI = JSON.parse(localStorage.getItem('clockifyAPI')) ?? initialForm;

  setContext('clockifyAPI', form);

  const onSubmit = () => {
    localStorage.setItem('clockifyAPI', JSON.stringify(form));
  };

  const removeSettings = () => {
    localStorage.removeItem('clockifyAPI');
    form = initialForm;
  };

  const handleAPIKey = () => {
    localStorage.setItem('clockifyAPI', JSON.stringify(form));
    workspaceRequest = getWorkspaces();
    workspaceRequest.then(res => (workspaces = res));
  };

  const saveWorkspace = () => {
    form.workspace = selectedWorkspace ?? workspaces[0];
    localStorage.setItem('clockifyAPI', JSON.stringify(form));
    getProjects(form.workspace.id).then(res => console.log(res));
  };
</script>

<div class="header-container">
  <h3>Clockify</h3>
  <IconButton class="material-icons" aria-label="remove-settings" on:click={removeSettings}
    >delete</IconButton
  >
</div>
<p>
  Klucz API mozesz znaleźć tutaj: <a
    href="https://app.clockify.me/user/settings"
    rel="noopener noreferrer"
    target="_blank">https://app.clockify.me/user/settings</a
  >
</p>
<form on:submit|preventDefault={onSubmit} class="form">
  <Textfield variant="outlined" bind:value={form.apiKey} label="Api Key" />
  {#if !workspaceRequest}
    <Button variant="raised" on:click={handleAPIKey}>Dodaj klucz api</Button>
  {/if}
  {#if workspaceRequest}
    {#await workspaceRequest}
      <p>...Pobieram workspaces</p>
    {:then workspaces}
      {#if workspaces.length === 0}
        Nie masz workspace, uzupełnij clockify
      {:else if workspaces.length > 1}
        <p>Pobrano {workspaces?.length} workspaces, wybierz z którego pobierać dane</p>
        <Select variant="outlined" bind:value={selectedWorkspace} label="Wybierz workspace">
          {#each workspaces as workspace}
            <Option value={workspace}>{workspace.name}</Option>
          {/each}
        </Select>
      {:else}
        Masz tylko 1 workspace - {workspaces[0].name};
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
    <Button variant="raised" on:click={saveWorkspace}>Zapisz workspace</Button>
  {/if}

  <!-- {#if form.apiKey}
    <Textfield variant="outlined" bind:value={form.workspace.id} label="Workspace" />
  {/if}
  <Button type="submit" variant="raised">Zapisz</Button> -->
</form>

<style lang="scss">
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
