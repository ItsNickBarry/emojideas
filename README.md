# Emojideas

Text-to-emoji suggestion library with a [Lunr](https://github.com/olivernn/lunr.js) and [emojilib](https://github.com/muan/emojilib) backend.

## Usage

Install the library:

```
npm install --save emojideas
```

Require the module, create an instance, and call the `suggest` function on some text:

```javascript
let Emojideas = require('emojideas');

let e = new Emojideas();

e.suggest('aerial tramway');
// => [ '🚡' ]
```

Results are ordered based on the [score](https://lunrjs.com/guides/searching.html#scoring) calculated by Lunr.

### Options

The constructor accepts several options.

| **option** | **description** |
|-|-|
| excludeCategories | array of emoji categories to exclude from results (default: ``[]``)|
| fuzzy | level of fuzzyness to apply to all Lunr queries (default: `0`) |
| nameBoost | weight applied to emoji name relative to keywords when ordering results (default: `3`) |
| formatOutput | function passed each Lunr result to format output (default: `el => el.ref`) |

```javascript
require('emojilib').lib.aerial_tramway;
// => { keywords: [ 'transportation', 'vehicle', 'ski' ],
//      char: '🚡',
//      fitzpatrick_scale: false,
//      category: 'travel_and_places' }

let e = new Emojideas({ excludeCategories: ['travel_and_places'] });
e.suggest('aerial tramway');
// => []

let f = new Emojideas({ fuzzy: 1 });
f.suggest('trumway');
// => [ '🚡' ]

let g = new Emojideas({ nameBoost: 0 });
g.suggest('aerial tramway');
// => []

let h = new Emojideas({ formatOutput: el => [el.ref, el.score] });
h.suggest('aerial tramway');
// => [ [ '🚡', 25.417660356531634 ] ]
```

### Lunr

All queries are passed directly to the Lunr backend, and can therefore use the [Lunr syntax](https://lunrjs.com/guides/searching.html), except when the `fuzzy` option has been set.
