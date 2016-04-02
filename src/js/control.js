var lbm_canvas;
var lbm_worker;
var lbm_btn_run;
var lbm_btn_stop;
var lbm_btn_continue;

var GRID_SIZE_X = 100;
var GRID_SIZE_Y = 100;
var SCALE = 3;

var mouse_x, mouse_y;

function on_body_load() {
	lbm_btn_run = document.getElementById("lbm_btn_run");
	lbm_btn_stop = document.getElementById("lbm_btn_stop");
	lbm_btn_continue = document.getElementById("lbm_btn_continue");
	lbm_btn_continue.disabled = true;

	lbm_canvas = document.getElementById("lbm_canvas");
	lbm_canvas.setAttribute("height", GRID_SIZE_Y * SCALE);
	lbm_canvas.setAttribute("width", GRID_SIZE_X * SCALE);

	// mouse handling
	lbm_canvas.onclick = mouse_click;
	lbm_canvas.onmousemove = mouse_moved;

	// initialize worker
	lbm_worker = new Worker("js/lbm.min.js");
	lbm_worker.onmessage = worker_message;
	set_lbm_options({cols: GRID_SIZE_X, rows: GRID_SIZE_Y});

	draw_init(GRID_SIZE_X, GRID_SIZE_Y, SCALE);
}

function worker_command(cmd, value) {
	lbm_worker.postMessage({cmd: cmd, value: value});
}

function set_lbm_options(options) {
	worker_command("set", options);
}

function lbm_run() {
	lbm_btn_continue.disabled = true;
	lbm_btn_stop.disabled = false;
	worker_command("run");
}

function lbm_stop() {
	lbm_btn_continue.disabled = false;
	lbm_btn_stop.disabled = true;
	worker_command("stop");
}

function lbm_continue() {
	lbm_btn_continue.disabled = true;
	lbm_btn_stop.disabled = false;
	worker_command("continue");
}

function mouse_moved(ev) {
	mouse_x = Math.floor(ev.pageX / SCALE);
	mouse_y = Math.floor(ev.pageY / SCALE);
}

function mouse_click() {
	worker_command("mouse_click", {mouse_x: mouse_x, mouse_y: mouse_y});
}