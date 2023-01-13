<script>
    import { onMount } from 'svelte';
    import { fetchUserProfileDataConsent, redirectToAuthenticationService, redirectToConsentService } from '../lib/authgw/AuthGWService';
    import { fetchUserProfileData } from '../lib/testbed/TestbedAPIService';
    import { log } from '../lib/utils/logging';
    import { popUrlQueryParamFromCurrentUrl } from '../lib/utils/urls';
    const USER_PROFILE_CONSENT_SOURCE = "dpp://access_to_finland@testbed.fi/test/lassipatanen/User/Profile";

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
        await checkUserProfileDataConsent();
        
        const { idToken } = state.get("sessionStorage::loggedIn");
        const { consentToken } = state.get("variableStorage::consentSituation");

        isLoading = true;
        const profileData = await fetchUserProfileData(idToken, consentToken);
        isLoading = false;

        emitProfileDataToParentSite(profileData);

        return profileData;
    }

    async function checkUserProfileDataConsent() {
        if (!state.is("sessionStorage::loggedIn")) {
            throw new Error("Bad call: user is not logged in");
        }
        if (state.is("variableStorage::consentSituation")) {
            return;
        }

        const { idToken } = state.get("sessionStorage::loggedIn");

        isLoading = true;
        const consentSituation = await fetchUserProfileDataConsent(idToken, USER_PROFILE_CONSENT_SOURCE);
        isLoading = false;

        if (consentSituation.consentStatus === "consentGranted") {
            state.set("variableStorage::consentSituation", consentSituation);
        } else {
            redirectToConsentService(consentSituation, { queryParams: { vfAuthFlowEngaged: true }})
        }
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