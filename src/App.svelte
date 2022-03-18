<script lang="ts">
  import Router, { link } from 'svelte-spa-router';
  import { routes } from './App.routes';
  import Header from './components/header/Header.svelte';
  export let name: string;
</script>

<main>
  <Header />
  <a href="/" use:link>Home</a>
  <a href="/settings" use:link>Settings</a>
  <Router {routes} />
</main>

<style lang="scss">
  body {
    padding: 0;
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
