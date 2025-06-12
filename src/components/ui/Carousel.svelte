<script lang="ts">
	export let images: string[] = [];
	import * as Carousel from '$lib/components/ui/carousel/index';
</script>

<div class="w-full flex justify-center items-center">
	<Carousel.Root class="w-[75%]">
		<Carousel.Content>
			{#each images as image}
				<Carousel.Item class="flex justify-center">
					<img
						src={image}
						alt={image}
						class="w-[300px] h-auto rounded-lg shadow-lg border-1 border-neutral-200"
					/>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
