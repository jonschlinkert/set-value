'use strict';

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const bench = require('benchmarked');
const write = require('write');

bench.run({ fixtures: 'fixtures/*.js', code: 'code/*.js', dry: Boolean(argv['dry-run']) })
  .then(function(stats) {
    write.sync(path.join(__dirname, 'stats.json'), JSON.stringify(stats, null, 2));
    write.sync(path.join(__dirname, 'stats.md'), bench.render(stats));
  })
  .catch(console.error);
