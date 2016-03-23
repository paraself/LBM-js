var lbm_options = {
	"omega": 1.8,
	"c": 1
};

var c2 = Math.pow(lbm_options.c, 2);
var c4 = Math.pow(c2, 2);

// use 2 arrays to switch between when streaming
var cells1, cells2, cells;
var densities;
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

// functions to be used
var init_cells = init_cells_dirac;
var boundary = {
	"top": bounceback_top,
	"bottom": bounceback_bottom,
	"left": bounceback_left,
	"right": bounceback_right,
	"topleft": bounceback_topleft,
	"bottomleft": bounceback_bottomleft,
	"topright": bounceback_topright,
	"bottomright": bounceback_bottomright
};

var stop = true;

function make_cells(cols, rows) {
	cells1 = new Array(cols);
	cells2 = new Array(cols);
	densities = new Array(cols);
	for (var c = 0; c < cols; c++) {
		cells1[c] = new Array(rows);
		cells2[c] = new Array(rows);
		densities[c] = new Array(rows);
		for (var r = 0; r < rows; r++) {
			cells1[c][r] = new Array(9);
			cells2[c][r] = new Array(9);
		}
	}
}

function propagate(cells_src, cells_dst) {
	for (var c = 1; c < cells_src.length - 1; c++) {
		for (var r = 1; r < cells_src[c].length - 1; r++) {
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

function propagation(cells_src, cells_dst) {
	// middle
	propagate(cells_src, cells_dst);

	// all boundary conditions
	for (var key in boundary) {
		boundary[key](cells_src, cells_dst);
	}
}

function collision(cells_coll) {
	for (var c = 0; c < cells_coll.length; c++) {
		for (var r = 0; r < cells_coll[c].length; r++) {

			// save densities for visualization
			densities[c][r] = get_density(cells_coll[c][r]);
			var velocity = get_velocity(cells_coll[c][r]);
			var v_dot_v = velocity.dot(velocity);
			for (var i = 0; i < 9; i++) {
				cells_coll[c][r][i] = (1 - lbm_options.omega) * cells_coll[c][r][i] + lbm_options.omega * get_equi(i, densities[c][r], velocity, v_dot_v);
			}
		}
	}
}

function simulate() {
	while (!stop) {
		if (which_cells) {
			propagation(cells1, cells2);
			cells = cells2;
		} else {
			propagation(cells2, cells1);
			cells = cells1;
		}
		which_cells = !which_cells;
		collision(cells);
		
		postMessage(densities);
	}
}

function get_density(cell) {
	return cell[0] + cell[1] + cell[2] + cell[3] + cell[4] + cell[5] + cell[6] + cell[7] + cell[8];
}

function get_velocity(cell) {
	var velocity = new Vec2(cell[5] + cell[1] + cell[8] - cell[6] - cell[3] - cell[7], cell[7] + cell[4] + cell[8] - cell[6] - cell[2] - cell[5]);
	velocity.mult(1 / get_density(cell));
	return velocity;
}

function get_equi(subcell_num, density, velocity, v_dot_v) {
	var dv;
	switch(subcell_num) {
		case 0:
			return FOUR_DIV_9 * density * (1 - 1.5 * v_dot_v / c2);
		case 1:
		case 2:
		case 3:
		case 4:
			dv = velocity.dot(directions[subcell_num]);
			return ONE_DIV_9 * density * (1 + 3 * dv / c2 + 4.5 * Math.pow(dv, 2) / c4 - 1.5 * v_dot_v / c2);
		case 5:
		case 6:
		case 7:
		case 8:
			dv = velocity.dot(directions[subcell_num]);
			return ONE_DIV_36 * density * (1 + 3 * dv / c2 + 4.5 * Math.pow(dv, 2) / c4 - 1.5 * v_dot_v / c2);
	}
}

// message handler
self.onmessage = function(ev) {
	var cmd = ev.data.cmd;
	var value = ev.data.value;
	switch (cmd) {
		case "set":
			var option = ev.data.option;
			lbm_options[option] = value;
			break;
		case "run":
			if (stop) {
				stop = false;
				run();
			}
			break;
		case "pause":
			stop = true;
			break;
		case "continue":
			if (stop) {
				stop = false;
				simulate();
			}
			break;
	}
};

function run() {
	make_cells(lbm_options.cols, lbm_options.rows);
	init_cells(cells1);
	init_cells(cells2);
	cells = cells1;
	simulate();
}