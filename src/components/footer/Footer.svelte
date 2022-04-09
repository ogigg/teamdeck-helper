<script lang="ts">
  import Github from 'svelte-material-icons/Github.svelte';
</script>

<div class="footer-wrapper">
  <div class="">Oskar Gierszewski {new Date().getFullYear()}</div>
  <div>
    <a href="https://github.com/ogigg/teamdeck-helper">
      <span class="link">
        <span class="logo"><Github color="black" /></span>
        Github
      </span>
    </a>
  </div>
</div>

<style lang="scss">
  .footer-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 1rem;

    .link {
      display: flex;
      align-items: center;
    }

    .logo {
      height: 1rem;
      margin-right: 0.25rem;
    }
  }
</style>
