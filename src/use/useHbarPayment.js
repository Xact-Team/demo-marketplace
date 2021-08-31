import {TransferTransaction, Status, Hbar} from "@hashgraph/sdk"
import {hederaClient} from "@/service/HederaService"

export async function toCentralAccount(nft, user, priceInHbar) {
    let middleMan = middlemanAccount(user)
    let client = hederaClient(user.account_id, user.private_key, user.network)

    return await transferTransaction(
        user.account_id,
        middleMan.account_id,
        priceInHbar,
        client
    )
}

export async function toSellerAccount(nft, user, priceInHbar) {
    let middleMan = middlemanAccount(user)
    let client = hederaClient(middleMan.account_id, middleMan.private_key, user.network)

    return await transferTransaction(
        middleMan.account_id,
        nft.user_id,
        priceInHbar,
        client
    )
}

async function transferTransaction(
    fromAccountId,
    toAccountId,
    amount,
    client
) {
    let response = await new TransferTransaction()
        .addHbarTransfer(fromAccountId, new Hbar(-amount))
        .addHbarTransfer(toAccountId, new Hbar(amount))

    let txResponse = await response.execute(client)
    let receipt = await txResponse.getReceipt(client)

    return {
        txId: txResponse.transactionId.toString(),
        status: receipt.status === Status.Success
    }
}

function middlemanAccount(user) {
    if (user.network === 'testnet') {
        return {
            account_id: process.env.VUE_APP_MIDDLEMAN_TESTNET_ACCOUNT,
            private_key: process.env.VUE_APP_MIDDLEMAN_TESTNET_PRIVATE
        }
    } else {
        return {
            account_id: process.env.VUE_APP_MIDDLEMAN_MAINNET_ACCOUNT,
            private_key: process.env.VUE_APP_MIDDLEMAN_MAINNET_PRIVATE
        }
    }
}