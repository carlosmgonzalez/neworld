<div class="absolute z-10 w-full h-28 bg-linear-to-t from-trasparente to-blue-300"></div>
<div class="w-full max-w-[1200px] mx-auto flex flex-col px-4 md:px-6 mt-28">
	<h1 class="text-2xl font-semibold">Checkout</h1>
	<a href="/cart" class="underline"> Volver al carrito </a>
	<form class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
		<div class="flex flex-col gap-2 h-fit">
			<p>Datos personales:</p>
			<input
				type="text"
				placeholder="Nombre"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="text"
				placeholder="Apellido"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="email"
				placeholder="Correo electrónico"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="text"
				placeholder="Teléfono"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
		</div>
		<div class="flex flex-col gap-2 h-fit">
			<p>Dirección de envío:</p>
			<input
				type="text"
				placeholder="Calle"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="text"
				placeholder="Número"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="text"
				placeholder="Ciudad"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
			<input
				type="text"
				placeholder="Código postal"
				class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
				required
			/>
		</div>
		<!-- <p>Metodo de pago:</p>
		<input
			type="text"
			placeholder="Número de tarjeta"
			class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
			required
		/>
		<input
			type="text"
			placeholder="Fecha de vencimiento"
			class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
			required
		/>
		<input
			type="text"
			placeholder="Código de seguridad"
			class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
			required
		/>
		<input
			type="text"
			placeholder="Nombre en la tarjeta"
			class="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
			required
		/> -->
	</form>
	<button
		type="submit"
		class="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-blue-600 transition-colors duration-300"
	>
		Realizar pedido
	</button>
	<!-- <div class="flex flex-col gap-2">
		<p class="text-sm text-gray-500">
			Al realizar el pedido, aceptas nuestros términos y condiciones.
		</p>
		<p class="text-sm text-gray-500">Tu información está segura con nosotros.</p>
		<p class="text-sm text-gray-500">
			Recibirás un correo de confirmación una vez que se procese tu pedido.
		</p>
		<p class="text-sm text-gray-500">Si tienes alguna pregunta, no dudes en contactarnos.</p>
		<p class="text-sm text-gray-500">Gracias por tu compra.</p>
	</div> -->
</div>
