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
    let useIFrame = false;

    function onFetchProfileDataBtnClick() {
        if (state.is("sessionStorage::loggedIn")) {
            fetchProfileData();
            closeModal();
        } else {
            redirectToAuthenticationService({ queryParams: { vfAuthFlowEngaged: true }, useIFrame: useIFrame})
        }
    }

    function onResetLoginBtnClick() {
        state.remove("sessionStorage::loggedIn");
        state.remove("variableStorage::consentSituation");
        window.location.reload();
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

        setAndEmitLoadingState(true);
        try {
            const profileData = await fetchUserProfileData(idToken, consentToken);
            setAndEmitLoadingState(false);
            emitProfileDataToParentSite(profileData);
            return profileData;
        } catch (error) {
            setAndEmitLoadingState(false);
            throw error;
        }
    }

    async function checkUserProfileDataConsent() {
        if (!state.is("sessionStorage::loggedIn")) {
            throw new Error("Bad call: user is not logged in");
        }
        if (state.is("variableStorage::consentSituation")) {
            return;
        }

        const { idToken } = state.get("sessionStorage::loggedIn");

        setAndEmitLoadingState(true);
        try {
            const consentSituation = await fetchUserProfileDataConsent(idToken, USER_PROFILE_CONSENT_SOURCE);
            setAndEmitLoadingState(false);

            if (consentSituation.consentStatus === "consentGranted") {
                state.set("variableStorage::consentSituation", consentSituation);
            } else {
                redirectToConsentService(consentSituation, { queryParams: { vfAuthFlowEngaged: true }, useIFrame: useIFrame})
            }
        } catch (e) {
            setAndEmitLoadingState(false);
            throw e;
        }
    }

    function setAndEmitLoadingState(loading) {
        isLoading = loading;
        const loadingEvent = new CustomEvent("pluginProfileData::loading", {
            detail: {
                isLoading: loading,
            }
        });
        window.document.dispatchEvent(loadingEvent);
    }

    function emitProfileDataToParentSite(profileData) {
        log("Emitting", profileData);
        const profileDataEvent = new CustomEvent("pluginProfileData", {
            detail: profileData
        });
        window.document.dispatchEvent(profileDataEvent);
    }
</script>

<div class="protoPluginAppContent">
    <h3>Testbed modal</h3>
    <div class="modalContent">
    {#if isLoading}
        <p>Loading..</p>
    {:else}
        <p>Logged in: {state.is("sessionStorage::loggedIn") ? "yes" : "no"}</p>
        <p>Consent: {state.is("variableStorage::consentSituation") ? "yes" : "no"}</p>
        <p>
            <label>
                <input type=checkbox bind:checked={useIFrame} />
                Use iframe login
            </label>
        </p>
        
        <button on:click={onFetchProfileDataBtnClick}>Fetch profile data</button>
        <button on:click={onResetLoginBtnClick}>Reset</button>
    {/if}
        
    </div>
</div>

<style>
    .protoPluginAppContent {
        padding: 1rem;
        background: inherit;
    }
</style>