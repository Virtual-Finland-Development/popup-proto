<script>
  import { onMount } from 'svelte';
  import { redirectToAuthenticationService } from '../lib/authgw/AuthGWService';
  import { fetchUserProfileData } from '../lib/testbed/TestbedAPIService';

    export let state;
    let profileData = undefined;

    function clickFetchProfileDataBtn() {
        if (state.is("sessionStorage::loggedIn")) {
            fetchProfileData();
            return;
        }
        redirectToAuthenticationService();
    }

    async function initialize() {
        if (state.was("sessionStorage::modalWasOpen")) {
            if (state.is("sessionStorage::loggedIn")) {
                return await fetchProfileData();
            }
        }
        return null;
    }

    async function fetchProfileData() {
        if (!state.is("sessionStorage::loggedIn")) {
            throw new Error("Bad call: user is not logged in");
        }
        profileData = undefined;
        const { idToken } = state.get("sessionStorage::loggedIn");
        return await fetchUserProfileData(idToken);
    }

    onMount(async () => {
        profileData = await initialize();
    });


</script>

<div class="testbedContent">
    {#if typeof profileData === "undefined"}
        Loading..
    {:else if profileData !== null}
        <p>Profile data:</p>
        <pre>{JSON.stringify(profileData, null, 2)}</pre>
    {:else}
        <button on:click={clickFetchProfileDataBtn}>Fetch profile data</button>
    {/if}
</div>