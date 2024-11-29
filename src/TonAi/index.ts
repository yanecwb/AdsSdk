export default async () => {
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
  await loadScript([
    { src: "https://unpkg.com/axios/dist/axios.min.js" },
    { src: "https://unpkg.com/react@18/umd/react.production.min.js" },
  ]);
  await loadScript([
    { src: "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" },
  ]);
  await loadScript([
    { src: "https://cdn.jsdelivr.net/npm/ton-ai-sdk@latest/dist/index.umd.js" },
  ]);
  console.log("TonAISdk", (window as any).TonAISdk);
  (window as any).TonAISdk.TonAdInit({
    appId: "673d42c763434c1b83c48194",
    debug: true,
  });
  const { ads } = await (window as any).TonAISdk.GetMultiTonAd(
    "673c816fdcf9cc2173a957ef",
    1
  );
  return { ads,TonAdPopupShow:(window as any).TonAISdk.TonAdPopupShow }; //test 4754 pro 4753
};
