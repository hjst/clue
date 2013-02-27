BUILDDIR = .build
SCOWLZIPURL = http://sourceforge.net/projects/wordlist/files/latest/download?source=files
YUIURL = http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.7.zip
YUIJAR = $(BUILDDIR)/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar

all: combine squish

build-init: clean
	mkdir $(BUILDDIR);
	cd $(BUILDDIR); wget $(YUIURL) -O yui.zip; unzip yui.zip;

clean:
	rm -rf $(BUILDDIR);

combine:
	cat \
		stylesheets/base.css \
		stylesheets/skeleton.css \
		stylesheets/layout.css \
	> $(BUILDDIR)/combined.css
	# ordering isn't important in my case, so find is more convenient
	find javascript/ -maxdepth 1 -regex "[^.]+.js" -type f -exec cat '{}' > $(BUILDDIR)/combined.js \;

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
