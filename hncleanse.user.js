// ==UserScript==
// @name        HNCleanse
// @namespace   com.example.hncleanse
// @description Remove items from Hacker News I'm probably not gonna like.
// @include     https://news.ycombinator.com/new*
// @include     https://news.ycombinator.com/
// @version     1.1
// @grant       none
// ==/UserScript==

var annoyingSites = [
  'aeon.co', // too fluffy
  'bbc.com', // biased american reporting
  'dailydot.com', // more often bad than good
  'dailymail.co.uk', // low quality
  'daringfireball.net', // no use for this whatsoever
  'icracked.com', // irrelevant
  'iflscience', // low quality
  'medium.com', // low quality
  'modelviewculture.com', // activist
  'nautil.us', // factoids
  'npr.org', // depressing
  'nytimes.com', // will probably annoy me
  'polygon.com', // clickbait, low-quality
  'qz.com', // really bad more often than really good
  'reason.com', // libertarian/outrage-porn
  'techdirt.com', // outrage-porn, usually low-quality
  'ted.com', // TED
  'theatlantic.com', // more often bad than good
  'theguardian.com', // will probably annoy me
  'themarysue.com', // way too snarky
  'theverge.com', // clickbait, low-quality editorials
  'truthvoice.com', // activist
  'vice.com', // more annoying than good
  'vox.com', // everything
  'washingtonpost.com', // more often annoying than good
  'whitehouse.gov', // never interesting
  'xkcd.com' // if it's any good i'll hear about it from someone else
];

var newsSites = [
  'ap.org',
  'bbc.co.uk',
  'bbc.com',
  'cnn.com',
  'dailymail.co.uk',
  'npr.org',
  'nytimes.com',
  'pbs.org',
  'theguardian.com',
  'washingtonpost.com',
  'wsj.com'
];

var techSites = [
  'cnet.com',
  'techcrunch.com'
];

var businessSites = [
  'bloomberg.com',
  'businessinsider.com',
  'forbes.com',
  'fortune.com',
  'techcrunch.com',
  'wsj.com'
];

//flamebait
var crapTerms = [
  'accused',
  'airport security',
  'apple watch',
  'basic income','mincome',
  'boycott','boycotting',
  'bully','bullying',
  'code of conduct',
  'culture','cultural',
  'democracy', 'democratic', //may be too general
  'dick costolo',
  'feminism','feminist',
  'free speech','freedom of speech',
  'gamergate','blocklist','randi harper','zoe quinn','brianna wu',
  'gawker',
  'gentrification','gentrify','gentrified',
  'harass','harassing','harassment',
  'hbd','iq','neoreactionary','curtis yarvin','mencius moldbug',
  'hate speech',
  'h1b','h1-b','h-1b',
  'immigration','immigrant', 'undocumented immigrants',
  'impostor syndrome',
  'interview','interviews','interviewing',
  'mark pincus','zynga',
  'mental illness','mental illnesses',
  'mongodb',
  'obama',"obama's",
  'paul krugman',
  'police','law enforcement',
  'politics',
  'racist','racism','racial',
  'reddit',
  'right to be forgotten','right-to-be-forgotten',
  'riots','rioting',
  'san francisco','san franciscan',
  'snowden','greenwald','poitras','intelligence service','nsa','fbi','surveillance','doj','subpoena',
  'sex','sexism','sexist','sexual',
  'suicide','suicides','suicidal',
  'systemd',
  'tech industry',
  'treaty',
  'trolls','trolling','troll', //may be too general
  'uber'
];

var i;
var crapStr ='';
for (i=0; i<crapTerms.length;i++) {
  crapStr += crapTerms[i];
  if (i<(crapTerms.length-1)) crapStr += '|';
}
crapStr = '\\b(?:' + crapStr + ')\\b';
crapRegex = new RegExp(crapStr, 'i');

function isCrap(testStr) {
  var crap = crapRegex.exec(testStr);
  return crap;
}

function shouldRemoveSite(siteName) {
  return (annoyingSites.indexOf(sitebit) >= 0) ||
    (newsSites.indexOf(sitebit) >= 0)  ||
    (techSites.indexOf(sitebit) >= 0) ||
    (businessSites.indexOf(sitebit) >= 0);
}

var result =
document.evaluate("//tr[@class='athing']//span[@class='sitebit comhead']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var i=0;
while ((elem = result.snapshotItem(i)) != null) {
  var sitebit = elem.innerHTML.substring(2,elem.innerHTML.length-1);
  var athing = elem.parentNode.parentNode;
  var title = athing.querySelector('td[class="title"] > a[href]').innerHTML;

  var shouldRemove = shouldRemoveSite(sitebit);
  var crap = isCrap(title);
  if (crap != null) { crap = crap.join(); }

  if (shouldRemove || crap != null) {
    var reason = shouldRemove?('site '+sitebit):('terms '+crap);
    console.log(reason+': '+title);

    var subtext = athing.nextSibling;
    subtext.parentNode.removeChild(subtext);

    var breakElem = false;
    while (!breakElem) {
      delElem = athing.nextSibling;
      if (!delElem || delElem.className=='athing') break;
      if (delElem.className=='spacer') breakElem = true;
      delElem.parentNode.removeChild(delElem);
    }

    athing.parentNode.removeChild(athing);
  }
  i++;
}
