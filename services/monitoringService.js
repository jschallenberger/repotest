import { getRecentTransactions, processTransactions } from '../utils/transactionUtils.js';
import { updateWalletCount } from '../utils/walletUtils.js';

const monitorWallet = async (addresses, bot, wallet, utils, timeWindowMinutes) => {
    try {
        const addressData = await addresses.getAddress({ address: wallet.address });
        
        if (!addressData || !addressData.chain_stats) {
            console.error(`Invalid address data for wallet ${wallet.name}`);
            return false;
        }

        const txCount = addressData.chain_stats.tx_count;
        console.log(`Current tx count for ${wallet.name}: ${txCount}`);
        console.log(`Past tx count for ${wallet.name}: ${wallet.pastCount}`);
        if (txCount <= wallet.pastCount) {
            console.log(`No new transactions found for wallet ${wallet.name}`);
            return false;
        }
        console.log(`Checking recent transactions for ${wallet.name}...`);
        const recentTxs = await getRecentTransactions(addresses, wallet.address, timeWindowMinutes);
        if (recentTxs.length > 0) {
            await processTransactions(bot, wallet, recentTxs, utils);
        }
        
        await updateWalletCount(wallet, txCount);
        return true;
    } catch (error) {
        console.error(`Error monitoring wallet ${wallet.name}:`, error);
        return false;
    }
};

const startMonitoring = async (addresses, bot, wallets, utils, timeWindowMinutes) => {
    console.log(`Starting monitoring for ${wallets.length} wallets...`);
    for (const wallet of wallets) {
        await monitorWallet(addresses, bot, wallet, utils, timeWindowMinutes);
    }
};

export {
    startMonitoring
};
