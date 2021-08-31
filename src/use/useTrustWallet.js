import QRCodeModal from "@walletconnect/qrcode-modal"
import WalletConnect from "@walletconnect/client"

export default function useTrustWallet(nft) {
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
    });

    if (!connector.connected) {
        connector.createSession();
    }

    connector.on("connect", (error) => {
        if (error) {
            throw error;
        }

        const request = connector._formatRequest({
            method: 'get_accounts',
        });

        connector
            ._sendCallRequest(request)
            .then(async result => {
                return await createTransaction(connector, result, nft)
            })
            .catch(error => {
                console.error(error);
            });
    })
}

function createTransaction(connector, accounts, nft) {
    const network = 461; // Filecoin network
    const account = accounts.find((account) => account.network === network);
    const tx = {
        sendCoinsMessage: {
            fromAddress: account.address,
            toAddress: nft.fil_address,
            amounts: [
                {
                    denom: "filecoin",
                    amount: "1"
                }
            ]
        }
    }

    const request = connector._formatRequest({
        method: 'trust_signTransaction',
        params: [
            {
                network,
                transaction: JSON.stringify(tx),
            },
        ],
    });

    connector
        ._sendCallRequest(request)
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        });
}
