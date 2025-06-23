import { Preference, MercadoPagoConfig } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '$env/static/private';

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN_MP });
const preference = new Preference(client);
export default preference;
