export interface ProvinceResponse {
	cantidad: number;
	inicio: number;
	provincias: Provincia[];
	total: number;
}

export interface Provincia {
	centroide: Centroide;
	id: string;
	nombre: string;
}

export interface Centroide {
	lat: number;
	lon: number;
}

export interface LocalityResponse {
	cantidad: number;
	inicio: number;
	localidades: Localidad[];
	parametros: Parametros;
	total: number;
}

export interface Localidad {
	categoria: Categoria;
	centroide: Centroide;
	departamento: Departamento;
	id: string;
	localidad_censal: Departamento;
	municipio: Departamento;
	nombre: string;
	provincia: Departamento;
}

export enum Categoria {
	Entidad = 'Entidad'
}

export interface Centroide {
	lat: number;
	lon: number;
}

export interface Departamento {
	id: string;
	nombre: Nombre;
}

export enum Nombre {
	AlmiranteBrown = 'Almirante Brown',
	BuenosAires = 'Buenos Aires'
}

export interface Parametros {
	max: number;
	provincia: string[];
}
