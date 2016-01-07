// ==UserScript==
// @name        HNCleanse
// @namespace   com.example.hncleanse
// @description Remove items from Hacker News I'm probably not gonna like.
// @include     https://news.ycombinator.com/new*
// @include     https://news.ycombinator.com/
// @version     1.2
// @grant       none
// ==/UserScript==

var annoyingSites = [
  'aeon.co', // too fluffy
  'bbc.com', // biased american reporting
  'brookings.edu', //political
  'dailydot.com', // more often bad than good
  'dailymail.co.uk', // low quality
  'daringfireball.net', // no use for this whatsoever
  'gizmodo.com', // gawker
  'icracked.com', // irrelevant
  'iflscience', // low quality
  'io9.com', // gawker
  'jalopnik.com', // gawker
  'medium.com', // low quality
  'modelviewculture.com', // activist
  'nautil.us', // factoids
  'newyorker.com', // not that bad but still not interested
  'npr.org', // depressing
  'nytimes.com', // will probably annoy me
  'polygon.com', // clickbait, low-quality
  'qz.com', // really bad more often than really good
  'reason.com', // libertarian/outrage-porn
  'salon.com', // clickbait,outrage porn
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
  'aaron swartz',
  'accused',
  'airport security',
  'apple watch',
  'basic income','mincome',
  'boycott','boycotting',
  'bully','bullying',
  'ceo','cfo','cto','coo',
  'cispa',
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
  'japan', 'japanese', //these are ALWAYS crap
  'mark pincus','zynga',
  'marijuana',
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
  'snowden','greenwald','poitras','intelligence service','nsa','fbi','surveillance','doj','subpoena','mi6',
  'sex','sexism','sexist','sexual',
  'suicide','suicides','suicidal',
  'supreme court',
  'systemd',
  'tech industry',
  'treaty',
  'ttip',
  'trolls','trolling','troll', //may be too general
  'uber',
  'war on drugs',
  'women'
];

var crapStr = '\\b(?:' + crapTerms.join('|') + ')\\b';
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
  var athing = elem.parentNode.parentNode;
  var sitebit = athing.querySelector('span[class="sitestr"]').innerHTML;
  var title = athing.querySelector('td[class="title"] a').innerHTML;

  var crap = null;
  var shouldRemove = shouldRemoveSite(sitebit);
  if (!shouldRemove) {
  	crap = isCrap(title);
  	if (crap != null) { crap = crap.join(); }
  }

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
