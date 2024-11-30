// import {
//   load,
//   onImpressions,
//   getOpenAdBannerAds,
//   generateOpenAd,
//   getOpenAdTaskAds,
// } from "./src/OpenAd/index.ts";
import initAdsGram from "./src/AdsGram";
import initAdsTonAi from "./src/TonAi";
import initAdsOpen from "./src/OpenAd";
import { AdsType, InstanceAdsType } from "./index.d";
const w = window as any;
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

// const AdsMap = {
//   adsGram: {},
//   openAd: {
//     loadBannerAds: getOpenAdBannerAds,
//   },
//   tonai: {},
// };
// const dynamicsEvent = (type: AdsType) => {
//   return onImpressions;
// };
const getDynamicsEvent = (show, click) => {
  (window as any).dynamicsEvent = { show, click };
};

// const loadBannerAds = () => AdsMap["openAd"].loadBannerAds();

const entryAds = async (fixedType: AdsType) => {
  const randomADS: AdsType = weightedRandom(
    ["adsGram", "openAd", "tonai"],
    [5, 3, 2]
  );
  
  const showAdWithCallbacks = async ({
    onAdShow,
    onAdClick,
    onAdComplete,
    adTaskFunction,
    setZIndex = true
  }: {
    onAdShow?: Function;
    onAdClick?: Function;
    onAdComplete?: Function;
    adTaskFunction: Function;
    setZIndex?: boolean;
  }) => {
    let completeAds = new Promise<boolean>((resolve) => {
      adTaskFunction({
        adOpened: (e: any) => {
          onAdShow && onAdShow();
        },
        adClick: (e: any) => {
          onAdClick && onAdClick();
        },
        adTaskFinished: (e: any) => {
          onAdComplete && onAdComplete();
          resolve(true);
        },
      });
      
      if (setZIndex) {
        (document.querySelector(".openADJsSDKInteractive") as HTMLElement).style.zIndex = "999999999";
      }
    });
    
    return await completeAds;
  };

  let instanceAds: InstanceAdsType = {};

  switch (fixedType || randomADS) {
    case "adsGram":
      const AdController = await initAdsGram();
   
      instanceAds.show = async ({ onAdShow, onAdClick, onAdComplete } = {}) => {
        const onStart = ()=>{
          onAdShow && onAdShow();
          AdController.removeEventListener('onStart',onStart);
        }
        // Unbind first
        
        // bind
        AdController.addEventListener('onStart',onStart)
        const { done } = await AdController?.show();
        if (done) {
          onAdComplete && onAdComplete()
          return true;
        }
      };
      break;
      
    case "openAd":
      await initAdsOpen();
      const res = await w.getOpenAdTaskAds();
      if (res) {
        instanceAds.show = async ({ onAdShow, onAdClick, onAdComplete } = {}) => {
          return showAdWithCallbacks({
            onAdShow,
            onAdClick,
            onAdComplete,
            adTaskFunction: w.generateOpenAd,
          });
        };
      } else {
        instanceAds = await entryAds("adsGram");
      }
      break;

    case "tonai":
      const { ads, TonAdPopupShow }: any = await initAdsTonAi();
      if (ads?.length) {
        instanceAds.show = async ({ onAdShow, onAdClick, onAdComplete } = {}) => {
          return showAdWithCallbacks({
            onAdShow,
            onAdClick,
            onAdComplete,
            adTaskFunction: (params: any) => TonAdPopupShow({
              tonAd: ads[0],
              countdown: 10,
              onAdShow: params.adOpened,
              onAdClick: params.adClick,
              onAdComplete: params.adTaskFinished
            }),
            setZIndex: false
          });
        };
      } else {
        instanceAds = await entryAds("adsGram");
      }
      break;
  }
  
  return instanceAds;
};


(() => {
  //Prevent server-side rendering
  const timer = setInterval(() => {
    if (window) {
      w.initAdsGram = initAdsGram;
      w.initAdsTonAi = initAdsTonAi;
      w.initAdsOpen = initAdsOpen;
      w.entryAds = entryAds;
      clearInterval(timer);
    }
  }, 100);
})();
// export const index = {
//   // loadBannerAds,
//   // load,
//   // dynamicsEvent,
//   // generateOpenAd,
//   // getOpenAdTaskAds,
//   getDynamicsEvent,
// };
// export default index;
