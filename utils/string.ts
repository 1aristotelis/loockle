export function isTxid(input: string): boolean {
    // Regular expression for a Bitcoin txid (64 hexadecimal characters)
    const txidRegex = /^[0-9a-fA-F]{64}$/;
  
    // Test if input matches the regex
    const isTxid = txidRegex.test(input);
  
    return isTxid;
}