import axios from "axios"
export async function getCurrentBlock() {
    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/chain/info`)
    return data?.blocks
}