import { bsv } from 'scrypt-ts';

import bops from "bops";

export default abstract class Wallet {

  paymail: string | undefined;

  name: string = 'abstract';

  abstract createTransaction({ outputs }: { outputs: bsv.Transaction.Output[] }): Promise<bsv.Transaction>;

  buildOpReturnScript(dataPayload: string[]): bsv.Script {

    const script = bsv.Script.fromASM(
      "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
    );

    return script

  }

}
