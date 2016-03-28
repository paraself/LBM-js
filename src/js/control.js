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

var FPS = 60;
var DRAW_INTERVAL = 1000 / FPS;

var densities;

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

	lbm_canvas.onclick = mouse_click;
	lbm_canvas.onmousemove = mouse_moved;

	// initialize worker
	lbm_worker = new Worker("js/lbm.min.js");
	lbm_worker.onmessage = worker_message;
	set_lbm_option("cols", GRID_SIZE_X);
	set_lbm_option("rows", GRID_SIZE_Y);

	draw_loop();
}

function get_color(density) {
	var col = 255 - density | 0; // truncate
	return "rgb(" + col + ", " + col + ", " + col + ")";
}

function redraw() {
	for (var c = 0; c < densities.length; c++) {
		for (var r = 0; r < densities[c].length; r++) {
			lbm_context.fillStyle = get_color(densities[c][r]);
			lbm_context.fillRect(c, r, 1, 1);
		}
	}
}

function worker_message(ev) {
	// ev.data contains array of densities
	densities = ev.data;
}

function draw_loop() {
	// no densities before 1st worker message
	if (typeof densities != "undefined") {
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