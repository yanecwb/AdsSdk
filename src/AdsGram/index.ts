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
  if (!(window as any).Adsgram) {
    await loadScript([{ src: "https://sad.adsgram.ai/js/sad.min.js" }]);
  }
  return (window as any).Adsgram?.init({ blockId: "4753" }); //test 4754 pro 4753
};
