export async function load({ params }) {
	// params.slug contendrá el valor del segmento dinámico de la URL
	const slug = params.slug;

	// Puedes hacer alguna lógica aquí si necesitas...

	return {
		slug: slug // Retorna el slug en el objeto data
	};
}
