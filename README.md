# gulp-ccr-bump

Bump project version programmatically or interactively. A cascading configurable gulp recipe for [gulp-chef](https://github.com/gulp-cookery/gulp-chef).

## Install

``` bash
$ npm install --save-dev gulp-chef gulp-ccr-bump
```

## Recipe

Bump Version

## Ingredients

* [gulp-bump](https://github.com/stevelacy/gulp-bump)

* [gulp-prompt](https://github.com/Freyskeyd/gulp-prompt)

* [semver](https://github.com/npm/node-semver)

## API

### config.interactive

Enable interactive operation. Once enabled, values in "`version`" and "`type`" are ignored.

### config.version

Specific version to bump to. Once specified, "`type`" value is ignored.

### config.type

Method of updating.

Valid values are: "`prerelease`", "`patch`", "`minor`", and "`major`".

### config.preid

Prerelease id.

### config.field

Field to update. Defaults to "`version`".

## Usage

``` javascript
var gulp = require('gulp');
var chef = require('gulp-chef');

var meals = chef({
	bumpi: {
		description: 'bump version interactively',
		recipe: 'bump',
		interactive: true
	},
	bumpm: {
		description: 'bump major version',
		recipe: 'bump',
		type: 'major'
	},
	bumpn: {
		description: 'bump minor version',
		recipe: 'bump',
		type: 'minor'
	},
	bump: {
		description: 'bump patch version'
	}
});

gulp.registry(meals);
```
