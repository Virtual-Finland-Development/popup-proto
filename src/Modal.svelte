<script>
    import { createEventDispatcher } from 'svelte';
    import ModalContent from './ModalContent.svelte';
    export let isOpenModal;

    const dispatch = createEventDispatcher();

    function closeModal() {
        isOpenModal = false;
        dispatch('closeModal', { isOpenModal });
    }

    function onKeyUpEvent(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

</script>

<div id="background" style="--display: {isOpenModal ? 'block' : 'none'}" on:click={closeModal} on:keyup={onKeyUpEvent}></div>
<div id="modal" style="--display: {isOpenModal ? 'block' : 'none'};">
    <ModalContent />
</div>

<style>
    #background {
        display: var(--display);
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    #modal {
        display: var(--display);
        position: fixed;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        color: #333;
        filter: drop-shadow(0 0 20px #333);
    }
</style>