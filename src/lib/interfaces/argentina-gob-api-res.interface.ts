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
	categoria: string;
	centroide: Centroide;
	departamento: Departamento;
	id: string;
	localidad_censal: Departamento;
	municipio: Departamento;
	nombre: string;
	provincia: Departamento;
}

export interface Centroide {
	lat: number;
	lon: number;
}

export interface Departamento {
	id: string | null;
	nombre: string | null;
}

export interface Parametros {
	max: number;
	provincia: string[];
}
