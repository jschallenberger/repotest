import mempoolJS from "@mempool/mempool.js";
import sleep from "sleep-promise";
import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

const token = process.env.TELEGRAM_BOT_KEY;
const WALLET_DATA_FILE = 'walletData.json';

// Function to read wallet data from file
const readWalletData = () => {
  try {
    const data = fs.readFileSync(WALLET_DATA_FILE, 'utf8');
    return JSON.parse(data).wallets;
  } catch (error) {
    console.error('Error reading wallet data:', error);
    return [];
  }
};

// Function to save wallet data to file
const saveWalletData = (wallets) => {
  try {
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify({ wallets }, null, 2));
  } catch (error) {
    console.error('Error saving wallet data:', error);
  }
};

const init = async () => {
  const bot = new TelegramBot(token)//, {polling: true});
  bot.sendMessage('-4285238134',
    `Working`,
    { parse_mode: "HTML" }
  );
  var x = 1;
  var walletList = readWalletData();

  while(x != 10){
    const { bitcoin: { addresses } } = mempoolJS({
        hostname: 'mempool.space'
    });

    // Process wallets sequentially to ensure proper async handling
    for (const wallet of walletList) {
      try {
        const address = wallet.address;
        const pastCount = wallet.pastCount;
        const myAddress = await addresses.getAddress({ address });
        const txCount = myAddress.chain_stats.tx_count;

        console.log(wallet.name, wallet.pastCount, myAddress.chain_stats.tx_count);
    
        if (txCount !== pastCount){
          if (pastCount != 0) {
//          bot.sendMessage('6841505420' ,
//            `<b><u>MOVEMENT ALERT - ${ wallet.name }</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${ wallet.address }\n\n ${txCount}`,
//           { parse_mode: "HTML" }
//            );
//          bot.sendMessage('6500521034' ,
//            `<b><u>MOVEMENT ALERT - ${ wallet.name }</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${ wallet.address }`,
//            { parse_mode: "HTML" }
//            );
//          bot.sendMessage('6965044835' ,
//            `<b><u>MOVEMENT ALERT - ${ wallet.name }</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${ wallet.address }`,
//            { parse_mode: "HTML" }
//            );
            // bot.sendMessage('6500521034', `MOVEMENT ALERT ${ wallet.name } \n\n\nWallet Address: \n https://magiceden.io/runes/portfolio/${ wallet.address }`); //schallen
            bot.sendMessage('-4285238134',
              `<b><u>MOVEMENT ALERT - ${ wallet.name }</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${ wallet.address }`,
              { parse_mode: "HTML" }
            );
          }
        }
        wallet.pastCount = txCount;
      } catch (error) {
        console.error(`Error processing wallet ${wallet.name}:`, error);
      }
    }
    
    console.log(new Date().getTime());
    saveWalletData(walletList);
    await sleep(300000); // 5 minutes  
  }
};

init();
