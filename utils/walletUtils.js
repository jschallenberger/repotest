import { promises as fs } from 'fs';

const WALLET_DATA_FILE = 'walletData.json';

const loadWalletData = async () => {
    try {
        const data = await fs.readFile(WALLET_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading wallet data:', error);
        return { wallets: [] };
    }
};

const saveWalletData = async (data) => {
    try {
        await fs.writeFile(WALLET_DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving wallet data:', error);
    }
};

const updateWalletCount = async (wallet, newCount) => {
    const data = await loadWalletData();
    const walletIndex = data.wallets.findIndex(w => w.address === wallet.address);
    
    if (walletIndex !== -1) {
        data.wallets[walletIndex].pastCount = newCount;
        await saveWalletData(data);
    }
};

export {
    loadWalletData,
    saveWalletData,
    updateWalletCount
};
