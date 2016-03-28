var init_density = 100;
var impulse_density = 0.3;

function init_cells_impulse(cells) {
	var zero_vel = new Vec2(0, 0);
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			for (var i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, init_density, zero_vel, 0);
			}
		}
	}
}

function impulse(cells, position, radius) {
	var radius_sqr = Math.pow(radius, 2);
	var radius2_sqr = 2 * radius_sqr;
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			var dens;

			// (squared) distance from position
			var dist_sqr = Math.pow(r - position.y, 2) + Math.pow(c - position.x, 2);

			// use 2 areas of same size; increase density in one, decrease it in the other to keep overall density roughly constant
			if (dist_sqr < radius_sqr) {
				dens = 1 + impulse_density;
			} else if (dist_sqr < radius2_sqr) {
				dens = 1 - impulse_density;
			} else {
				continue;
			}

			dens *= get_density(cells[c][r]);
			var vel = get_velocity(cells[c][r], dens);
			for (var i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, dens, vel, 0);
			}
		}
	}
}