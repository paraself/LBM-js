var lbmCanvas;
var lbmContext;

function on_body_load() {
	lbmCanvas = document.getElementById("lbm_canvas");
	lbmContext = lbmCanvas.getContext("2d");
	lbmCanvas.setAttribute("height", GRID_SIZE_Y * SCALE);
	lbmCanvas.setAttribute("width", GRID_SIZE_X * SCALE);
	init();
}

function get_color(cell) {
	var col = cell[0] + cell[1] + cell[2] + cell[3] + cell[4] + cell[5] + cell[6] + cell[7] + cell[8];
	col = 255 - col | 0; // truncate
	return "rgb(" + col + ", " + col + ", " + col + ")";
}

function repaint() {
	for (var c = 0; c < cells.length; c++) {
		for (var r = 0; r < cells[c].length; r++) {
			lbmContext.fillStyle = get_color(cells[c][r]);
			lbmContext.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
		}
	}
}