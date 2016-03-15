function Vec2(x, y) {
	this.x = x;
	this.y = y;

	this.mult = function(val) {
		this.x *= val;
		this.y *= val;
	};

	this.addVec2 = function(v) {
		this.x += v.x;
		this.y += v.y;
	};

	this.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	};
}