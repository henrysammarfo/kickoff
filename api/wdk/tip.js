/**
 * Fan-to-fan tipping via WDK (ERC-20 USDt or native ETH fallback)
 */

export class FanTipper {
  constructor(walletInstance) {
    this.walletInstance = walletInstance;
  }

  async tip(recipientAddress, amountUsdt, note = "") {
    const account = this.walletInstance.getWallet();
    if (!account) throw new Error("Wallet not ready");

    const valid = await this.walletInstance.validateAddress(recipientAddress);
    if (!valid) throw new Error("Invalid recipient address");

    const balance = await this.walletInstance.getBalance();
    const tokenAddress = balance.tokenAddress;
    const amount = Number(amountUsdt);

    if (amount <= 0) throw new Error("Tip amount must be positive");

    // Prefer USDT if balance available
    if (balance.usdt >= amount && tokenAddress) {
      const baseUnits = BigInt(Math.round(amount * 1e6));
      if (balance.usdtRaw && BigInt(balance.usdtRaw) < baseUnits) {
        throw new Error(
          `Insufficient USDt. Have: ${balance.usdt}, Need: ${amount}`,
        );
      }

      const result = await account.transfer({
        token: tokenAddress,
        recipient: recipientAddress,
        amount: baseUnits,
      });

      return {
        success: true,
        txHash: result.hash,
        amount,
        currency: "USDt",
        recipient: recipientAddress,
        note: note || "KICKOFF tip",
        timestamp: Date.now(),
      };
    }

    // Fallback: small ETH tip on testnet for demo
    const ethAmount = BigInt(Math.round(amount * 1e14)); // ~0.0001 ETH scale demo
    const tx = await account.sendTransaction({
      to: recipientAddress,
      value: ethAmount,
    });

    return {
      success: true,
      txHash: tx.hash,
      amount,
      currency: "ETH (demo fallback — fund USDT for USDt tips)",
      recipient: recipientAddress,
      note: note || "KICKOFF tip",
      timestamp: Date.now(),
    };
  }
}
