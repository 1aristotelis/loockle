import { Ripemd160, bsv, toByteString } from "scrypt-ts";
import { Lockup } from "@/contracts/lockup";
import Bsocial from "bsocial"
import bops from "bops"
import artifact from "@/artifacts/lockup.json"
import { getRawTx } from "./whatsonchain";
import { getUTXO } from "./bitcoin";
import { hex2Int } from "./string";

Lockup.loadArtifact(artifact)

const bsocial = new Bsocial("loockle.com")

export function buildLockupScript(address: string, blockHeight: number):string {
    const p2pkhOut = new bsv.Transaction.Output({ script: new bsv.Script(new bsv.Address(address)), satoshis:1 })
    const addressHex = p2pkhOut.script.chunks[2].buf.toString("hex")
    console.log("address hex", addressHex)
    const newLockup = new Lockup( addressHex as Ripemd160, BigInt(blockHeight))

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

interface BuildUnlockScriptProps {
    txHex: string;
    inputIndex: number;
    lockTokenScript: string;
    satoshis: number;
    privkey: bsv.PrivateKey;
}

const buildUnlockLockScript = ({ txHex, inputIndex, lockTokenScript, satoshis, privkey }: BuildUnlockScriptProps) => {
    const tx = new bsv.Transaction(txHex);
    const sighashType = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
    const scriptCode = bsv.Script.fromHex(lockTokenScript);
    const value = new bsv.crypto.BN(satoshis);
    // create preImage of current transaction with valid nLockTime
    const preimg = bsv.Transaction.Sighash.sighashPreimage(tx, sighashType, inputIndex, scriptCode, value).toString('hex');
    let s;
    if (privkey) {// sign transaction with private key tied to public key locked in script
        s = bsv.Transaction.Sighash.sign(tx, privkey, sighashType, inputIndex, scriptCode, value).toTxFormat();
    }
    return bsv.Script.fromASM(`${s!.toString('hex')} ${privkey.toPublicKey().toHex()} ${preimg}`).toHex();
}

interface UnlockTransactionProps {
    txid: string;
    oIdx?: number;
    receiveAddress: string;
    privkey: bsv.PrivateKey;
}

export async function buildUnlockTransaction({ txid, receiveAddress, privkey, oIdx = 0 }: UnlockTransactionProps): Promise<{ redeemTx: string, satoshisUnlocked: number }>{
    try {
        const rawtx = await getRawTx(txid)
        const lockedUTXO = getUTXO(rawtx, oIdx)
        const bsvTx = new bsv.Transaction()
        const lockedScript = new bsv.Script(lockedUTXO.script)
        bsvTx.addInput(new bsv.Transaction.Input({
            prevTxId: txid,
            outputIndex: oIdx,
            script: new bsv.Script("")
        }), lockedScript, lockedUTXO.satoshis)
        const lockedBlockHex = lockedScript.chunks[18].buf.toString("hex");
        const lockedBlock = hex2Int(lockedBlockHex);
        bsvTx.lockUntilBlockHeight(lockedBlock);
        bsvTx.to(receiveAddress, lockedUTXO.satoshis - 1); // subtract 1 satoshi to pay the transaction fee
        const solution = buildUnlockLockScript({ txHex: bsvTx.toString(), inputIndex: oIdx, lockTokenScript: lockedUTXO.script, satoshis: lockedUTXO.satoshis, privkey })
        bsvTx.inputs[0].setScript(new bsv.Script(solution));
        return {
            redeemTx: bsvTx.toString(),
            satoshisUnlocked: lockedUTXO.satoshis
        };
    } catch (error) {
        console.error(error)
        throw error
        
    }
}

export { Lockup }