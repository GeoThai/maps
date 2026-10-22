<script lang="ts">
  import { render } from '@geothai/maps';
  import type { MapShapes, RenderOptions } from '@geothai/maps/types';

  let { map, ...options }: { map: MapShapes } & RenderOptions = $props();
  const model = $derived(render(map, options));
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={model.viewBox} role="img" aria-label={model.title}>
  <title>{model.title}</title>
  {#each model.nodes as node (node.kind === 'line' ? node.key : `${node.kind}${node.code}`)}
    {#if node.kind === 'line'}
      <path
        d={node.d}
        fill="none"
        stroke={node.stroke}
        stroke-width={node.width}
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    {:else if node.kind === 'label'}
      <text
        x={node.x}
        y={node.y}
        font-size={node.size}
        text-anchor="middle"
        dominant-baseline="central"
        fill="#0f1115"
        stroke="#ffffff"
        stroke-width={node.size / 5}
        paint-order="stroke"
        stroke-linejoin="round">{node.text}</text
      >
    {:else if node.href}
      <a href={node.href}>
        <path d={node.d} fill={node.fill}>
          <title>{node.label}</title>
        </path>
      </a>
    {:else}
      <path d={node.d} fill={node.fill}>
        <title>{node.label}</title>
      </path>
    {/if}
  {/each}
</svg>
