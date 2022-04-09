<script lang="ts">
  import Router, { link } from 'svelte-spa-router';
  import { routes } from './App.routes';
  import Footer from './components/footer/Footer.svelte';
  import Header from './components/header/Header.svelte';
  export let name: string;
</script>

<svelte:head>
  <title>Teamdeck helper</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="pl" />
</svelte:head>

<body>
  <div class="wrapper">
    <Header />
    <Router {routes} />
  </div>
  <div class="footer">
    <Footer />
  </div>
</body>

<style lang="scss">
  $footer-height: 51px;
  body {
    padding: 0;
    margin: 0;
    background-color: #fafafa;
    height: 100vh;
  }

  .wrapper {
    min-height: calc(100% - $footer-height);
    margin-bottom: -$footer-height;
    padding-bottom: $footer-height;
  }

  .footer {
    height: $footer-height;
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
