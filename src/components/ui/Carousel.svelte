<script lang="ts">
	export let images: string[] = [];
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
</script>

<Splide>
	{#each images as image}
		<SplideSlide>
			<div class="w-full flex justify-center items-start mb-6 md:mb-0">
				<img
					src={image}
					alt=""
					class="w-[300px] h-auto rounded-lg shadow-lg border-1 border-neutral-200"
				/>
			</div>
		</SplideSlide>
	{/each}
</Splide>
