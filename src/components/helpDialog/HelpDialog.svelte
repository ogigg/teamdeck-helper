<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import { createEventDispatcher } from 'svelte';

  export let openHelpDialog = false;

  const dispatch = createEventDispatcher();
</script>

<Dialog
  bind:open={openHelpDialog}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
  on:SMUIDialog:closed={() => dispatch('close')}
>
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
    <Button on:click={() => dispatch('close')}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>
