<script>
	import Products from '../components/Products.svelte';
</script>

<div class="h-[600px] bg-[url('/images/logo/banner.jpg')] bg-cover bg-center bg-no-repeat">
	<div class="flex flex-col items-center justify-center h-full">
		<h1 class="text-4xl font-bold text-white">Neworld</h1>
		<p class="text-lg text-white mt-2">Discover the world of products</p>
		<!-- <div class="flex gap-2 mt-4">
			<a href="/products" class="bg-white text-black px-4 py-2 rounded-lg">Shop Now</a>
			<a href="/about" class="bg-transparent border border-white text-white px-4 py-2 rounded-lg"
				>Learn More</a
			>
		</div> -->
	</div>
	<div class="h-[20px]"></div>
	<div class="flex-1 flex flex-col m-auto w-full max-w-[1200px] px-4">
		<Products />
	</div>
</div>
