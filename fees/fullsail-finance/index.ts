import { CHAIN } from '../../helpers/chains';
import { SimpleAdapter, FetchOptions } from '../../adapters/types';
import fetchURL from '../../utils/fetchURL';

const fullSailApiURL = 'https://app.fullsail.finance/api/defi_llama/fees';

interface FullSailStats {
    fees_usd: string;
    protocol_revenue_usd: string;
}

const fetch = async (options: FetchOptions) => {
    const url = `${fullSailApiURL}?start_timestamp=${options.startTimestamp * 1000}&end_timestamp=${options.endTimestamp * 1000}`;
    const data: FullSailStats = await fetchURL(url);

    const dailyFees = data.fees_usd;
    const dailyProtocolRevenue = data.protocol_revenue_usd;

    return {
        dailyFees,
        dailyUserFees: dailyFees,
        dailyRevenue: dailyProtocolRevenue,
        dailyProtocolRevenue,
    };
};

const methodology = {
    Fees: 'Dynamic swap fees generated by the swap transactions on FullSail finance.',
    Revenue: 'Protocol fees charged from the swap fees.',
    ProtocolRevenue: 'Protocol fees charged from the swap fees.',
};

const adapter: SimpleAdapter = {
    version: 2,
    adapter: {
        [CHAIN.SUI]: {
            fetch,
            start: '2025-05-30',
            meta: { methodology },
        },
    },
};

export default adapter;
