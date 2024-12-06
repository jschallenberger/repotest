import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { messageTemplates, sendTelegramAlert } from './utils/telegramUtils.js';
import { isRuneTransaction, getRuneDetails } from './utils/runeUtils.js';
import { loadWalletData } from './utils/walletUtils.js';
import { initializeMempoolService } from './services/mempoolService.js';
import { startMonitoring } from './services/monitoringService.js';

const MONITORING_INTERVAL = 300000; // 5 minutes
const TIME_WINDOW_MINUTES = 15; // Look back 15 minutes for transactions

async function runMonitoring(bot, addresses, utils) {
    try {
        const { wallets } = await loadWalletData();
        if (!wallets || wallets.length === 0) {
            console.log('No wallets found to monitor');
            return;
        }
        console.log(`\nMonitoring ${wallets.length} wallets...`);
        await startMonitoring(addresses, bot, wallets, utils);
    } catch (error) {
        console.error('Error in monitoring loop:', error);
    }
}

async function init() {
    try {
        // Initialize services
        const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: false });
        const addresses = initializeMempoolService();

        // Utility functions bundle for monitoring
        const utils = {
            isRuneTransaction,
            getRuneDetails,
            messageTemplates,
            sendTelegramAlert
        };

        console.log('Starting monitoring service...');
        console.log(`Monitoring interval: ${MONITORING_INTERVAL}ms`);
        console.log(`Time window: ${TIME_WINDOW_MINUTES} minutes`);

        // Run immediately
        await runMonitoring(bot, addresses, utils);

        // Then start interval
        setInterval(() => runMonitoring(bot, addresses, utils), MONITORING_INTERVAL);

        console.log('Monitoring service started successfully');
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
}

init();
