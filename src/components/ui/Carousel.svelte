<script lang="ts">
	export let images: string[] = [];
	import * as Carousel from '$lib/components/ui/carousel/index';
</script>

<div class="w-full flex justify-center items-center">
	<Carousel.Root class="max-w-xs">
		<Carousel.Content>
			{#each images as image}
				<Carousel.Item>
					<div class="w-full flex justify-center items-start mb-6 md:mb-0">
						<img
							src={image}
							alt=""
							class="w-[300px] h-auto rounded-lg shadow-lg border-1 border-neutral-200"
						/>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
