document.addEventListener("DOMContentLoaded", function() {
  let adInterval;
  const adFrequency = 300;
  function showInterstitialAd() {
    try {
      appilix.postMessage(JSON.stringify({
        type: "admob_show_interstitial_ad"
      }));
      console.log("Interstitial ad requested.");
    } catch (e) {
      console.error("Error showing interstitial ad:", e);
    }
  }
  function startAdTimer() {
    clearInterval(adInterval);
    adInterval = setInterval(showInterstitialAd, adFrequency);
    console.log("Ad timer started.");
  }
  function stopAdTimer() {
    clearInterval(adInterval);
    console.log("Ad timer stopped.");
  }
  showInterstitialAd();
  startAdTimer();
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      stopAdTimer();
    } else {
      showInterstitialAd();
      startAdTimer();
    }
  });
});
