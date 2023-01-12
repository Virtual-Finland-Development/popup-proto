<script>
  	import { onMount } from 'svelte';

  import Modal from './Modal.svelte';
  
  let isOpenModal = false;

  function openModal() {
    isOpenModal = true;
  }

  function closeModal() {
    isOpenModal = false;
  }
  
  onMount(() => {  
    const targetButton = document.getElementById('targetButton');
    if (targetButton) {
      targetButton.addEventListener('click', openModal);
    }
  });

</script>
<Modal isOpenModal={isOpenModal} on:closeModal={closeModal} />