var scenario_flow = {
	init_cells: init_cells_flow,
	mouse_action: undefined,
	boundary: {
		top: bounceback_top,
		bottom: bounceback_bottom,
		topleft: bounceback_topleft,
		bottomleft: bounceback_bottomleft,
		topright: bounceback_topright,
		bottomright: bounceback_bottomright
	},
	options: {
		init_density: 1,
		density_left: 1.5,
		density_right: 0.5,
		init_velocity: 0
	}
};

function init_cells_flow(cells) {
	var flow_vel = new Vec2(scenario_flow.options.init_velocity, 0);
	var v_dot_v = flow_vel.dot(flow_vel);
	var max_c = cells.length - 1;
	
	for (var r = 0; r < cells[0].length; r++) {
		
		// left & right
		for (var i = 0; i < 9; i++) {
			cells[0][r][i] = get_equi(i, scenario_flow.options.density_left, flow_vel, v_dot_v);
			cells[max_c][r][i] = get_equi(i, scenario_flow.options.density_right, flow_vel, v_dot_v);
		}
		
		// the rest
		for (var c = 1; c < max_c; c++) {
			for (i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, scenario_flow.options.init_density, flow_vel, v_dot_v);
			}
		}		
	}
}