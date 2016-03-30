function draw_init() {
	velocities_lengths = new Array(GRID_SIZE_X);
	for (var i = 0; i < GRID_SIZE_X; i++) {
		velocities_lengths[i] = new Array(GRID_SIZE_Y);
	}

	draw();
}

function draw() {
	// no data before 1st worker message
	if (typeof velocities_x != "undefined" && typeof velocities_y != "undefined") {
		redraw();
	}
	
	// interval determined by FPS
	setTimeout(draw, DRAW_INTERVAL);
}

function redraw() {
	// this also populates velocities_lengths
	var max_len = get_max_length(velocities_x, velocities_y, velocities_lengths);
	for (var c = 0; c < velocities_x.length; c++) {
		for (var r = 0; r < velocities_x[c].length; r++) {
			lbm_context.fillStyle = get_color(velocities_x[c][r], velocities_y[c][r], velocities_lengths[c][r], max_len);
			lbm_context.fillRect(c, r, 1, 1);
		}
	}
}

function get_color(v_x, v_y, v_length, max_v_length) {
	// direction of velocity determines color (hue)
	var h = Math.floor(Math.atan2(v_y, v_x) * 179 / Math.PI + 180);

	var s = 1;

	// length of velocity determines brightness (value)
	var v = v_length / max_v_length;

	// convert hsv->rgb
	// h in [0, 360], s, v in [0, 1]
	var i = Math.floor(h / 60);
	var f = h / 60 - i;
	var p = v * (1 - s);
	var q = v * (1 - s * f);
	var t = v * (1 - s * (1 - f));
	var r, g, b;
	switch(i) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
	}
	return "rgb(" + Math.floor(r * 255) + ", " + Math.floor(g * 255) + ", " + Math.floor(b * 255) + ")";
}

function get_max_length(velocities_x, velocities_y, lengths) {
	var max_len = 0;
	for (var c = 0; c < velocities_x.length; c++) {
		for (var r = 0; r < velocities_x[c].length; r++) {
			var len = Math.sqrt(Math.pow(velocities_x[c][r], 2) + Math.pow(velocities_y[c][r], 2));
			lengths[c][r] = len;
			if (len > max_len) {
				max_len = len;
			}
		}
	}
	return max_len;
}