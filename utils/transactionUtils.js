const getRecentTransactions = async (addresses, address, timeWindowMinutes = 60) => {
    try {
        const addressTxs = await addresses.getAddressTxs({ address });
        
        // Get current time in seconds since epoch
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const timeWindowAgo = currentTime - (timeWindowMinutes * 60);

        // Ensure we have transactions and they're in an array
        if (!Array.isArray(addressTxs)) {
            console.log('No transactions found or invalid response format');
            return [];
        }

        const recentTxs = addressTxs.filter(tx => {
            const txTime = tx.status.block_time;
            const isRecent = tx.status && txTime && txTime >= timeWindowAgo;
            
            if (isRecent) {
                console.log(`\nIncluding transaction ${tx.txid}:`);
                console.log(`Transaction time: ${txTime} (${new Date(txTime * 1000).toISOString()})`);
                console.log(`Time difference: ${(currentTime - txTime) / 60} minutes`);
            }
            return isRecent;
        });

        console.log(`\nFound ${recentTxs.length} transactions within time window`);
        return recentTxs;
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        return [];
    }
};

const processTransactions = async (bot, wallet, recentTxs, { isRuneTransaction, getRuneDetails, messageTemplates, sendTelegramAlert }) => {
    if (!Array.isArray(recentTxs) || recentTxs.length === 0) {
        console.log(`No recent transactions to process for wallet ${wallet.name}`);
        return;
    }

    console.log(`\nProcessing ${recentTxs.length} transactions for wallet ${wallet.name}`);

    for (const tx of recentTxs) {
        try {
            console.log(`\nAnalyzing transaction ${tx.txid}`);
            const isRune = isRuneTransaction(tx);
            console.log(`Is Rune transaction: ${isRune}`);

            if (isRune) {
                console.log(`Fetching Rune details for transaction ${tx.txid}...`);
                const runeName = await getRuneDetails(tx.txid);
                if (runeName) {
                    console.log(`Found Rune: ${runeName}`);
                    console.log(`Sending Rune movement alert for ${runeName}`);
                    await sendTelegramAlert(bot, messageTemplates.runeMovement(wallet.name, wallet.address, runeName));
                } else {
                    console.log('Sending regular movement alert (Rune not found)');
                    await sendTelegramAlert(bot, messageTemplates.regularMovement(wallet.name, wallet.address));
                }
            } else {
                console.log('Sending regular movement alert');
                await sendTelegramAlert(bot, messageTemplates.regularMovement(wallet.name, wallet.address));
            }
        } catch (error) {
            console.error(`Error processing transaction ${tx.txid}:`, error);
        }
    }
};

export {
    getRecentTransactions,
    processTransactions
};
