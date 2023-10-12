import axios from "axios"
import { hexToBase58 } from "./string";
import { bsv, ripemd160, sha256 } from "scrypt-ts";
export async function getAddressByPaymail(paymail: string){
    let now = JSON.stringify({'now': new Date()});
    const requestData = {
        senderHandle: paymail,
        dt: now
    }
    try {
        const { data } = await axios.post(`https://relayx.io/bsvalias/address/${paymail}`, requestData, {
            headers: {
                'Content-Type': 'application/json',
              },
        })
        const output: string = data.output
        const hash = output.substring(6,46)
        const address = bsv.Address.fromPublicKeyHash(Buffer.from(hash,"hex")).toString()
        return address
    } catch (error) {
        console.log(error)
        throw error
   
    }
}