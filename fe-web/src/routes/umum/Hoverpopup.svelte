<script>
    import Popup from "./Popup.svelte";

    let { text , location, link, isHovered } = $props()

    // let isHovered = $state(false);
  </script>
  
  <div 
    class="relative inline-block"
    role="button"
    tabindex="0"
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
  >
  
    {#if isHovered}
      <Popup text={text} location={location} link={link} />
    {/if}
  </div>
  