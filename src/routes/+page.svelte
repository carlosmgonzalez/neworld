<script lang="ts">
	import Products from '../components/Products.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
</script>

<div class="h-[600px] bg-[url('/images/logo/banner.jpg')] bg-cover bg-center bg-no-repeat">
	<div class="flex flex-col items-center justify-center h-full">
		<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[200px] h-auto" />
		<h1 class="text-4xl font-bold text-white">Neworld</h1>
		<p class="text-lg text-white mt-2">Descubre el nuevo mundo</p>
	</div>
</div>
<div class="h-[20px]"></div>
<div class="flex-1 flex flex-col m-auto w-full max-w-[1200px] px-4">
	<Products products={data.products} />
</div>
