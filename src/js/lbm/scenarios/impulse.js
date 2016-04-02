var scenario_impulse = {
	init_cells: init_cells_impulse,
	mouse_action: impulse,
	boundary: {
		top: bounceback_top,
		bottom: bounceback_bottom,
		left: bounceback_left,
		right: bounceback_right,
		topleft: bounceback_topleft,
		bottomleft: bounceback_bottomleft,
		topright: bounceback_topright,
		bottomright: bounceback_bottomright
	},
	options: {
		init_density: 1,
		impulse_intensity: 0.3,
		radius: 10
	}
};

function init_cells_impulse(cells) {
	var zero_vel = new Vec2(0, 0);
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			for (var i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, scenario_impulse.options.init_density, zero_vel, 0);
			}
		}
	}
}

function impulse(cells, position) {
	var radius_sqr = Math.pow(scenario_impulse.options.radius, 2);
	var radius2_sqr = 2 * radius_sqr;
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			var dens;

			// (squared) distance from position
			var dist_sqr = Math.pow(r - position.y, 2) + Math.pow(c - position.x, 2);

			// use 2 areas of same size; increase density in one, decrease it in the other to keep overall density roughly constant
			if (dist_sqr < radius_sqr) {
				dens = 1 + scenario_impulse.options.impulse_intensity;
			} else if (dist_sqr < radius2_sqr) {
				dens = 1 - scenario_impulse.options.impulse_intensity;
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