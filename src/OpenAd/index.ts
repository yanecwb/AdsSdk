const OpenAd = async () => {
  const module = await import("https://protocol.openad.network/sdkloader.js");
  return module;
};

export default OpenAd;
