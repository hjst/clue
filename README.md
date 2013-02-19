Clue is intended to scratch my own particular itch for a pattern-matching tool when stuck on crosswords. There are, of course, lots of these things already -- so why write another one? Clue's main differentiators are:

* Mobile-friendly (I usually only have a phone or iPad to hand)
* British spelling variants (there are already enough US-centric tools)

Requirements
------------

* [node.js](http://nodejs.org/) (developed on v0.8.20)
* [sqlite3 for node](https://npmjs.org/package/sqlite3) (developed with v2.1.5)

Installation
------------

1. ```git clone https://github.com/hjst/clue.git```
2. ```cd clue```
3. ```npm install``` (fetch & install node libs, if needed)
4. ```node web.js``` (or equivalent, depending on your deploy target)

Building the dictionary
-----------------------

The dictionary is derived from the [SCOWL](http://wordlist.sourceforge.net/) collection. There might be better sources, but SCOWL is at least reasonably well known, free, and has separate British/American lists. If you know of a more suitable source I would be very grateful to hear of it.

Build the dictionary database by running ```make dictionary.db```. This will grab the latest SCOWL files, select & filter the British ones, load them into an sqlite database and drop you at the prompt ready to play. Check the ```Makefile``` for the gritty details.

Notes
-----
I originally wrote clue to use ```grep``` but then wasn't sure where it was going to live and thought perhaps *some* effort to make it portable might not be a terrible idea. Given the exclusively read-only nature of the thing, sqlite was an obvious choice. My crude benchmarks showed that ```LIKE``` in sqlite3 was roughly even in performance with ```grep -i``` on this dataset, which was good enough for me.
