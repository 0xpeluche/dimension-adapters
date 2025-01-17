import ADDRESSES from '../../helpers/coreAssets.json'
import { FetchResult, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { gql, request } from "graphql-request";
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";
import * as sdk from "@defillama/sdk";

interface IGraph {
	volumeEth: string;
	volumeUsdc: string;
	id: string;
}

const URL = 'https://api.studio.thegraph.com/query/84618/spacewhale1/0.0.5';
const fetch = async (timestamp: number): Promise<FetchResult> => {
	const dayTimestamp = getUniqStartOfTodayTimestamp(new Date(timestamp * 1000));
	const chain = CHAIN.ARBITRUM;
	const balances = new sdk.Balances({ chain, timestamp })
	const query = gql`
    {
			dayData(id: ${dayTimestamp * 1000}) {
				volumeEth
				volumeUsdc
			}
		}`;
	const response: IGraph = (await request(URL, query)).dayData;
	const element = response;
	balances._add(ADDRESSES.arbitrum.USDC_CIRCLE, element.volumeUsdc);
	balances._add(ADDRESSES.arbitrum.WETH, element.volumeEth);

	return {
		dailyVolume: await balances.getUSDString(),
		timestamp: dayTimestamp,
	};
}

const adapter: SimpleAdapter = {
	adapter: {
		[CHAIN.ARBITRUM]: {
			fetch: fetch,
			start: '2024-04-03',
		},
	},
};

export default adapter;
