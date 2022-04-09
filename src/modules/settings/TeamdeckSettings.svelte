<script lang="ts">
  import { push } from 'svelte-spa-router';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import { TEAMDECK_API } from '../../constants/api';
  import type {
    GoogleLoginResponse,
    GraphQlResponse,
    TeamdeckApiData,
    TeamdeckTokenExchangeResponse
  } from '../../models/teamdeck';
  import CircularProgress from '@smui/circular-progress';
  import IconButton from '@smui/icon-button';
  let showGoogleSpinner,
    showTeamdeckSpinner = false;

  const initialForm: TeamdeckApiData = {
    googleCode: '',
    accessToken: '',
    refreshToken: ''
  };
  let teamdeckForm: TeamdeckApiData =
    JSON.parse(localStorage.getItem('teamdeckAPI')) ?? initialForm;

  const removeSettings = () => {
    localStorage.removeItem('teamdeckAPI');
    teamdeckForm = initialForm;
  };

  const onTeamdeckSubmit = () => {
    generateAccessToken().then(res => {
      showTeamdeckSpinner = false;
      if (res?.data?.exchangeAuthorizationCodeForToken) {
        localStorage.setItem(
          'teamdeckAPI',
          JSON.stringify({
            googleCode: teamdeckForm.googleCode,
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
    showGoogleSpinner = true;
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
      )
      .finally(() => (showGoogleSpinner = false));
  };

  const generateAccessToken = (): Promise<GraphQlResponse<TeamdeckTokenExchangeResponse>> => {
    showTeamdeckSpinner = true;
    return fetch(TEAMDECK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `mutation {
    exchangeAuthorizationCodeForToken(authorizationCode:"${teamdeckForm.googleCode}") {
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

<div class="header-container">
  <h3>Teamdeck API</h3>
  <IconButton class="material-icons" aria-label="remove-settings" on:click={removeSettings}
    >delete</IconButton
  >
</div>
<p>
  Kliknij przycisk poniej, w nowej karcie zaloguj się kontem google moodupowym a następnie skopiuj
  wygenerowany token autoryzacyjny ponizej
</p>
<Button variant="raised" on:click={googleLogin}>
  {#if showGoogleSpinner}
    <CircularProgress style="height: 32px; width: 32px;" indeterminate />
  {:else}
    Zaloguj się z googlem
  {/if}
</Button>
<form on:submit|preventDefault={onTeamdeckSubmit} class="form teamdeck-form">
  <Textfield variant="outlined" bind:value={teamdeckForm.googleCode} label="Token" />
  <Button type="submit" variant="raised"
    >{#if showTeamdeckSpinner}
      <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    {:else}
      Zapisz
    {/if}</Button
  >
</form>

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

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
