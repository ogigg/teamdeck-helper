<script lang="ts">
  import type { HarvestApiData } from './../../models/harvest';
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { setContext } from 'svelte';
  import { TEAMDECK_API } from '../../constants/api';
  import type {
    GoogleLoginResponse,
    GraphQlResponse,
    TeamdeckApiData,
    TeamdeckTokenExchangeResponse
  } from '../../models/teamdeck';

  let form: HarvestApiData = JSON.parse(localStorage.getItem('harvestAPI')) ?? {
    token: '',
    accountId: ''
  };
  let teamdeckForm: TeamdeckApiData = JSON.parse(localStorage.getItem('teamdeckAPI')) ?? {
    googleToken: '',
    accessToken: '',
    refreshToken: ''
  };
  setContext('harvestAPI', form);

  const onSubmit = () => {
    localStorage.setItem('harvestAPI', JSON.stringify(form));
    push('/');
  };

  const onTeamdeckSubmit = () => {
    generateAccessToken().then(res => {
      if (res?.data?.exchangeAuthorizationCodeForToken) {
        localStorage.setItem(
          'teamdeckAPI',
          JSON.stringify({
            googleCode: teamdeckForm.googleToken,
            accessToken: res.data.exchangeAuthorizationCodeForToken.accessToken,
            refreshToken: res.data.exchangeAuthorizationCodeForToken.refreshToken
          })
        );
        push('/');
      } else {
        console.error(res);
      }
    });
  };

  const googleLogin = () => {
    // TODO 31.03.2022: Uncomment once cors error will be fixed.
    // fetch(TEAMDECK_API, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     query: `query {
    //         googleAuthUrl
    //     }`,
    //     variables: {}
    //   })
    // })
    //   .then(res => res.json())
    //   .then((result: GraphQlResponse<GoogleLoginResponse>) =>
    //     window.open(result.data.googleAuthUrl, '_blank').focus()
    //   );
    window
      .open(
        'https://accounts.google.com/o/oauth2/v2/auth?client_id=847866067409-r9d7tunol78c4comreo1oukcivtgl7bg.apps.googleusercontent.com&redirect_uri=https://teamdeck-tracker-api-staging.herokuapp.com/google/redirect&scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&access_type=online',
        '_blank'
      )
      .focus();
  };
  const generateAccessToken = (): Promise<GraphQlResponse<TeamdeckTokenExchangeResponse>> => {
    // TODO 31.03.2022: Uncomment once cors error will be fixed.
    return fetch(TEAMDECK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `mutation {
  exchangeAuthorizationCodeForToken(authorizationCode:"${teamdeckForm.googleToken}") {
    accessToken
    refreshToken
    expiresIn
  }
}`,
        variables: {}
      })
    }).then(res => res.json());
  };
</script>

<section>
  <h1>Ustawienia</h1>
  <div class="section-wrapper">
    <h3>Harvest</h3>
    <p>
      Klucz API mozesz znaleźć tutaj: <a
        href="https://id.getharvest.com/developers"
        rel="noopener noreferrer"
        target="_blank">https://id.getharvest.com/developers</a
      >
    </p>
    <form on:submit|preventDefault={onSubmit} class="form">
      <Textfield variant="outlined" bind:value={form.token} label="Token" />
      <Textfield variant="outlined" bind:value={form.accountId} label="Account Id" />
      <Button type="submit" variant="raised">Zapisz</Button>
    </form>
  </div>
  <div class="section-wrapper">
    <h3>Teamdeck API</h3>
    <p>Kliknij przycisk poniej a następnie skopiuj wygenerowany token autoryzacyjny</p>
    <Button variant="raised" on:click={googleLogin}>Zaloguj się z googlem</Button>
    <form on:submit|preventDefault={onTeamdeckSubmit} class="form teamdeck-form">
      <Textfield variant="outlined" bind:value={teamdeckForm.googleToken} label="Token" />
      <Button type="submit" variant="raised">Zapisz</Button>
    </form>
  </div>
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }

  .section-wrapper {
    -webkit-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 25px -16px rgba(0, 0, 0, 1);
    padding: 1rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &.teamdeck-form {
      margin-top: 1.5rem;
    }
  }
</style>
