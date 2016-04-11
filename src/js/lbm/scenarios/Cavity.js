function Cavity() {
	var	options = {
		init_density: 1,
		flow_vel: 0.5
	};

	this.boundary = function(cells_src, cells_dst) {
		bounceback_bottom(cells_src, cells_dst);
		bounceback_left(cells_src, cells_dst);
		bounceback_right(cells_src, cells_dst);
		bounceback_bottomleft(cells_src, cells_dst);
		bounceback_bottomright(cells_src, cells_dst);
	};

	this.init_cells = function (cells) {
		var zero_vel = new Vec2(0, 0);
		var flow_vel = new Vec2(options.flow_vel, 0);
		var v_dot_v = flow_vel.dot(flow_vel);

		for (var c = 0; c < cells.length; c++) {

			// top flow
			for (var i = 0; i < 9; i++) {
				cells[c][0][i] = get_equi(i, options.init_density, flow_vel, v_dot_v);
			}

			// the rest
			for (var r = 1; r < cells[c].length; r++) {
				for (i = 0; i < 9; i++) {
					cells[c][r][i] = get_equi(i, options.init_density, zero_vel, 0);
				}
			}
		}
	};
}