<script lang="ts">
  import Router, { link } from 'svelte-spa-router';
  import { routes } from './App.routes';
  import Header from './components/header/Header.svelte';
  export let name: string;
</script>

<svelte:head>
  <title>Teamdeck helper</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="pl" />
</svelte:head>

<body>
  <Header />
  <Router {routes} />
</body>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
    background-color: #fafafa;
  }
  main {
    text-align: center;
    padding: 0;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
