import {loadScript} from '../../index'
export default async (debug = false) => {
  if (!(window as any).Adsgram) {
    await loadScript([{ src: "https://sad.adsgram.ai/js/sad.min.js" }]);
  }
  return (window as any).Adsgram?.init({ blockId: "4753", debug }); //test 4754 pro 4753
};
