import { Ripemd160, bsv, toByteString } from "scrypt-ts";
import { Lockup } from "@/contracts/lockup";
import Bsocial from "bsocial"
import bops from "bops"
import artifact from "@/artifacts/lockup.json"

Lockup.loadArtifact(artifact)

const bsocial = new Bsocial("loockle.com")

export function buildLockupScript(address: string, blockHeight: number):string {
    const newLockup = new Lockup( Ripemd160(toByteString(address, true)), BigInt(blockHeight))

    return newLockup.lockingScript.toASM()
}

interface LockTransactionProps {
    likeTxid?: string;
    emoji?: string;
    tags?: string[]
    amount: number;
    blockHeight: number;
    address: string
}

export function buildLockTransaction({ likeTxid, emoji, tags, amount, blockHeight, address }: LockTransactionProps):bsv.Transaction{
    const tx = new bsv.Transaction
    const lockupScript = buildLockupScript(address, blockHeight)
    tx.addOutput(new bsv.Transaction.Output({ script: bsv.Script.fromASM(lockupScript), satoshis: amount}))
    if(likeTxid){
        const likeScript = bsocial.like(likeTxid, emoji || '')
        let payload
        //TODO Sign payload
        payload = likeScript.getOps('utf8')
        const script = bsv.Script.fromASM(
            "OP_0 OP_RETURN " +
            payload
              .map((str:string) => bops.to(bops.from(str, "utf8"), "hex"))
              .join(" ")
        );
        tx.addOutput(new bsv.Transaction.Output({ script: bsv.Script.fromASM(script.toASM()), satoshis: 0 }))
        //tx.addData(payload)
    }

    if(tags){
        const tagScript = bsocial.tag()
        let payload
        //TODO Sign payload
        payload = tagScript.getOps('utf8')
        const script = bsv.Script.fromASM(
            "OP_0 OP_RETURN " +
            payload
              .map((str:string) => bops.to(bops.from(str, "utf8"), "hex"))
              .join(" ")
        );
        tx.addOutput(new bsv.Transaction.Output({ script: bsv.Script.fromASM(script.toASM()), satoshis: 0 }))
        //tx.addData(payload)
    }
    return tx
    
}

export { Lockup }