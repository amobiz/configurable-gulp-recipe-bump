'use strict';

var schema = {
	title: 'bump',
	description: 'Bump project version programmatically or interactively.',
	properties: {
		src: {
			description: 'The target JSON files to write version information to.',
			type: 'glob',
			default: 'package.json'
		},
		interactive: {
			description: 'Enable interactive operation.',
			type: 'boolean',
			default: false
		},
		version: {
			description: 'Specific version to bump to.',
			type: 'string'
		},
		type: {
			description: 'Method of updating.',
			enum: ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'],
			default: 'patch'
		},
		preid: {
			description: 'Prerelease id.',
			type: 'string',
			enum: ['alpha', 'beta']
		},
		field: {
			description: 'Field to update.',
			type: 'string',
			default: 'version'
		}
	}
};

var messages = {
	type: {
		type: 'list',
		name: 'type',
		message: 'What type of version bump would you like to do?',
		choices: ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease', 'specific'],
		default: 'patch',
		action: 'inc'
	},
	prerelease: {
		type: 'list',
		name: 'preid',
		message: 'What typeof prerelease would you like to do?',
		choices: ['alpha', 'beta', 'custom'],
		default: 'beta',
		action: 'inc'
	},
	custom: {
		type: 'input',
		name: 'preid',
		message: "What's your prerelease id?",
		action: 'inc'
	},
	specific: {
		type: 'input',
		name: 'version',
		message: "What's your specific version?",
		action: 'to'
	}
};

function interact(prompt, messages, start, fn) {
	var answers = {};
	next(start);

	function next(index) {
		var message = messages[index];

		prompt(message, function (response) {
			var value;

			Object.assign(answers, response);
			value = response[message.name];
			if (value in messages) {
				next(value);
			} else {
				fn[message.action](answers);
			}
		});
	}
}

/**
 * Note:
 *
 * Gulp-bump bump version files independently, that make version not in sync.
 * Here we always get version from package.json.
 *
 * Note in Traditional Chinese:
 *
 * Gulp-bump 可以一次修改多個 .json 檔案，針對每個檔案讀取其 version 資訊，然後各自修改其版本號碼。
 * 所以可能造成設定不同步的狀況，並不遵循 single source of truth 原則。
 * 這裡我們改為一律由 package.json 讀取 version 資訊，然後根據需求更新目標檔案的版本號碼。
 */
function bumpTask(done) {
	// lazy loading required modules.
	var path = require('path');
	var semver = require('semver');
	var bump = require('gulp-bump');
	var prompt = require('gulp-prompt').prompt;

	var gulp = this.gulp;
	var config = this.config;

	var stream, cwd, pkgfile;

	cwd = process.cwd();
	pkgfile = path.join(cwd, 'package.json');
	stream = this.upstream || gulp.src(config.src.globs || pkgfile);

	if (config.interactive) {
		interact(prompt, messages, 'type', {
			inc: function (answers) {
				inc(answers).on('end', done);
			},
			to: function (answers) {
				bumpTo(answers.version).on('end', done);
			}
		});
	} else if (config.version) {
		return bumpTo(config.version);
	} else {
		return inc(config);
	}

	function inc(config) {
		var pkg = require(pkgfile);
		var newVersion = semver.inc(pkg.version, config.type || 'patch', config.preid);
		return bumpTo(newVersion);
	}

	function bumpTo(version) {
		return stream
			.pipe(bump({ version: version, key: config.field }))
			.pipe(gulp.dest(cwd));
	}
}

module.exports = bumpTask;
module.exports.schema = schema;
module.exports.type = 'task';
