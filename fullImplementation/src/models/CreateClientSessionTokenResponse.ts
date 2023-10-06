export interface CreateClientSessionTokenResponse {
    clientTransactionUniqueReference: string;
    clientToken: string;
    clientTokenExpirationDate: string;
    traceId: string;
}
