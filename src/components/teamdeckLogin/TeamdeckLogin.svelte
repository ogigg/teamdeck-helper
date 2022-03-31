<script lang="ts">
  import Button from '@smui/button';
  import { TEAMDECK_API } from '../../constants/api';
  import type { GoogleLoginResponse, GraphQlResponse } from '../../models/teamdeck';

  const googleLogin = () => {
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
        console.log(result.data.googleAuthUrl)
      );
  };
</script>

<div>Timdek login</div>
<Button on:click={googleLogin}>Zaloguj się z googlem</Button>
