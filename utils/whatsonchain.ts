import axios from "axios"

export async function getCurrentBlock() {
    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/chain/info`)
    return data?.blocks
}

export async function getRawTx(txid:string){
    const r = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`);
    const raw = await r.text();
    return raw;
}

export async function broadcastTx(txhex:string){
    try {
        const { data } = await axios.post(`https://api.whatsonchain.com/v1/bsv/main/tx/raw`, {
            txhex
        })

        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}