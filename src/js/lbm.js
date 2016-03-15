// visualization parameters
var GRID_SIZE_X = 150;
var GRID_SIZE_Y = 100;
var SCALE = 3;

// LBM parameters
var omega = 1.9;
var c_spd = 1;
var c2 = Math.pow(c_spd, 2);
var c4 = Math.pow(c2, 2);

// use 2 arrays to switch between when streaming
var cells1, cells2, cells;
var which_cells = true;

// dirac
var init_density = 100;
var radius_sqr = 20 * 20;
var radius_density = 200;

// constants
var FOUR_DIV_9 = 4 / 9;
var ONE_DIV_9 = 1 / 9;
var ONE_DIV_36 = 1 / 36;

// cell structure (subcell numbers):
// 6 2 5
// 3 0 1
// 7 4 8
var directions = [	new Vec2(0, 0),
					new Vec2(1, 0),
					new Vec2(0, -1),
					new Vec2(-1, 0),
					new Vec2(0, 1),
					new Vec2(1, -1),
					new Vec2(-1, -1),
					new Vec2(-1, 1),
					new Vec2(1, 1)	];


function make_cells(cols, rows) {
	var cells = new Array(cols);
	for (var c = 0; c < cols; c++) {
		cells[c] = new Array(rows);
		for (var r = 0; r < rows; r++) {
			cells[c][r] = new Array(9);
		}
	}
	return cells;
}

function init_cells_dirac(cells) {
	var center_x = GRID_SIZE_X / 2;
	var center_y = GRID_SIZE_Y / 2;
	var zeroVel = new Vec2(0, 0);
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			for (var i = 0; i < 9; i++) {
				if (Math.pow(r - center_y, 2) + Math.pow(c - center_x, 2) < radius_sqr) {
					cells[c][r][i] = get_equi(i, radius_density, zeroVel, 0);
				} else {
					cells[c][r][i] = get_equi(i, init_density, zeroVel, 0);
				}
			}
		}
	}
}

function propagate(cells_src, cells_dst) {
	var max_c = cells_src.length - 1;
	var max_r = cells_src[max_c].length - 1;
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

	// edges
	bounceback_top(cells_src, cells_dst);
	bounceback_bottom(cells_src, cells_dst);
	bounceback_left(cells_src, cells_dst);
	bounceback_right(cells_src, cells_dst);

	// corners
	bounceback_topleft(cells_src, cells_dst);
	bounceback_topright(cells_src, cells_dst);
	bounceback_bottomleft(cells_src, cells_dst);
	bounceback_bottomright(cells_src, cells_dst);
}

function collision(cells_coll) {
	for (var c = 0; c < cells_coll.length; c++) {
		for (var r = 0; r < cells_coll[c].length; r++) {
			var density = get_density(cells_coll[c][r]);
			var velocity = get_velocity(cells_coll[c][r]);
			var vv = velocity.dot(velocity);
			for (var i = 0; i < 9; i++) {
				cells_coll[c][r][i] = (1 - omega) * cells_coll[c][r][i] + omega * get_equi(i, density, velocity, vv);
			}
		}
	}
}

function simulate() {
	if (which_cells) {
		propagation(cells1, cells2);
		cells = cells2;
	} else {
		propagation(cells2, cells1);
		cells = cells1;
	}
	which_cells = !which_cells;
	collision(cells);
	
	repaint();

	// schedule next step
	setTimeout(simulate, 1);
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

function init() {
	cells1 = make_cells(GRID_SIZE_X, GRID_SIZE_Y);
	cells2 = make_cells(GRID_SIZE_X, GRID_SIZE_Y);
	init_cells_dirac(cells1);
	init_cells_dirac(cells2);
	cells = cells1;
	simulate();
}