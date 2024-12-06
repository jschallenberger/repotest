import mempoolJS from '@mempool/mempool.js';

const initializeMempoolService = () => {
    try {
        const { bitcoin: { addresses } } = mempoolJS({
            hostname: 'mempool.space'
        });
        return addresses;
    } catch (error) {
        console.error('Error initializing mempool service:', error);
        throw error;
    }
};

export {
    initializeMempoolService
};
