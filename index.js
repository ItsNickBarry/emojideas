const emojilib = require('emojilib');
const lunr = require('lunr');

const DEFAULT_OPTIONS = {
  fuzzy: 0,
  nameBoost: 3,
  formatOutput: el => el.ref,
};

let Emojideas = function (options) {
  this.options = Object.assign({}, DEFAULT_OPTIONS, options);

  this._buildIndex(this.options);
  this._fuzzySuffix = this.options.fuzzy ? `~${ this.options.fuzzy }` : '';
};

Emojideas.prototype.suggest = function (input) {
  return this._index.search(this._processInput(input.replace('_', ' '))).map(this.options.formatOutput);
};

Emojideas.prototype._processInput = function (input) {
  return `${ input }${ this._fuzzySuffix }`;
};

Emojideas.prototype._buildIndex = function (options) {
  let lib = {};

  for (let key in emojilib) {
    let [name, ...keywords] = emojilib[key];

    lib[name] = {
      char: key,
      name: name.replace('_', ' '),
      keywords: keywords.join(' '),
    };
  }

  this._index = lunr(function () {
    this.ref('char');

    if (options.nameBoost) {
      this.field('name', { boost: options.nameBoost });
    }
    this.field('keywords');

    for (let key in lib) {
      this.add(lib[key]);
    }
  });
};

module.exports = Emojideas;
