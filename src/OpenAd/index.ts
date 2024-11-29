interface CallbackFunc {
  /**
    Indicates loading advertising resources from the platform. If the publisher's slot/area does not have any resources to load, false will be returned
  */
  adResourceLoad?: (e: boolean) => void;
  /**
   Indicates that the interactive advertisement is currently open
  */
  adOpening?: (e: boolean) => void;
  /**
   Indicates that the interactive advertisement has been opened
  */
  adOpened?: (e: boolean) => void;
  /**
   Indicates completion of interactive advertising task, which is defined by the traffic owner
  */
  adTaskFinished?: (e: boolean) => void;
  /**
   Indicates that interactive advertising is being closed
  */
  adClosing?: (e: boolean) => void;
  /**
   Indicates that interactive advertising has been turned off
  */
  adClosed?: (e: "viewAD" | "click") => void;
  /**
   Indicates that it has been clicked and redirected
  */
  adClick?: (e: boolean) => void;
}


export default () => {
  const w = window as any;
  // w.addEventListener("DOMContentLoaded", function () {
  w.openADSdkLoader = {
    version: "3.0.4",
    build: "202411011700",
    hostURL: "https://bf2055756e.api.openad.network",
    sdkURL: "https://bf2055756e.node.openad.network/js/sdk.v3.js",
    sdkName: "openADJsSDK",
    PromiseLoadScript: function (obj: any) {
      return new Promise((resolve, reject) => {
        if (w.J$) {
          resolve(true);
        } else {
          if (obj.noCache) {
            obj.url = obj.url + "?t=" + new Date().valueOf();
          }
          let body = document.querySelector("body") as any;
          let script = document.createElement("script") as any;
          script.setAttribute("type", "text/javascript");
          script.setAttribute("src", obj.url);
          script.setAttribute("name", obj.name);
          script.setAttribute("version", obj.version);
          script.onerror = () => reject(false);
          body.appendChild(script);
          if (document.all) {
            script.onreadystatechange = function () {
              let state = this.readyState;
              if (state === "loaded" || state === "complete") {
                resolve(true);
              } else {
                reject(false);
              }
            };
          } else {
            //firefox, chrome
            script.onload = function () {
              resolve(true);
            };
          }
        }
      });
    },
    reload: async function () {
      return await this.PromiseLoadScript({
        name: this.sdkName,
        version: this.version,
        url: this.sdkURL,
        noCache: true,
      });
    },
  };
  w[w.openADSdkLoader.sdkName] = {
    init: async function (func: any, key: any, data: any) {
      console.log(`${func} ${key}`, data);
      w.openADSdkLoader.reload().then((res: any) => {
        if (res) {
          return w[w.openADSdkLoader.sdkName][func][key](data);
        } else {
          return {
            code: -4,
            msg: `[openad-node] unload ${func}.${key}() error`,
          };
        }
      });
    },
    bridge: {
      init: async function (data: any) {
        return w[w.openADSdkLoader.sdkName].init("bridge", "init", data);
      },
      get: async function (data: any) {
        return w[w.openADSdkLoader.sdkName].init("bridge", "get", data);
      },
      log: async function (adInfo: any) {
        return w[w.openADSdkLoader.sdkName].init("bridge", "log", adInfo);
      },
      click: async function (adInfo: any) {
        return w[w.openADSdkLoader.sdkName].init("bridge", "click", adInfo);
      },
    },
    interactive: {
      init: async function (data: any) {
        return w[w.openADSdkLoader.sdkName].init("interactive", "init", data);
      },
      getRender: async function (data: any) {
        return w[w.openADSdkLoader.sdkName].init(
          "interactive",
          "getRender",
          data
        );
      },
    },
  };
  (async function () {
    await w.openADSdkLoader.reload({
      name: w.openADSdkLoader.sdkName,
      version: w.openADSdkLoader.version,
      url: w.openADSdkLoader.sdkURL,
      noCache: true,
    });
  })();
  // });
  const adInfo = {
    zoneId: 173,
    publisherId: 110,
    eventId: 0,
  };
  w.getOpenAdBannerAds = () => {
    const adParams = {
      version: "1.3.0",
      TG: { type: "noSDK", FN: null },
    };
    (window as any).openADJsSDK.bridge.init({
      adParams,
      adInfo: {
        zoneId: 172,
        publisherId: 110,
        eventId: 0,
      },
    });
  };
  w.getOpenAdTaskAds = (
    userInfo: {
      userId?: string;
      firstName?: string;
      lastName?: string;
      userName?: string;
    } = {}
  ) => {
    const adParams = {
      version: "1.3.0",
      TG: { type: "noSDK", FN: null },
    };
    console.log({
      adParams,
      adInfo,
      userInfo,
    });
    return new Promise((resolve) => {
      (window as any).openADJsSDK?.interactive
        .init({
          adParams,
          adInfo,
          userInfo,
        })
        .then((res: { code: number }) => {
          if (res?.code === 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  };
  w.generateOpenAd = (cb: CallbackFunc) => {
    (window as any).openADJsSDK.interactive.getRender({
      adInfo,
      cb,
    });
  };
  
};






