<script lang="ts">
    const {children} = $props();
</script>

<h3 class="p-6">Menu Manajemen</h3>


{@render children()}

<style>
    h3{
        font-size: medium;
        color : white;
        font-weight: bold;
    }
</style>