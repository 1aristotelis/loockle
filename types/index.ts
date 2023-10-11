export interface RelayBroadcastResponse {
    amount: number;
    currency: string;
    identity: string;
    paymail: string; // sender paymail
    rawTx: string;
    satoshis: number;
    txid: string;
}