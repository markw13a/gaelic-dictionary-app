TODO:

1) Fix issue with phoenetic text sometimes occupying too much vertical space (suggest having it sit on its own line instead)

2) Clean underlying DB data
  -> Remove HTML artifacts (<i></i> tags and others)
  -> Change how English definitions are stored. Would rather this were returned as an array rather than a single string
  
3) Change fuzzy matching algorithm. Full-text search generally means that you have to type out a full work before getting the definition. Also has trouble with hyphenated words (quite a big issue for a Gaelic dictionary).

4) Add ability to change between views by swiping left or right 

5) Reduce tech debt around styles

6) Create nicer icon
