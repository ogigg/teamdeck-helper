<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  export let openHelpDialog = false;
</script>

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
