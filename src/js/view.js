var lbm_canvas;
var lbm_context;
var image_data;
var canvas_scale, canvas_width;

var velocities_x, velocities_y, velocities_lengths;

function draw_init(cols, rows, scale) {
	velocities_lengths = new Array(cols);
	for (var i = 0; i < cols; i++) {
		velocities_lengths[i] = new Array(rows);
	}

	canvas_scale = scale;
	canvas_width = cols * scale;

	lbm_canvas = document.getElementById("lbm_canvas");
	lbm_context = lbm_canvas.getContext("2d");
	image_data = lbm_context.createImageData(cols * scale, rows * scale);

	draw();
}

function worker_message(ev) {
	velocities_x = ev.data.velocities_x;
	velocities_y = ev.data.velocities_y;
}

function draw() {
	// no data before 1st worker message
	if (typeof velocities_x != "undefined" && typeof velocities_y != "undefined") {
		redraw();
	}

	requestAnimationFrame(draw);
}

function redraw() {

	// this also populates velocities_lengths
	var max_len = get_max_length(velocities_x, velocities_y, velocities_lengths);
	for (var c = 0; c < velocities_x.length; c++) {
		for (var r = 0; r < velocities_x[c].length; r++) {
			var col = get_color(velocities_x[c][r], velocities_y[c][r], velocities_lengths[c][r], max_len);
			set_pixel(image_data.data, c, r, col, canvas_scale, canvas_width);
		}
	}
	lbm_context.putImageData(image_data, 0, 0);
}

function set_pixel(data, pos_x, pos_y, color, scale, width) {
	for (var x = scale * pos_x; x < scale * (pos_x + 1); x++) {
		for (var y = scale * pos_y; y < scale * (pos_y + 1); y++) {
			var idx = 4 * (y * width + x);
			data[idx++] = color[0];
			data[idx++] = color[1];
			data[idx++] = color[2];
			data[idx++] = color[3];
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

	// return [r, g, b, a]
	switch(i) {
		case 0: return [Math.floor(v * 255), Math.floor(t * 255), Math.floor(p * 255), 255];
		case 1: return [Math.floor(q * 255), Math.floor(v * 255), Math.floor(p * 255), 255];
		case 2: return [Math.floor(p * 255), Math.floor(v * 255), Math.floor(t * 255), 255];
		case 3: return [Math.floor(p * 255), Math.floor(q * 255), Math.floor(v * 255), 255];
		case 4: return [Math.floor(t * 255), Math.floor(p * 255), Math.floor(v * 255), 255];
		case 5: return [Math.floor(v * 255), Math.floor(p * 255), Math.floor(q * 255), 255];
		default: return [0, 0, 0, 255];
	}
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