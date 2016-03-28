var lbm_canvas;
var lbm_context;
var lbm_worker;
var lbm_btn_run;
var lbm_btn_stop;
var lbm_btn_continue;

var GRID_SIZE_X = 100;
var GRID_SIZE_Y = 100;
var SCALE = 3;

var mouse_x, mouse_y;

var FPS = 30;
var DRAW_INTERVAL = 1000 / FPS;

var velocities_x, velocities_y;

function on_body_load() {
	lbm_btn_run = document.getElementById("lbm_btn_run");
	lbm_btn_stop = document.getElementById("lbm_btn_stop");
	lbm_btn_continue = document.getElementById("lbm_btn_continue");
	lbm_btn_continue.disabled = true;

	lbm_canvas = document.getElementById("lbm_canvas");
	lbm_context = lbm_canvas.getContext("2d");
	lbm_canvas.setAttribute("height", GRID_SIZE_Y * SCALE);
	lbm_canvas.setAttribute("width", GRID_SIZE_X * SCALE);
	lbm_context.scale(SCALE, SCALE);

	// mouse handling
	lbm_canvas.onclick = mouse_click;
	lbm_canvas.onmousemove = mouse_moved;

	// initialize worker
	lbm_worker = new Worker("js/lbm.min.js");
	lbm_worker.onmessage = worker_message;
	set_lbm_option("cols", GRID_SIZE_X);
	set_lbm_option("rows", GRID_SIZE_Y);

	draw_loop();
}

function get_color(v_x, v_y) {
	var len = Math.sqrt(v_x * v_x + v_y * v_y);

	// direction of velocity determines color (hue)
	var h = Math.floor(Math.atan2(v_y, v_x) * 179 / Math.PI + 180);

	var s = 1;

	// length of velocity determines brightness (value)
	var v = Math.max(0, Math.min(255, len * 1000)) / 255;

	// convert hsv->rgb
	// h in [0, 360], s, v in [0, 1]
	var i = Math.floor(h / 60);
	var f = h / 60 - i;
	var p = v * (1 - s);
	var q = v * (1 - s * f);
	var t = v * (1 - s * (1 - f));
	var r, g, b;
	switch(i){
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

function redraw() {
	for (var c = 0; c < velocities_x.length; c++) {
		for (var r = 0; r < velocities_x[c].length; r++) {
			lbm_context.fillStyle = get_color(velocities_x[c][r], velocities_y[c][r]);
			lbm_context.fillRect(c, r, 1, 1);
		}
	}
}

function worker_message(ev) {
	// ev.data contains velocities
	velocities_x = ev.data.velocities_x;
	velocities_y = ev.data.velocities_y;
}

function draw_loop() {
	// no data before 1st worker message
	if (typeof velocities_x != "undefined" && typeof velocities_y != "undefined") {
		redraw();
	}
	
	// interval determined by FPS
	setTimeout(draw_loop, DRAW_INTERVAL);
}

function set_lbm_option(option, value) {
	lbm_worker.postMessage({"cmd": "set", "option": option, "value": value});
}

function lbm_run() {
	lbm_btn_continue.disabled = true;
	lbm_btn_stop.disabled = false;
	lbm_worker.postMessage({"cmd": "run"});
}

function lbm_stop() {
	lbm_btn_continue.disabled = false;
	lbm_btn_stop.disabled = true;
	lbm_worker.postMessage({"cmd": "stop"});
}

function lbm_continue() {
	lbm_btn_continue.disabled = true;
	lbm_btn_stop.disabled = false;
	lbm_worker.postMessage({"cmd": "continue"});
}

function mouse_moved(ev) {
	mouse_x = ev.pageX / SCALE | 0;
	mouse_y = ev.pageY / SCALE | 0;
}

function mouse_click() {
	lbm_worker.postMessage({"cmd": "mouse_click", "mouse_x": mouse_x, "mouse_y": mouse_y});
}