/**
 * Copyright 2015 Digital Airways
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";
	var loudness = require("loudness");

	var INCREMENT_STEP = 5;

	function SetVolume(n) {
		RED.nodes.createNode(this, n);

		this.volume = n.volume;

		var node = this;

		this.on("input", function(msg) {
			loudness.getVolume(function(err, vol) {
				if(err) { node.warn(err); }
				var volume = node.volume;
				if(msg.volume)
					volume = msg.volume;
				if(msg.intensity) {
					volume = msg.intensity;
				}
				if(msg.intent || msg.intent == 0) {
					switch(msg.intent) {
						case 0: volume = 0; break; // close
						case 1: volume = 100; break; // open
						case 2: volume = vol + INCREMENT_STEP; break; // more
						case 3: volume = vol - INCREMENT_STEP; break; // less
						// case : volume = 100 - vol; break; // invert
					}
				}
				if(volume < 0) volume = 0;
				console.log(vol, volume)
				loudness.setVolume(volume, function(err) {
					if(err) {
						node.warn(err);
					}
					node.send(msg);
				});
			});
		});
	}
	RED.nodes.registerType("volume", SetVolume);
}