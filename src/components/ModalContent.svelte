<script>
  import { onMount } from 'svelte';
  import { redirectToAuthenticationService } from '../lib/authgw/AuthGWService';
  import { fetchUserProfileData } from '../lib/testbed/TestbedAPIService';
  import { log } from '../lib/utils/logging';
  import { popUrlQueryParamFromCurrentUrl } from '../lib/utils/urls';

    export let state;
    export let closeModal;

    let isLoading = false;

    function onFetchProfileDataBtnClick() {
        if (state.is("sessionStorage::loggedIn")) {
            fetchProfileData();
            closeModal();
        } else {
            redirectToAuthenticationService({ queryParams: { vfAuthFlowEngaged: true }})
        }
    }

    onMount(async () => {
        // Coming back from the authentication service redirect
        if (popUrlQueryParamFromCurrentUrl("vfAuthFlowEngaged")) {
            if (state.is("sessionStorage::loggedIn")) {
                await fetchProfileData();
            } else {
                state.once("sessionStorage::loggedIn::set", fetchProfileData)
            }
        }
    });

    async function fetchProfileData() {
        if (!state.is("sessionStorage::loggedIn")) {
            throw new Error("Bad call: user is not logged in");
        }
        const { idToken } = state.get("sessionStorage::loggedIn");
        isLoading = true;
        const profileData = await fetchUserProfileData(idToken);
        isLoading = false;

        emitProfileDataToParentSite(profileData);

        return profileData;
    }

    function emitProfileDataToParentSite(profileData) {
        log("Emitting", profileData);
        const profileDataEvent = new CustomEvent("pluginProfileData", {
            detail: profileData
        });
        window.document.dispatchEvent(profileDataEvent);
    }
</script>

<div class="testbedContent">
    <h3>Testbed modal</h3>
    <div class="modalContent">
    {#if isLoading}
        <p>Loading..</p>
    {:else}
        <button on:click={onFetchProfileDataBtnClick}>Fetch profile data</button>
    {/if}
    </div>
</div>

<style>
    .testbedContent {
        padding: 1rem;
        background: inherit;
    }
</style>