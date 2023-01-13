<script>
  import { onMount } from 'svelte';
  import Modal from './components/Modal.svelte';
  import AuthEventsListener from './lib/authgw/AuthEventsListener';
  import State from './lib/State';
  import Settings from './Settings';
  const state = new State(Settings.appName);
  
  let isOpenModal = false;

  function openModal() {
    isOpenModal = true;
  }

  function closeModal() {
    isOpenModal = false;
  }

  /**
   * The button that opens the modal in the main page
   */
  function initializeTargetButton() {
    const targetButton = document.getElementById('targetButton');
    if (targetButton) {
      targetButton.addEventListener('click', openModal);
    }
  }

  async function initializeAuth() {
    await AuthEventsListener(state);
  }
 
  onMount(async () => {  
    await initializeAuth();
    initializeTargetButton();
  });

</script>
<Modal isOpenModal={isOpenModal} on:closeModal={closeModal} state={state} />