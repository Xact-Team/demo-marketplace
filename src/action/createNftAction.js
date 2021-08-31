import {ClientNFT} from "@xact-wallet-sdk/nft"

export default async function createNftAction(user, form) {
    let hederaAccount = {
      accountId: user.value.account_id,
      privateKey: user.value.private_key,
      environment: user.value.network
    }
    let client = new ClientNFT({
      hederaAccount,
      nftStorageApiKey: process.env.VUE_APP_NFT_STORAGE_API_KEY
    })
    let nft = {
      name: form.name,
      description: form.description,
      category: form.category,
      creator: user.value.name,
      media: form.asset,
      supply: form.supply,
    }

    return await client.create({...nft})
}