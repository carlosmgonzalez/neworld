<script lang="ts">
	import Products from '../components/Products.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
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

<!-- <div class="h-[600px] bg-[url('/images/logo/banner.jpg')] bg-cover bg-center bg-no-repeat">
	<div class="flex flex-col items-center justify-center h-full">
		<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[200px] h-auto" />
		<h1 class="text-4xl font-bold text-white">Neworld</h1>
		<p class="text-lg text-white mt-2">Descubre el nuevo mundo</p>
	</div>
</div> -->
<div class="relative h-[300px] md:h-[450px] overflow-hidden">
	<video
		class="absolute top-14 left-0 w-full h-full object-cover z-0"
		src="https://res.cloudinary.com/difikt7so/video/upload/v1748374945/neworld/wpkhlhnr7c8oya3tkh23.mp4"
		autoplay
		muted
		playsinline
	></video>
	<!-- <div class="flex flex-col items-center justify-center h-full relative z-10">
		<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[200px] h-auto" />
		<h1 class="text-4xl font-bold text-white">Neworld</h1>
		<p class="text-lg text-white mt-2">Descubre el nuevo mundo</p>
	</div> -->
</div>
<div class="h-[20px]"></div>
<div class="flex-1 flex flex-col m-auto w-full max-w-[1200px] px-4">
	<Products products={data.products} />
</div>
