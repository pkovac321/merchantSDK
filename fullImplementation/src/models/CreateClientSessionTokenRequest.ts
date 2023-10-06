export interface CreateClientSessionTokenRequest {
    customer: Customer;
    paymentDetails: PaymentDetails;
    amount: Amount;
    clientTransactionUniqueReference: string;
}

export interface Customer {
    emailAddress: string;
    billingAddress: {
        firstName: string;
        lastName: string;
        postalCode: string;
        street: string[];
        countryCode: string;
        suburb: string;
        state: string;
    };
}

export interface Amount {
    currencyAmount: string;
}

export interface PaymentDetails {
    cardType: string;
    description: string;
    saveOnSuccess: boolean;
}
