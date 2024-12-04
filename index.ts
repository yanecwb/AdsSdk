import initAdsGram from "./src/AdsGram";
import initAdsTonAi from "./src/TonAi";
import initAdsOpen from "./src/OpenAd";
import initAdsOutLink from "./src/OutLink";
import { AdsType, InstanceAdsType } from "./index.d";

export const loadScript = async (scrArrParams: Array<any>) => {
  const insertScript = (src: string, attribute: Record<string, any> = {}) =>
    new Promise((resolve: any, reject: any) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      Object.entries(attribute).forEach(([key, value]) => {
        script.setAttribute(key, value as string);
      });
      script.onload = () => resolve("");
      script.onerror = () =>
        reject(new Error(`Script load error for ${src}`));
      document.head.appendChild(script);
    });
  const srcArr = scrArrParams?.map((s) =>
    insertScript(s.src, s.attribute || {})
  );
  return Promise.all(srcArr);
};

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

const entryAds = async (fixedType: AdsType,debug=false) => {
const w = window as any;
  const randomADS: AdsType = weightedRandom(
    ["adsGram", "openAd", "tonai", "outLink"],
    [5, 3, 2]
  );

  const showAdWithCallbacks = async ({
    onAdShow,
    onAdClick,
    onAdComplete,
    adTaskFunction,
    setZIndex = true,
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
        (
          document.querySelector(".openADJsSDKInteractive") as HTMLElement
        ).style.zIndex = "999999999";
      }
    });

    return await completeAds;
  };

  let instanceAds: InstanceAdsType = {};

  switch (fixedType || randomADS) {
    case "adsGram":
      const AdController = await initAdsGram(debug);

      instanceAds.show = async ({ onAdShow, onAdClick, onAdComplete } = {}) => {
        const onStart = () => {
          onAdShow && onAdShow();
          // Unbind
          AdController.removeEventListener("onStart", onStart);
        };

        // bind
        AdController.addEventListener("onStart", onStart);
        const { done } = await AdController?.show();
        if (done) {
          onAdComplete && onAdComplete();
          return true;
        }else{
          entryAds('outLink')
        }
      };
      break;

    case "openAd":
      await initAdsOpen();
      const res = await w.getOpenAdTaskAds();
      if (res) {
        instanceAds.show = async ({
          onAdShow,
          onAdClick,
          onAdComplete,
        } = {}) => {
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
      const { ads, TonAdPopupShow }: any = await initAdsTonAi(debug);
      if (ads?.length) {
        instanceAds.show = async ({
          onAdShow,
          onAdClick,
          onAdComplete,
        } = {}) => {
          return showAdWithCallbacks({
            onAdShow,
            onAdClick,
            onAdComplete,
            adTaskFunction: (params: any) =>
              TonAdPopupShow({
                tonAd: ads[0],
                countdown: 10,
                onAdShow: params.adOpened,
                onAdClick: params.adClick,
                onAdComplete: params.adTaskFinished,
              }),
            setZIndex: false,
          });
        };
      } else {
        instanceAds = await entryAds("adsGram");
      }
      break;
    case "outLink":
      instanceAds.show = async ({ onAdShow, onAdClick, onAdComplete } = {}) => {
        await initAdsOutLink();
        onAdShow && onAdShow();
        return await new Promise((resolve) => {
          const timer = setInterval(() => {
            if (w.outAdsCountEnd) {
              if (w.outAdsClick) {
                onAdClick && onAdClick();
                onAdComplete && onAdComplete();
                resolve(true);
              } else {
                resolve(false);
              }
              clearInterval(timer);
            }
          }, 100);
        });
      };
  }

  return instanceAds;
};

(() => {
  //Prevent server-side rendering
  const timer = setInterval(() => {
    const w = window as any;
    if (w) {
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
// };
// export default index;
