var init_density = 100;
var radius_sqr = 20 * 20;
var radius_density = 200;

function init_cells_dirac(cells) {
	var center_x = lbm_options.cols / 2;
	var center_y = lbm_options.rows / 2;
	var zero_vel = new Vec2(0, 0);
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			var dens;

			// check whether cell is within radius
			if (Math.pow(r - center_y, 2) + Math.pow(c - center_x, 2) < radius_sqr) {
				dens = radius_density;
			} else {
				dens = init_density;
			}
			for (var i = 0; i < 9; i++) {
				cells[c][r][i] = get_equi(i, dens, zero_vel, 0);
			}
		}
	}
}