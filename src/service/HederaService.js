import {
    TokenCreateTransaction,
    TransferTransaction,
    StatusError,
    Client,
    Status,
    Hbar, PrivateKey
} from "@hashgraph/sdk"

export function hederaClient(account_id, private_key, network) {
    let client = network === 'testnet'
        ? Client.forTestnet()
        : Client.forMainnet()

    return client.setOperator(account_id, private_key)
}

export async function createToken(form, user, symbol) {
    try {
        let client = hederaClient(user.account_id, user.private_key)

        let tx = await new TokenCreateTransaction()
            .setTokenName(form.name)
            .setTokenSymbol(symbol)
            .setDecimals(0)
            .setInitialSupply(parseInt(form.supply))
            .setTreasuryAccountId(user.account_id)
            .setAutoRenewAccountId(user.account_id)
            .setAutoRenewPeriod(7776000)
            .signWithOperator(client)

        let response = await tx.execute(client)
        let receipt = await response.getReceipt(client)

        if (receipt.status === Status.Success) {
            return response.transactionId.toString()
        }

        return false
    } catch (err)
    {
        return false
    }
}

export async function transferToken(buyerId, middleman, tokenId) {
    let client = hederaClient(middleman.account_id, middleman.private_key, middleman.network)

    let tx = await new TransferTransaction()
        .addTokenTransfer(tokenId, middleman.account_id, -1)
        .addTokenTransfer(tokenId, buyerId, 1)
        .freezeWith(client)

    const sigKey = await PrivateKey.fromString(middleman.private_key)
    let signTx = await tx.sign(sigKey)
    let txRes = await signTx.execute(client)
    let receipt = await txRes.getReceipt(client)
    return receipt.status === Status.Success
}

export async function testClientOperatorMatch(options) {
    const tx = new TransferTransaction()
        .addHbarTransfer(options.account_id, Hbar.fromTinybars(0))
        .setMaxTransactionFee(Hbar.fromTinybars(1));

    try {
        await tx.execute(hederaClient(options.account_id, options.private_key, options.network));
    } catch (err) {
        if (err instanceof StatusError) {
            if (
                err.status === Status.InsufficientTxFee ||
                err.status === Status.InsufficientPayerBalance
            ) {
                return true;
            }
            return false;
        }
        throw err;
    }

    throw new Error(
        "unexpected success of intentionally-erroneous transaction to confirm account ID"
    );
}
