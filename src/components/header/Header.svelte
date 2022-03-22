<script lang="ts">
  import TopAppBar, { Row, Section } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

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

<Dialog bind:open={openHelpDialog} aria-labelledby="simple-title" aria-describedby="simple-content">
  <Title id="simple-title">Jak używać aplikacji</Title>
  <Content id="simple-content">
    <ol>
      <li>Dodaj klucz API Harvesta</li>
      <li>Wybierz przedział</li>
      <li>Wygeneruj skrypt</li>
      <li>Skopiuj kod</li>
      <li>Wklej do konsoli przeglądarki na stronie teamdecka</li>
      <li>Profit</li>
    </ol>
  </Content>
  <Actions>
    <Button>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>
