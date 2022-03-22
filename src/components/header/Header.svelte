<script lang="ts">
  import TopAppBar, { Row, Section } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
</script>

<TopAppBar variant="static" color="primary">
  <Row>
    <Section align="end" toolbar>
      <IconButton class="material-icons" aria-label="Home" href="#/">home</IconButton>
      <IconButton class="material-icons" aria-label="Home" href="#/">help</IconButton>
      <IconButton class="material-icons" aria-label="Settings" href="#/settings"
        >settings</IconButton
      >
    </Section>
  </Row>
</TopAppBar>
