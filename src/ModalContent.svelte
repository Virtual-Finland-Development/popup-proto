<script>
    import { redirectToAuthenticationService } from './lib/testbed/TestbedService';
    function fetchProfileData() {
        console.log('fetchProfileData()');
        redirectToAuthenticationService();
    }
</script>

<div class="testbedContent">
    <button on:click={fetchProfileData}>Fetch profile data</button>
</div>