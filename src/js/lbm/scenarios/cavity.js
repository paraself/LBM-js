var scenario_cavity = {
	init_cells: init_cells_cavity,
	mouse_action: undefined,
	boundary: {
		bottom: bounceback_bottom,
		left: bounceback_left,
		right: bounceback_right,
		bottomleft: bounceback_bottomleft,
		bottomright: bounceback_bottomright
	},
	options: {
		init_density: 1,
		flow_vel: 0.5
	}
};

function init_cells_cavity(cells) {
	var zero_vel = new Vec2(0, 0);
	var flow_vel = new Vec2(scenario_cavity.options.flow_vel, 0);
	for (var c = 0; c < cells.length; c++) {
		
		// top flow
		for (var i = 0; i < 9; i++) {
			cells[c][0][i] = get_equi(i, scenario_cavity.options.init_density, flow_vel, 0);
		}
		
		// the rest
		for (var r = 1; r < cells[c].length; r++) {
			for (i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, scenario_cavity.options.init_density, zero_vel, 0);
			}
		}
	}
}