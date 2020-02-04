var screenHeight = window.screen.height;
var screenWidth = window.screen.width;

if(screenHeight >= screenWidth){
  screenHeight *= .6;
  screenWidth *= .9;
} else {
  screenHeight *= .6;
  screenWidth *= .3;
}



var twitterElem = document.getElementById("twitter");
var twitterFeed = document.createElement("a");
twitterFeed.setAttribute("class", "twitter-timeline");
twitterFeed.setAttribute("data-lang", "en");
twitterFeed.setAttribute("data-width", screenWidth.toString());
twitterFeed.setAttribute("data-height", screenHeight.toString());

//theme switch
twitterFeed.setAttribute("data-theme", "dark");
twitterFeed.setAttribute("href", "https://twitter.com/HSESchools?ref_src=twsrc%5Etfw");
twitterElem.appendChild(twitterFeed);
