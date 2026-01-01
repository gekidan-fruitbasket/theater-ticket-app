import liff from '@line/liff';

export const initLiff = async () => {
    try {
        const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID;
        if (!liffId) {
            throw new Error('NEXT_PUBLIC_LINE_LIFF_ID is not defined');
        }
        await liff.init({ liffId });
        return liff;
    } catch (error) {
        console.error('LIFF initialization failed', error);
        throw error;
    }
};
