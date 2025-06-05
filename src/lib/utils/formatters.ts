export function formatPrice(num: number): string {
	// "no quiero que tenga centavos" - trunca los decimales.
	// Math.trunc() elimina la parte fraccionaria.
	// Ej: Math.trunc(123.45) -> 123, Math.trunc(-123.45) -> -123
	const numeroBase = Math.ceil(num);

	// Determinar si el número es negativo.
	// Nota: Math.trunc(0) es 0. Math.trunc(-0.5) es 0.
	// Para -0.5, numeroBase será 0, y esNegativo será false.
	// Esto es correcto, ya que "$0" no lleva signo.
	const esNegativo = numeroBase < 0;

	// Convertir el valor absoluto del número a cadena para formatear.
	// Ej: si numeroBase es -10000, absNumeroStr será "10000".
	// Si numeroBase es NaN, String(Math.abs(NaN)) será "NaN".
	// Si numeroBase es Infinity, String(Math.abs(Infinity)) será "Infinity".
	const absNumeroStr = String(Math.abs(numeroBase));

	const longitud = absNumeroStr.length;
	let numeroAbsFormateado = '';

	// Iterar desde la derecha de la cadena del número (de unidades hacia la izquierda).
	for (let i = 0; i < longitud; i++) {
		// Anteponer el dígito actual al resultado parcial.
		// absNumeroStr[longitud - 1 - i] accede a los dígitos de derecha a izquierda.
		numeroAbsFormateado = absNumeroStr[longitud - 1 - i] + numeroAbsFormateado;

		// Añadir un punto como separador de miles.
		// (i + 1) es la cantidad de dígitos procesados desde la derecha.
		// Se añade un punto cada 3 dígitos.
		// La condición `(i + 1) < longitud` asegura que no se añada un punto al inicio del número
		// si el número tiene exactamente un múltiplo de 3 dígitos (ej. "123" no debe ser ".123").
		if ((i + 1) % 3 === 0 && i + 1 < longitud) {
			numeroAbsFormateado = '.' + numeroAbsFormateado;
		}
	}

	// Determinar el signo para el resultado final.
	const signo = esNegativo ? '-' : '';

	// Componer la cadena final con el signo (si es negativo), el símbolo de dólar y el número formateado.
	return `${signo}$${numeroAbsFormateado}`;
}
