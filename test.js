let assert = require('assert');
let emojilib = require('emojilib');

let Emojideas = require('./index.js');

let emojiName = 'aerial tramway';
let emoji = emojilib.lib[emojiName.replace(' ', '_')];
// => { keywords: [ 'transportation', 'vehicle', 'ski' ],
//      char: '🚡',
//      fitzpatrick_scale: false,
//      category: 'travel_and_places' }

describe('Emojideas', function () {
  describe('#suggest', function () {
    describe('by default', function () {
      let emojideas = new Emojideas();

      it('returns an array', function () {
        let result = emojideas.suggest();
        assert(result instanceof Array);
      });

      it('searches by name (converted from snake case)', function () {
        let result = emojideas.suggest(emojiName);
        assert(result.includes(emoji.char));
      });

      it('searches by keywords', function () {
        emoji.keywords.forEach(function (keyword) {
          let result = emojideas.suggest(keyword);
          assert(result.includes(emoji.char));
        });
      });

      it('is not case sensitive', function () {
        let lowerCase = emojideas.suggest(emojiName.toLowerCase());
        let upperCase = emojideas.suggest(emojiName.toUpperCase());
        assert.deepStrictEqual(lowerCase, upperCase);
      });

      it('searches by standard Lunr syntax', function () {
        let result = emojideas.suggest(`+${ emojiName }~2 -asdf`);
        assert(result.includes(emoji.char));
      });
    });

    describe('when excludeCategories Array is set', function () {
      let emojideas = new Emojideas({ excludeCategories: [emoji.category] });

      it('excludes categories', function () {
        let result = emojideas.suggest(emojiName);
        assert(!result.includes(emoji.char));
      });
    });

    describe('when fuzzy is set', function () {
      describe('to 1', function () {
        let emojideas = new Emojideas({ fuzzy: 1 });

        it('allows one-character spelling errors', function () {
          let result = emojideas.suggest(emojiName.slice(1));
          assert(result.includes(emoji.char));
        });
      });

      describe('to 2', function () {
        let emojideas = new Emojideas({ fuzzy: 2 });

        it('allows two-character spelling errors', function () {
          let result = emojideas.suggest(emojiName.slice(2));
          assert(result.includes(emoji.char));
        });
      });
    });

    describe('when nameBoost is set', function () {
      describe('to 0', function () {
        let emojideas = new Emojideas({ nameBoost: 0 });

        it('excludes name from search', function () {
          let result = emojideas.suggest(emojiName);
          assert(!result.includes(emoji.char));
        });
      });

      describe('to a high number', function () {
        let emojideas = new Emojideas({ nameBoost: 10 });

        it('prioritizes name in search', function () {
          let result = emojideas.suggest(emojiName);
          assert.equal(result[0], emoji.char);
        });
      });
    });

    describe('when formatOutput Function is set', function () {
      describe('to return fixed value', function () {
        let emojideas = new Emojideas({ formatOutput: el => '🚡' });

        it('outputs fixed value', function () {
          let result = emojideas.suggest('*');
          assert(result.length);
          assert(result.every(el => el === '🚡'));
        })
      });

      describe('to interact with Lunr properties', function () {
        let emojideas = new Emojideas({ formatOutput: el => [el.ref, el.score] });

        it('outputs Array of ref and score', function () {
          let result = emojideas.suggest(emojiName);
          assert(result[0] instanceof Array);
          assert.equal(result[0][0], emoji.char);
          assert(typeof result[0][1] === 'number');
        });
      });
    });
  });
});
