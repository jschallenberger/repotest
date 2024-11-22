import mempoolJS from "@mempool/mempool.js";
import sleep from "sleep-promise";
import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_KEY;

const init = async () => {
  const bot = new TelegramBot(token)//, {polling: true});
  bot.sendMessage('-4285238134' ,
    `Workin`,
    { parse_mode: "HTML" }
    );
  var x = 1;
  var walletList = [
    {address:'bc1prxkfmpxq23vkfglu6wn9a4k6zwdw5jjew8v7qqgjxut35zacyqpsvkrmrr', name:'Shin', pastCount: 0},
//    {address:'bc1pansakzmn6x0j54u4dw4ctak626zj4a67lsh8pcmyhujdercwzqusa74s4v', name:'Chartfu', pastCount: 0},
//    {address:'bc1prlukv7lkaedmg7a0hdmfce30tr7vu78k2dycggdevqr8szz0hzdswlm49q', name:'Kook', pastCount: 0},
//    {address:'bc1pru42pw6d8u0k09q9efktept0cymvhygjvrdlw39h83gflpzjct2qc6z9q8', name:'Bweys', pastCount: 0},
//    {address:'bc1pn793eu2vn9agqlfvz5ym88lk7huatvjvl4ku5ka6zyawn9wggzssv5n2ky', name:'OG General', pastCount: 0},
//    {address:'bc1pq596l0778dnx8hsm6caehrey4f6jgw0f4sklg8m6dmcxvx4p2qvqvxnmky', name:'Augosto Bagos', pastCount: 0},
    {address:'bc1prxkfmpxq23vkfglu6wn9a4k6zwdw5jjew8v7qqgjxut35zacyqpsvkrmrr', name:'Shin ALTERNATIVE', pastCount: 0},
  ];

  while(x != 10){
    const { bitcoin: { addresses } } = mempoolJS({
        hostname: 'mempool.space'
    });

    walletList.forEach(async function (wallet){
      const address = wallet.address
      const pastCount = wallet.pastCount
      const myAddress = await addresses.getAddress({ address });
      const txCount = myAddress.chain_stats.tx_count

      console.log(wallet.name, wallet.pastCount, myAddress.chain_stats.tx_count)

    
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
          bot.sendMessage('-4285238134' ,
            `<b><u>MOVEMENT ALERT - ${ wallet.name }</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${ wallet.address }`,
            { parse_mode: "HTML" }
            );
        }
      }
      wallet.pastCount = txCount;
    })
    console.log(new Date().getTime())
    await sleep(300000);   
  }
};

init();
