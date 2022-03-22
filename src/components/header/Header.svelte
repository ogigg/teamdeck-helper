<script lang="ts">
  import TopAppBar, { Row, Section } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import HelpDialog from '../helpDialog/HelpDialog.svelte';

  let openHelpDialog = false;
</script>

<TopAppBar variant="static" color="primary">
  <Row>
    <Section align="end" toolbar>
      <IconButton class="material-icons" aria-label="Home" href="#/">home</IconButton>
      <IconButton class="material-icons" aria-label="Help" on:click={() => (openHelpDialog = true)}
        >help</IconButton
      >
      <IconButton class="material-icons" aria-label="Settings" href="#/settings"
        >settings</IconButton
      >
    </Section>
  </Row>
</TopAppBar>

<HelpDialog {openHelpDialog} />
