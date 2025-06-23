export interface PaymentData {
	accounts_info: null;
	acquirer_reconciliation: [];
	additional_info: AdditionalInfo;
	authorization_code: string;
	binary_mode: boolean;
	brand_id: null;
	build_version: string;
	call_for_authorize_id: null;
	captured: boolean;
	card: Card;
	charges_details: ChargesDetail[];
	collector_id: number;
	corporation_id: null;
	counter_currency: null;
	coupon_amount: number;
	currency_id: string;
	date_approved: Date;
	date_created: Date;
	date_last_updated: Date;
	date_of_expiration: null;
	deduction_schema: string;
	description: string;
	differential_pricing_id: null;
	external_reference: string;
	fee_details: FeeDetail[];
	financing_group: null;
	id: number;
	installments: number;
	integrator_id: null;
	issuer_id: string;
	live_mode: boolean;
	marketplace_owner: number;
	merchant_account_id: null;
	merchant_number: null;
	metadata: Metadata;
	money_release_date: Date;
	money_release_schema: null;
	money_release_status: string;
	notification_url: string;
	operation_type: string;
	order: Order;
	payer: PaymentDataPayer;
	payment_method: PaymentMethod;
	payment_method_id: string;
	payment_type_id: string;
	platform_id: null;
	point_of_interaction: PointOfInteraction;
	pos_id: null;
	processing_mode: string;
	refunds: [];
	shipping_amount: number;
	sponsor_id: null;
	statement_descriptor: string;
	status: string;
	status_detail: string;
	store_id: null;
	tags: null;
	taxes_amount: number;
	transaction_amount: number;
	transaction_amount_refunded: number;
	transaction_details: TransactionDetails;
}

export interface AdditionalInfo {
	authentication_code: null;
	available_balance: null;
	ip_address: string;
	items: Item[];
	nsu_processadora: null;
	payer: AdditionalInfoPayer;
}

export interface Item {
	category_id: string;
	description: string;
	id: string;
	picture_url: null;
	quantity: string;
	title: string;
	unit_price: string;
}

export interface AdditionalInfoPayer {
	address: Address;
	first_name: string;
	last_name: string;
	phone: PurplePhone;
}

export interface Address {
	street_name: string;
	street_number: string;
	zip_code: string;
}

export interface PurplePhone {
	area_code: string;
	number: string;
}

export interface Card {
	bin: string;
	cardholder: Cardholder;
	date_created: Date;
	date_last_updated: Date;
	expiration_month: number;
	expiration_year: number;
	first_six_digits: string;
	id: null;
	last_four_digits: string;
}

export interface Cardholder {
	identification: Identification;
	name: string;
}

export interface Identification {
	number: null | string;
	type: null | string;
}

export interface ChargesDetail {
	accounts: Accounts;
	amounts: Amounts;
	client_id: number;
	date_created: Date;
	id: string;
	last_updated: Date;
	metadata: Metadata;
	name: string;
	refund_charges: [];
	reserve_id: null;
	type: string;
}

export interface Accounts {
	from: string;
	to: string;
}

export interface Amounts {
	original: number;
	refunded: number;
}

export interface Metadata {
	order_id: string;
	user_email: string;
	session_id: string;
}

export interface FeeDetail {
	amount: number;
	fee_payer: string;
	type: string;
}

export interface Order {
	id: string;
	type: string;
}

export interface PaymentDataPayer {
	email: string;
	entity_type: null;
	first_name: null;
	id: string;
	identification: Identification;
	last_name: null;
	operator_id: null;
	phone: FluffyPhone;
	type: null;
}

export interface FluffyPhone {
	number: null;
	extension: null;
	area_code: null;
}

export interface PaymentMethod {
	data: Data;
	id: string;
	issuer_id: string;
	type: string;
}

export interface Data {
	routing_data: RoutingData;
}

export interface RoutingData {
	merchant_account_id: string;
}

export interface PointOfInteraction {
	business_info: BusinessInfo;
	transaction_data: TransactionData;
	type: string;
}

export interface BusinessInfo {
	branch: null;
	sub_unit: string;
	unit: string;
}

export interface TransactionData {
	e2e_id: null;
}

export interface TransactionDetails {
	acquirer_reference: null;
	external_resource_url: null;
	financial_institution: null;
	installment_amount: number;
	net_received_amount: number;
	overpaid_amount: number;
	payable_deferral_period: null;
	payment_method_reference_id: null;
	total_paid_amount: number;
}
