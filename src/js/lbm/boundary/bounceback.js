function bounceback_top(cells_src, cells_dst) {
	for (var c = 1; c < cells_src.length - 1; c++) {
		cells_dst[c][0][0] = cells_src[c][0][0];
		cells_dst[c][0][1] = cells_src[c - 1][0][1];
		cells_dst[c][0][2] = cells_src[c][1][2];
		cells_dst[c][0][3] = cells_src[c + 1][0][3];
		cells_dst[c][0][4] = cells_src[c][0][2];
		cells_dst[c][0][5] = cells_src[c - 1][1][5];
		cells_dst[c][0][6] = cells_src[c + 1][1][6];
		cells_dst[c][0][7] = cells_src[c][0][5];
		cells_dst[c][0][8] = cells_src[c][0][6];
	}
}

function bounceback_bottom(cells_src, cells_dst) {
	var max_r = cells_src[0].length - 1;
	for (var c = 1; c < cells_src.length - 1; c++) {
		cells_dst[c][max_r][0] = cells_src[c][max_r][0];
		cells_dst[c][max_r][1] = cells_src[c - 1][max_r][1];
		cells_dst[c][max_r][2] = cells_src[c][max_r][4];
		cells_dst[c][max_r][3] = cells_src[c + 1][max_r][3];
		cells_dst[c][max_r][4] = cells_src[c][max_r - 1][4];
		cells_dst[c][max_r][5] = cells_src[c][max_r][7];
		cells_dst[c][max_r][6] = cells_src[c][max_r][8];
		cells_dst[c][max_r][7] = cells_src[c + 1][max_r - 1][7];
		cells_dst[c][max_r][8] = cells_src[c - 1][max_r - 1][8];
	}
}

function bounceback_left(cells_src, cells_dst) {
	for (var r = 1; r < cells_src[0].length - 1; r++) {
		cells_dst[0][r][0] = cells_src[0][r][0];
		cells_dst[0][r][1] = cells_src[0][r][3];
		cells_dst[0][r][2] = cells_src[0][r + 1][2];
		cells_dst[0][r][3] = cells_src[1][r][3];
		cells_dst[0][r][4] = cells_src[0][r - 1][4];
		cells_dst[0][r][5] = cells_src[0][r][7];
		cells_dst[0][r][6] = cells_src[1][r + 1][6];
		cells_dst[0][r][7] = cells_src[1][r - 1][7];
		cells_dst[0][r][8] = cells_src[0][r][6];
	}
}

function bounceback_right(cells_src, cells_dst) {
	var max_c = cells_src.length - 1;
	for (var r = 1; r < cells_src[0].length - 1; r++) {
		cells_dst[max_c][r][0] = cells_src[max_c][r][0];
		cells_dst[max_c][r][1] = cells_src[max_c - 1][r][1];
		cells_dst[max_c][r][2] = cells_src[max_c][r + 1][2];
		cells_dst[max_c][r][3] = cells_src[max_c][r][1];
		cells_dst[max_c][r][4] = cells_src[max_c][r - 1][4];
		cells_dst[max_c][r][5] = cells_src[max_c - 1][r + 1][5];
		cells_dst[max_c][r][6] = cells_src[max_c][r][8];
		cells_dst[max_c][r][7] = cells_src[max_c][r][5];
		cells_dst[max_c][r][8] = cells_src[max_c - 1][r - 1][8];
	}
}

function bounceback_topleft(cells_src, cells_dst) {
	cells_dst[0][0][0] = cells_src[0][0][0];
	cells_dst[0][0][1] = cells_src[0][0][3];
	cells_dst[0][0][2] = cells_src[0][1][2];
	cells_dst[0][0][3] = cells_src[1][0][3];
	cells_dst[0][0][4] = cells_src[0][0][2];
	cells_dst[0][0][6] = cells_src[1][1][6];
	cells_dst[0][0][8] = cells_src[0][0][6];
}

function bounceback_topright(cells_src, cells_dst) {
	var max_c = cells_src.length - 1;
	cells_dst[max_c][0][0] = cells_src[max_c][0][0];
	cells_dst[max_c][0][1] = cells_src[max_c - 1][0][1];
	cells_dst[max_c][0][2] = cells_src[max_c][1][2];
	cells_dst[max_c][0][3] = cells_src[max_c][0][1];
	cells_dst[max_c][0][4] = cells_src[max_c][0][2];
	cells_dst[max_c][0][5] = cells_src[max_c - 1][1][5];
	cells_dst[max_c][0][7] = cells_src[max_c][0][5];
}

function bounceback_bottomleft(cells_src, cells_dst) {
	var max_r = cells_src[0].length - 1;
	cells_dst[0][max_r][0] = cells_src[0][max_r][0];
	cells_dst[0][max_r][1] = cells_src[0][max_r][3];
	cells_dst[0][max_r][2] = cells_src[0][max_r][4];
	cells_dst[0][max_r][3] = cells_src[1][max_r][3];
	cells_dst[0][max_r][4] = cells_src[0][max_r - 1][2];
	cells_dst[0][max_r][5] = cells_src[0][max_r][7];
	cells_dst[0][max_r][7] = cells_src[1][max_r - 1][7];
}

function bounceback_bottomright(cells_src, cells_dst) {
	var max_c = cells_src.length - 1;
	var max_r = cells_src[0].length - 1;
	cells_dst[max_c][max_r][0] = cells_src[max_c][max_r][0];
	cells_dst[max_c][max_r][1] = cells_src[max_c - 1][max_r][1];
	cells_dst[max_c][max_r][2] = cells_src[max_c][max_r][4];
	cells_dst[max_c][max_r][3] = cells_src[max_c][max_r][1];
	cells_dst[max_c][max_r][4] = cells_src[max_c][max_r - 1][4];
	cells_dst[max_c][max_r][6] = cells_src[max_c][max_r][8];
	cells_dst[max_c][max_r][8] = cells_src[max_c - 1][max_r - 1][8];
}