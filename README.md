# Emojideas

Text-to-emoji suggestion library with a [Lunr](https://github.com/olivernn/lunr.js) and [emojilib](https://github.com/muan/emojilib) backend.  Suggestions are based on emoji name and keywords.

## Usage

Install the library:

```bash
npm install --save emojideas
# or
yarn add emojideas
```

Require the module, create an instance, and call the `suggest` function on some text:

```javascript
const Emojideas = require('emojideas');

const e = new Emojideas();

e.suggest('aerial tramway');
// => [ '🚡' ]
```

Results are ordered based on the [score](https://lunrjs.com/guides/searching.html#scoring) calculated by Lunr.

### Options

The constructor accepts several options.

| **option** | **description** |
|-|-|
| fuzzy | level of fuzzyness to apply to all Lunr queries (default: `0`) |
| nameBoost | weight applied to emoji name relative to keywords when ordering results (default: `3`) |
| formatOutput | function passed each Lunr result to format output (default: `el => el.ref`) |

```javascript
require('emojilib')['🚡'];
// => [ 'aerial_tramway', 'transportation', 'vehicle', 'ski' ]

const f = new Emojideas({ fuzzy: 1 });
f.suggest('trumway');
// => [ '🚡' ]

const g = new Emojideas({ nameBoost: 0 });
g.suggest('aerial tramway');
// => []

const h = new Emojideas({ formatOutput: el => [el.ref, el.score] });
h.suggest('aerial tramway');
// => [ [ '🚡', 28.254572762652064 ] ]
```

### Lunr

All queries are passed directly to the Lunr backend, and can therefore use the [Lunr syntax](https://lunrjs.com/guides/searching.html), except when the `fuzzy` option has been set.

```javascript
require('emojilib')['🚊'];
// => [ 'tram', 'transportation', 'vehicle' ]

const e = new Emojideas();

e.suggest('tram');
// => [ '🚊', '🚋' ]

e.suggest('tram*');
// => [ '🚊', '🚡', '🚋' ]

e.suggest('aerial tram*');
// => [ '🚡', '🚊', '🚋' ]

e.suggest('tram* -tram');
// => [ '🚡' ]
```

### CLI

A command line search implementation based on [Commander](https://github.com/tj/commander.js) is included.

Install the library globally:

```bash
npm install -g emojideas
# or
yarn global add emojideas
```

Run a query:

```bash
emojideas aerial tramway
# => [ '🚡' ]
```

To see available options:

```bash
emojideas --help
```
