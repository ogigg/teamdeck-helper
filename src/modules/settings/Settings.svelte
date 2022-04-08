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
  import HarvestSettings from './HarvestSettings.svelte';

  let teamdeckForm: TeamdeckApiData = JSON.parse(localStorage.getItem('teamdeckAPI')) ?? {
    googleToken: '',
    accessToken: '',
    refreshToken: ''
  };
  console.log(teamdeckForm);

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
    fetch(TEAMDECK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `query {
            googleAuthUrl
        }`,
        variables: {}
      })
    })
      .then(res => res.json())
      .then((result: GraphQlResponse<GoogleLoginResponse>) =>
        window.open(result.data.googleAuthUrl, '_blank').focus()
      );
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
    <HarvestSettings />
  </div>
  <div class="section-wrapper">
    <h3>Teamdeck API</h3>
    <p>
      Kliknij przycisk poniej, w nowej karcie zaloguj się kontem google moodupowym a następnie
      skopiuj wygenerowany token autoryzacyjny ponizej
    </p>
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
