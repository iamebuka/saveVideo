$(document).ready(function () {
    const adsource = window.savetweetSource;
    let totalAds = 0;
    const ad = document.querySelector(".ads_custom");

    ad.addEventListener("click", function (e) {
      $.ajax({
        url: "/ads",
        method: "GET",
        data: { source: adsource },
        dataType: "json",
      }).then((data) => {
        totalAds += 1;
        console.log("Total Ads @ ", adsource, totalAds);
      });
    });

    // fetchAdData(adsource);

    function fetchAdData(source) {
      $.ajax({
        url: "/adData",
        method: "GET",
        data: { source: source },
        dataType: "json",
      }).then((data) => {
        totalAds = data.totalAds
        console.log("                                                  \n\
        / ___|  __ ___   _____  |_   _|_      _(_) |_| |_ ___ _ __  \ \   / (_) __| | ___  ___  \n\
        \___ \ / _` \ \ / / _ \   | | \ \ /\ / / | __| __/ _ \ '__|  \ \ / /| |/ _` |/ _ \/ _ \ \n\
         ___) | (_| |\ V /  __/   | |  \ V  V /| | |_| ||  __/ |      \ V / | | (_| |  __/ (_) | \n\
        |____/ \__,_| \_/ \___|   |_|   \_/\_/ |_|\__|\__\___|_|       \_/  |_|\__,_|\___|\___/  \n")
        console.log("Total Ads @ ", source, totalAds);
      });
     
    }
  });