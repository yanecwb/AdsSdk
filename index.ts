import "./index.d.ts";
import { load, onImpressions, getOpenAdBannerAds,generateOpenAd,getOpenAdTaskAds } from "./src/OpenAd/index.ts";
function weightedRandom(arr: Array<AdsType>, weights: Array<number>): AdsType {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  const random = Math.random() * totalWeight;
  let weightSum = 0;

  for (let i = 0; i < weights.length; i++) {
    weightSum += weights[i];
    if (random < weightSum) {
      return arr[i];
    }
  }
  return "adsGram";
}

const randomADS:AdsType = weightedRandom(["adsGram", "openAd", "tonai"], [5, 3, 2]);

const AdsMap = {
    adsGram:{

    },
    openAd:{
        loadBannerAds:getOpenAdBannerAds
    },
    tonai:{}
}
const dynamicsEvent = (type: AdsType) => {
  return onImpressions;
};
const getDynamicsEvent = (show, click) => {
  (window as any).dynamicsEvent = { show, click };
};

const loadBannerAds = ()=> AdsMap['openAd'].loadBannerAds()

export const index = {
  loadBannerAds,
  load,
  dynamicsEvent,
  generateOpenAd,
  getOpenAdTaskAds,
  getDynamicsEvent,
};
export default index;
