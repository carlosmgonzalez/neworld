<script lang="ts">
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
	import ProductCard from '$lib/components/cards/product-card.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
</script>

<svelte:head>
	<title>Neworld - Descubre la nueva tecnología</title>
	<meta name="title" content="Neworld - Tienda de tecnología" />
	<meta name="description" content="Acá podras descubrir el nuevo mundo de la tecnología con AI" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={PUBLIC_BASE_URL} />
	<meta property="og:title" content="Neworld - Tienda de tecnología" />
	<meta
		property="og:description"
		content="Acá podras descubrir el nuevo mundo de la tecnología con AI"
	/>
	<meta
		property="og:image"
		content="https://res.cloudinary.com/difikt7so/image/upload/v1747845923/neworld/hnathhnzue7ja41pz1sv.png"
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={PUBLIC_BASE_URL} />
	<meta property="twitter:title" content="Neworld - Tienda de tecnología" />
	<meta
		property="twitter:description"
		content="Acá podras descubrir el nuevo mundo de la tecnología con AI"
	/>
	<meta
		property="twitter:image"
		content="https://res.cloudinary.com/difikt7so/image/upload/v1747845923/neworld/hnathhnzue7ja41pz1sv.png"
	/>
</svelte:head>

<div
	class="h-[350px] sm:h-[400px] bg-[url('https://res.cloudinary.com/difikt7so/image/upload/v1750870706/neworld/c7s3zu7rmy3ub5u9ixkp.png')]
	dark:bg-[url('https://res.cloudinary.com/difikt7so/image/upload/v1750870707/neworld/ggq37w7uxaw2ztyuxt0y.png')] bg-cover bg-center bg-no-repeat"
>
	<div class="flex flex-col items-center justify-center mt-5 h-full z-10 relative">
		<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[200px] h-auto" />
		<h1 class="text-3xl font-bold">Neworld</h1>
		<p class="text-lg mt-2">Descubre el nuevo mundo</p>
	</div>
</div>
<div class="page-container mt-4">
	<h1 class="text-lg font-semibold mb-2">Productos</h1>
	<section>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
			{#each data.products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
</div>

<!-- <div class="flex flex-col items-center justify-center h-full">
		<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[200px] h-auto" />
		<h1 class="text-4xl font-bold text-white">Neworld</h1>
		<p class="text-lg text-white mt-2">Descubre el nuevo mundo</p>
	</div> -->
