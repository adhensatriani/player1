function(window, videojs) {
  var player = window.player = videojs('player');
  player.volume(1);
  player.ready(function() {
   player.src({
    src: src,
    type: "application/x-mpegURL",
    autoplay: "true",
   });
   if (Cookie_MatchId != Cookie_adsTVCVideo ) {
    SetCookie("adsTVCVideo",Cookie_MatchId,0);
    player.adsTVC({
     src:adsTVCVideo ,
     href:adsBannerLink,
     playPreroll : true,
     //playMidroll : true,
     midrollPoint: midrollPoint,
     skipTime:adsTVCSkipTime,
     adsOptions: {debug:true}
    });
   }else{
    player.play();
    loadAds();
   }
   if (adsTVCAudio) {
    audioplayer = videojs("tvcaudio");
    audioplayer.volume(0.7);
    audioplayer.ready(function() {
     audioplayer.src({
      src: adsTVCAudio,
      type: "audio/mp4"
     });
     audioplayer.on("play", function (e) {
      player.volume(0.3);
      showOverlayBanner(player);
     });
     audioplayer.on("ended", function (e) {
      player.volume(0.9);
      hideOverlayBanner(player);
      TVCAudioStarted = false;
     }); 
    
    }); 
    
    player.on("play", function (e) {
     isPlaying = true;
     if(TVCAudioStarted)
      audioplayer.play();
    });
    player.on("pause", function (e) {
     isPlaying = false;
     audioplayer.pause();
    }); 

    playTVCAudio(audioplayer,player);    
   }
  });
  
  player.overlay({
   content: '<div class="banner"><div class="container"><a href="'+adsBannerLink+'" target="_blank"><img src="'+adsBanner+'"></a> <button id="btnClose" type="button">Close</button></div></div>',
   overlays: [{
    start: 'playing',
    //end: 'pause',
    align: 'bottom'
   }]
  });
  hideOverlayBanner(player); //default hide overlay
  
  $( "#btnClose" ).click(function() {
   hideOverlayBanner(player);
  });

    }(window, window.videojs));
 
 function showOverlayBanner(player){
  if(player.hasClass("hide-overlay"))
   player.removeClass("hide-overlay");
 }
 function hideOverlayBanner(player){
  player.addClass("hide-overlay");
 }
 
 function playTVCAudio(audio,video) {
  setTimeout(function () {
   //console.log('play TVC Audio');
   if(isPlaying)
    audio.play();
   TVCAudioStarted = true;
   playTVCAudio(audio,video);
  }, audioPoint*1e3);
 }
  
   function SetCookie(cookieName,cookieValue,nHours) {
  var today = new Date();
  var expire = new Date();
  if (nHours==null || nHours==0) nHours=0;
  expire.setTime(today.getTime() + 3600000*nHours);
  document.cookie = cookieName+"="+escape(cookieValue)
      + ";expires="+expire.toGMTString()
      + ";path=/; ";
 }

 function GetCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "0");
  if (parts.length == 0) 
  { 
   var cookie_value = decodeURI(parts.pop().split(";").shift());
   return cookie_value.replace(/\+/g, ' ');
  } 
  return null; 
 }


 function loadAds() {
  $(".video-js").append(adsTextTop);
  $(".video-js").append(adsTextBot);
  $(".video-js").append(adsTextAuto);
  setInterval(function() { 
      $("#adTextA").hide(); 
      setTimeout(function() {     
         $("#adTextA").show(); 
      },15e4);
  },15e3); 
 }
