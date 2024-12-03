export default async (debug=false) => {
  const loadScript = async (scrArrParams: Array<any>) => {
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
  const w = window as any;
  if (!w.TonAISdk || !w.axios || !w.React || !w.ReactDOM) {
    await loadScript([
      { src: "https://unpkg.com/axios/dist/axios.min.js" },
      { src: "https://unpkg.com/react@18/umd/react.production.min.js" },
    ]);
    await loadScript([
      { src: "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" },
    ]);
    await loadScript([
      {
        src: "https://cdn.jsdelivr.net/npm/ton-ai-sdk@latest/dist/index.umd.js",
      },
    ]);
  }

  w.TonAISdk.TonAdInit({
    appId: "673d42c763434c1b83c48194",
    debug,
  });

  const { ads } = await w.TonAISdk.GetMultiTonAd("673c816fdcf9cc2173a957ef", 1);
  return { ads, TonAdPopupShow: w.TonAISdk.TonAdPopupShow }; //test 4754 pro 4753
};
