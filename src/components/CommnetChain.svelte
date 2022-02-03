<script>
import { onMount } from "svelte";
import {buildChain, CHAIN_TYPE } from "../common/comment_chain"

export let comment;
export let video_id;

let commentChain = []
onMount(() => {
  commentChain = buildChain(comment)
})
$:hasChain = commentChain.length > 0
</script>
<main>
  {#if hasChain}
    {#each commentChain as chain,i (i)}
      {#if chain.type === CHAIN_TYPE.TEXT}
        <span>{chain.text}</span>
      {:else if chain.type === CHAIN_TYPE.VIDEO_TIME}
        <a href="/watch?v={video_id}&amp;t={chain.seconds}s" dir="auto">{chain.text}</a>
      {/if}
    {/each}
  {/if}
</main>