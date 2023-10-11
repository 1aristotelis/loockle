import axios from "axios"
import { hexToBase58 } from "./string";
import { ripemd160, sha256 } from "scrypt-ts";
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
        const output = data.output
        const address = hexToBase58("00"+sha256(output))
        console.log(address)
        return address
    } catch (error) {
        console.log(error)
        throw error
   
    }
}