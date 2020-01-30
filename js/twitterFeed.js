var screenHeight = window.screen.height * .6;
var screenWidth = window.screen.width * .9;

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
