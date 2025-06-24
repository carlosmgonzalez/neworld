<script lang="ts">
	import { Star } from '@lucide/svelte';
	import type { Review } from '@prisma/client';

	interface Props {
		review: Review;
	}
	const { review }: Props = $props();
</script>

<li class="bg-white shadow-md rounded-lg p-4 flex flex-col">
	<div class="flex justify-between items-center">
		<p>{review.name}</p>
		<div class="flex items-center mb-2">
			{#each Array(review.rating) as _, i}
				<Star class="text-yellow-500" />
			{/each}
		</div>
	</div>
	<p class="text-sm text-neutral-700">
		{review.comment}
	</p>
</li>
