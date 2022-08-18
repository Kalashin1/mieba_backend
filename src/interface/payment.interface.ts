export interface Payment {
  name: string;
  email: string;
  amount: number;
  phoneNumber: string;
  reference?: string;
  authorization_url?: string;
  status?: string;
  _id?: string;
  crearedAt?: string;
  plan?: string;
  updatedAt?: string;
}

export interface CreateTransactionPayload {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface Authorization {
  authorization_code: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bin: string;
  bank: string;
  channel: string;
  signature: string;
  reusable: string;
  country_code: string;
  account_name: string;
}

export interface Customer {
  id: string;
  customer_code: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface VerifyTransactionPayload {
  status: boolean;
  message: string;
  data: {
    amount: number;
    transaction_date: string;
    status: string;
    reference: string;
    channel: string;
    authorization: Authorization;
    customer: Customer;
    plan: string;
  };
}
