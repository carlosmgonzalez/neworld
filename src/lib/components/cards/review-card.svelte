<script lang="ts">
	import { Star } from '@lucide/svelte';
	import type { Review } from '@prisma/client';
	import * as Card from '../ui/card/index';

	interface Props {
		review: Review;
	}
	const { review }: Props = $props();
</script>

<Card.Root class="p-1">
	<Card.Header class="p-1">
		<Card.Title class="flex flex-row justify-between items-center">
			<p>{review.name}</p>
		</Card.Title>
		<Card.Description>
			<div class="flex items-center">
				{#each Array(review.rating) as _, i}
					<Star class="text-primary w-5 h-auto" />
				{/each}
			</div>
		</Card.Description>
		<Card.Action></Card.Action>
	</Card.Header>
	<Card.Content class="p-1">
		{review.comment}
	</Card.Content>
</Card.Root>
