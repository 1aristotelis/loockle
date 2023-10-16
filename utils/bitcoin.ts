import { bsv } from "scrypt-ts";

export function getUTXO(rawtx: string, idx: number){
    const bsvtx = new bsv.Transaction(rawtx)
    return {
        satoshis: bsvtx.outputs[idx].satoshis,
        vout: idx,
        txid: bsvtx.hash,
        script: bsvtx.outputs[idx].script.toHex()
    }
}