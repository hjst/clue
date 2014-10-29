BUILDDIR = .build
SCOWLZIPURL = http://sourceforge.net/projects/wordlist/files/latest/download?source=files
YUIURL = https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar
YUIJAR = $(BUILDDIR)/yuicompressor.jar

all: combine squish

build-init: clean
	mkdir $(BUILDDIR);
	cd $(BUILDDIR); curl -L $(YUIURL) -C - --cookie . -o yuicompressor.jar;

clean:
	rm -rf $(BUILDDIR);

combine:
	cat \
		stylesheets/base.css \
		stylesheets/skeleton.css \
		stylesheets/layout.css \
	> $(BUILDDIR)/combined.css
	# CAUTION: make sure you only have one version of jQuery in the javascript dir
	cat \
		javascript/jquery-*.min.js \
		javascript/heroku_hack.js \
		javascript/clue.js \
		javascript/wordnik.js \
	> $(BUILDDIR)/combined.js

squish:
	java -jar $(YUIJAR) $(BUILDDIR)/combined.css -o ./stylesheets/combined.min.css
	java -jar $(YUIJAR) $(BUILDDIR)/combined.js -o ./javascript/combined.min.js

dictionary-init: build-init
	cd $(BUILDDIR); curl -Lvo scowl.zip $(SCOWLZIPURL); mkdir scowl; unzip scowl.zip -d scowl;

dictionary.txt.raw: dictionary-init
	# cat all of the desired word lists into one "raw" file
	cd $(BUILDDIR)/scowl/final; cat british-words.* british-upper.* british-proper-names.* british-abbreviations.* english-words.* english-abbreviations.* english-proper-names.* english-upper.* > ../../../dictionary.txt.raw

dictionary.txt.clean: dictionary.txt.raw
	# remove all 1 and 2 letter words
	# remove all words ending in 's
	# sort (dictionary, case-insensitive, unique)
	# NB: make sees $ as a variable, so use double $$ to escape 
	sed "/^.\{1,2\}$$/d" dictionary.txt.raw | sed "/.*'s\$$/d" | sort -dfu > dictionary.txt.clean

dictionary.db: dictionary.txt.clean
	sqlite3 -init dictionary.sql dictionary.db
