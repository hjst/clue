DROP TABLE IF EXISTS words;
CREATE TABLE words (word TEXT);
.import dictionary.txt.clean words
.mode line
.headers ON
SELECT COUNT(*) AS word_count FROM words;
