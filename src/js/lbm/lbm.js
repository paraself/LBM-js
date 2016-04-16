// defaults
var lbm_options = {
	omega: 1.5,
	c: 1,
	rows: 100,
	cols: 100
};

// powers of c
var c2, c4;

// use 2 arrays to switch between when streaming
var cells1, cells2, cells;
var obstacles;
var densities;
var velocities_x, velocities_y;
var which_cells = true;

// constants
var FOUR_DIV_9 = 4 / 9;
var ONE_DIV_9 = 1 / 9;
var ONE_DIV_36 = 1 / 36;

// cell structure (subcell numbers):
// 6 2 5
// 3 0 1
// 7 4 8
var directions = [
	new Vec2(0, 0),
	new Vec2(1, 0),
	new Vec2(0, -1),
	new Vec2(-1, 0),
	new Vec2(0, 1),
	new Vec2(1, -1),
	new Vec2(-1, -1),
	new Vec2(-1, 1),
	new Vec2(1, 1)
];

var SCENARIOS = {
	0: new Impulse(),
	1: new Cavity(),
	2: new Flow()
};

// scenario contains initialization, boundary conditions and mouse action
var active_scenario;

var stop = true;

function update_values() {
	c2 = Math.pow(get_option("c"), 2);
	c4 = Math.pow(c2, 2);
}

function make_cells(cols, rows) {
	cells1 = new Array(cols);
	cells2 = new Array(cols);
	densities = new Array(cols);
	velocities_x = new Array(cols);
	velocities_y = new Array(cols);
	obstacles = new Array(cols);
	for (var c = 0; c < cols; c++) {
		cells1[c] = new Array(rows);
		cells2[c] = new Array(rows);
		densities[c] = new Array(rows);
		velocities_x[c] = new Array(rows);
		velocities_y[c] = new Array(rows);
		obstacles[c] = new Array(rows);
		for (var r = 0; r < rows; r++) {
			cells1[c][r] = new Array(9);
			cells2[c][r] = new Array(9);
			obstacles[c][r] = false;
		}
	}
}

function propagate(cells_src, cells_dst) {
	for (var c = 1; c < cells_src.length - 1; c++) {
		for (var r = 1; r < cells_src[c].length - 1; r++) {
			if (!obstacles[c][r]) {
				cells_dst[c][r][0] = cells_src[c][r][0];
				cells_dst[c][r][1] = cells_src[c - 1][r][1];
				cells_dst[c][r][2] = cells_src[c][r + 1][2];
				cells_dst[c][r][3] = cells_src[c + 1][r][3];
				cells_dst[c][r][4] = cells_src[c][r - 1][4];
				cells_dst[c][r][5] = cells_src[c - 1][r + 1][5];
				cells_dst[c][r][6] = cells_src[c + 1][r + 1][6];
				cells_dst[c][r][7] = cells_src[c + 1][r - 1][7];
				cells_dst[c][r][8] = cells_src[c - 1][r - 1][8];
			}
		}
	}
}

function propagation(cells_src, cells_dst) {
	// middle
	propagate(cells_src, cells_dst);

	// all boundary conditions
	active_scenario.boundary(cells_src, cells_dst);
	bounceback_obstacles(cells_src, cells_dst, obstacles);
}

function collision(cells) {
	var omega = get_option("omega");
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {

			// save densities & velocities for visualization
			densities[c][r] = get_density(cells[c][r]);
			var velocity = get_velocity(cells[c][r], densities[c][r]);
			velocities_x[c][r] = velocity.x;
			velocities_y[c][r] = velocity.y;

			var v_dot_v = velocity.dot(velocity);
			for (var i = 0; i < 9; i++) {
				cells[c][r][i] = (1 - omega) * cells[c][r][i] + omega * get_equi(i, densities[c][r], velocity, v_dot_v);
			}
		}
	}
}

function simulate() {
	if (!stop) {
		if (which_cells) {
			propagation(cells1, cells2);
			cells = cells2;
		} else {
			propagation(cells2, cells1);
			cells = cells1;
		}
		which_cells = !which_cells;
		collision(cells);

		// update views
		message("update", {velocities_x: velocities_x, velocities_y: velocities_y});

		// use setTimeout to still be able to receive messages
		setTimeout(simulate, 0);
	}
}

function get_density(cell) {
	return cell[0] + cell[1] + cell[2] + cell[3] + cell[4] + cell[5] + cell[6] + cell[7] + cell[8];
}

function get_velocity(cell, density) {
	var velocity = new Vec2(cell[5] + cell[1] + cell[8] - cell[6] - cell[3] - cell[7], cell[7] + cell[4] + cell[8] - cell[6] - cell[2] - cell[5]);
	velocity.mult(1 / density);
	return velocity;
}

function get_equi(subcell_num, density, velocity, v_dot_v) {
	var d_dot_v;
	switch(subcell_num) {
		case 0:
			return FOUR_DIV_9 * density * (1 - 1.5 * v_dot_v / c2);
		case 1:
		case 2:
		case 3:
		case 4:
			d_dot_v = velocity.dot(directions[subcell_num]);
			return ONE_DIV_9 * density * (1 + 3 * d_dot_v / c2 + 4.5 * Math.pow(d_dot_v, 2) / c4 - 1.5 * v_dot_v / c2);
		case 5:
		case 6:
		case 7:
		case 8:
			d_dot_v = velocity.dot(directions[subcell_num]);
			return ONE_DIV_36 * density * (1 + 3 * d_dot_v / c2 + 4.5 * Math.pow(d_dot_v, 2) / c4 - 1.5 * v_dot_v / c2);
	}
}

function set_options(options) {
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			// option of scenario has higher priority
			if (active_scenario !== undefined && active_scenario.options.hasOwnProperty(key)) {
				active_scenario.options[key] = value[key];
			} else if (lbm_options.hasOwnProperty(key)) {
				lbm_options[key] = options[key];

				// parameters may have changed
				update_values();
			}
		}
	}
}

function get_option(option) {
	// option of scenario has higher priority
	if (active_scenario !== undefined && active_scenario.options !== undefined && active_scenario.options.hasOwnProperty(option)) {
		return active_scenario.options[option];
	} else if (lbm_options.hasOwnProperty(option)) {
		return lbm_options[option];
	}
}

function set_scenario(scenario) {
	if (SCENARIOS.hasOwnProperty(scenario)) {
		active_scenario = SCENARIOS[scenario];
	}
}

function run_sim() {
	stop_sim();
	if (active_scenario !== undefined) {
		init();
	}
	start_sim();
}

function stop_sim() {
	stop = true;
}

function start_sim() {
	if (active_scenario !== undefined) {
		stop = false;
		simulate();
	}
}

function mouse_click(x, y) {
	if (!stop && active_scenario.mouse_action !== undefined) {
		active_scenario.mouse_action(cells, new Vec2(x, y));
	}
}

function message(cmd, value) {
	postMessage({cmd: cmd, value: value});
}

// message handler
self.onmessage = function(ev) {
	var cmd = ev.data.cmd;
	var value = ev.data.value;
	switch (cmd) {
		case "set":
			set_options(value);
			break;
		case "run":
			run_sim();
			break;
		case "stop":
			stop_sim();
			break;
		case "continue":
			start_sim();
			break;
		case "mouse_click":
			mouse_click(value.mouse_x, value.mouse_y);
			break;
		case "select":
			set_scenario(value);
			break;
	}
};

function init() {
	make_cells(get_option("cols"), get_option("rows"));
	active_scenario.init_cells(cells1);
	active_scenario.init_cells(cells2);
	if (active_scenario.init_obstacles !== undefined) {
		active_scenario.init_obstacles(obstacles);
	}
	cells = cells1;
	update_values();
}