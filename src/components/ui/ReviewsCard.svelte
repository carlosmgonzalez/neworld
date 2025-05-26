<script lang="ts">
	import type { Review } from '$lib/interfaces/review.interface';

	export let review: Review;
</script>

<div
	class="bg-blue-200/50 backdrop-blur-3xl shadow rounded-xl flex flex-col justify-start gap-1 p-2"
>
	<h4 class="font-bold self-start">{review.title}</h4>
	<p class="text-xs text-gray-500">{review.description}</p>
	<p class="text-xs text-gray-500">Rating: {review.qualification}</p>
</div>
