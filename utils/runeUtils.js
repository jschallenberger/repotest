const isRuneTransaction = (tx) => {
    return tx.vout.some(out => out.scriptpubkey_type === "op_return") && 
           tx.vout.filter((out, _, arr) => {
               // Find outputs with same value and same scriptpubkey type
               const sameValueOutputs = arr.filter(o => 
                   o.value === out.value && 
                   o.scriptpubkey_type === out.scriptpubkey_type
               );
               return sameValueOutputs.length > 1;
           }).length > 0;
};

const getRuneDetails = async (txid) => {
    try {
        const runeResponse = await fetch(`https://api.hiro.so/runes/v1/transactions/${txid}/activity`);
        const runeData = await runeResponse.json();
        
        if (runeData.results && runeData.results.length > 0) {
            return runeData.results[0].rune.spaced_name;
        }
        return null;
    } catch (error) {
        console.error('Error fetching rune data:', error);
        return null;
    }
};

export {
    isRuneTransaction,
    getRuneDetails
};
