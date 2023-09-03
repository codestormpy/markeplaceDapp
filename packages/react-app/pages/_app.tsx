import type { AppProps } from "next/app";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, omniWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { configureChains, createClient, WagmiConfig } from "wagmi";
import celoGroups from "@celo/rainbowkit-celo/lists";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
// import react toastify
import { ToastContainer } from "react-toastify"
// import known wallets 
import { Valora, CeloWallet } from "@celo/rainbowkit-celo/wallets"

const projectId = "5d4de603258d72c931e328e82fc2bc95" // get one at https://cloud.walletconnect.com/app

const { chains, provider } = configureChains(
    [Alfajores, Celo],
    [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }) }) ]
);



const connectors = connectorsForWallets([
    {
        groupName: "Recommended with Celo",
        wallets: [
            Valora({ projectId , chains}),
            CeloWallet({ projectId, chains }),
            metaMaskWallet({ chains }),
            omniWallet({ chains }),
            walletConnectWallet({ chains })
        ],
    },
])

const appInfo = {
    appName: " Celo MarketPlace",
};

const wagmiConfig = createClient({
    autoConnect: true,
    connectors,
    provider: provider,
});

function App({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                appInfo={appInfo}
                coolMode={true}
            >
                 <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default App;
