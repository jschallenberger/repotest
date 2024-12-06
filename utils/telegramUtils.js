const TELEGRAM_CHAT_ID = '-4285238134';

const messageTemplates = {
    regularMovement: (walletName, walletAddress) => ({
        text: `<b><u>MOVEMENT ALERT - ${walletName}</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${walletAddress}?tab=activity`,
        options: { parse_mode: "HTML" }
    }),
    
    runeMovement: (walletName, walletAddress, runeName) => ({
        text: `<b><u>MOVEMENT ALERT - ${walletName} - ${runeName}</u></b> \n\nWallet Address:\n https://magiceden.io/runes/portfolio/${walletAddress}?tab=activity`,
        options: { parse_mode: "HTML" }
    })
};

const sendTelegramAlert = async (bot, template) => {
    try {
        await bot.sendMessage(TELEGRAM_CHAT_ID, template.text, template.options);
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
};

export {
    messageTemplates,
    sendTelegramAlert
};
