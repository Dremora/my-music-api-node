var t = require('tcomb-validation')
var subtype = t.subtype
var struct = t.struct
var enums = t.enums
var tuple = t.tuple
var maybe = t.maybe
var list = t.list
var union = t.union
var Str = t.Str
var Num = t.Num

var PositiveInteger = subtype(Num, function (n) {
  return n > 0 && n % 1 === 0
})

var Location = enums.of('foobar2000 google-music spotify apple-music')

var MBID = subtype(Str, function (n) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(n)
})

var Source = struct({
  accurate_rip: maybe(Str),
  comments: maybe(Str),
  cue_issues: maybe(Str),
  discs: maybe(PositiveInteger),
  download: maybe(Str),
  edition: maybe(Str),
  format: maybe(Str),
  location: Location,
  mbid: maybe(MBID),
  tag_issues: maybe(Str)
})

var FirstPlayed = union([
  Num, tuple([PositiveInteger, PositiveInteger, PositiveInteger])
])

var Album = struct({
  title: Str,
  artist: Str,
  year: maybe(Num),
  comments: maybe(Str),
  first_played: maybe(FirstPlayed),
  sources: list(Source)
})

exports.Album = Album
