let board = [];
let collapsed = [];

const size = 80;

let start = [];

function resetStart() {
	for (let i = 1; i <= 9; i++) {
		start[i] = [];
		for (let j = 1; j <= 9; j++) {
			start[i][j] = -1;
		}
	}
}

function resetBoard() {
	for (let i = 1; i <= 9; i++) {
		board[i] = [];
		for (let j = 1; j <= 9; j++) {
			board[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		}
	}
}

function resetCollapsed() {
	for (let i = 1; i <= 9; i++) {
		collapsed[i] = [];
		for (let j = 1; j <= 9; j++) {
			collapsed[i][j] = false;
		}
	}
}

function preload() {
	resetStart();
}

function reset() {
	resetBoard();
	resetCollapsed();

	// start[1][1] = 8;
	// start[2][3] = 7;
	// start[2][4] = 5;
	// start[2][9] = 9;
	// start[3][2] = 3;
	// start[3][7] = 1;
	// start[3][8] = 8;

	// start[4][2] = 6;
	// start[4][6] = 1;
	// start[4][8] = 5;
	// start[5][3] = 9;
	// start[5][5] = 4;
	// start[6][4] = 7;
	// start[6][5] = 5;

	// start[7][3] = 2;
	// start[7][5] = 7;
	// start[7][9] = 4;
	// start[8][6] = 3;
	// start[8][7] = 6;
	// start[8][8] = 1;
	// start[9][7] = 8;

	for (let i = 1; i <= 9; i++) {
		for (let j = 1; j <= 9; j++) {
			if (start[i][j] > -1) {
				collapse(i, j, start[i][j], true);
			}
		}
	}
}

let board_width = 3 * 3 * size;
let board_heigth = 3 * 3 * size;

let selected_i = -1;
let selected_j = -1;

function setup() {
	createCanvas(board_width + 100, board_heigth + 100);

	reset();
}

let done = true;
let impossible = false;

function collapse(ci, cj, val, starting = false) {
	board[ci][cj] = [val];

	for (let i = 1; i <= 9; i++) {
		if (i == ci) continue;

		const index = board[i][cj].indexOf(val);
		if (index > -1) {
			// only splice array when item is found
			board[i][cj].splice(index, 1); // 2nd parameter means remove one item only
			if (board[i][cj].length <= 0) {
				if (starting) {
					impossible = true;
					return;
				}
			}
		}
	}

	for (let j = 1; j <= 9; j++) {
		if (j == cj) continue;

		const index = board[ci][j].indexOf(val);
		if (index > -1) {
			// only splice array when item is found
			board[ci][j].splice(index, 1); // 2nd parameter means remove one item only
			if (board[ci][j].length <= 0) {
				if (starting) {
					impossible = true;
					return;
				}
			}
		}
	}

	let ki = floor((ci - 1) / 3);
	let kj = floor((cj - 1) / 3);

	for (let i = ki * 3 + 1; i <= ki * 3 + 3; i++) {
		for (let j = kj * 3 + 1; j <= kj * 3 + 3; j++) {
			if (ci == i && cj == j) continue;
			const index = board[i][j].indexOf(val);
			if (index > -1) {
				// only splice array when item is found
				board[i][j].splice(index, 1); // 2nd parameter means remove one item only
				if (board[i][j].length <= 0) {
					if (starting) {
						impossible = true;
						return;
					}
				}
			}
		}
	}

	collapsed[ci][cj] = true;
}

function update() {
	let min_entropy = Infinity;
	let cellsWithLeastEntropy = [];

	for (let i = 1; i <= 9; i++) {
		for (let j = 1; j <= 9; j++) {
			if (board[i][j].length <= 0) {
				reset();
				return;
			}
			if (collapsed[i][j]) continue;
			if (board[i][j].length < min_entropy) {
				min_entropy = board[i][j].length;
			}
			if (board[i][j].length == min_entropy) {
				cellsWithLeastEntropy.push([i, j]);
			}
		}
	}

	if (cellsWithLeastEntropy.length > 0) {
		let r = floor(random(cellsWithLeastEntropy.length));
		let ci = cellsWithLeastEntropy[r][0];
		let cj = cellsWithLeastEntropy[r][1];

		let val = board[ci][cj][floor(random(board[ci][cj].length))];

		collapse(ci, cj, val);
	} else {
		done = true;
	}
}

function draw() {
	while (!done && !impossible) {
		update();
	}
	background(220);

	push();

	noStroke();
	fill(255, 255, 255);
	rect(0, 0, board_width, board_heigth);
	pop();

	for (let i = 1; i <= 9; i++) {
		if (i % 3 == 0) strokeWeight(2);
		else strokeWeight(1);
		line(0, i * size, board_width, i * size);
		line(i * size, 0, i * size, board_heigth);
	}

	textSize(50);
	textAlign(CENTER, CENTER);
	for (let i = 1; i <= 9; i++) {
		for (let j = 1; j <= 9; j++) {
			if (start[i][j] != -1) {
				push();
				fill(255, 0, 0);
			}
			if (board[i][j].length == 1) {
				text(board[i][j], (i - 1) * size, (j - 1) * size, size, size);
			}
			if (start[i][j] != -1) {
				pop();
			}
		}
	}

	if (selected_i > -1 && selected_j > -1) {
		push();
		noFill();
		stroke(0, 255, 0);
		rect((selected_i - 1) * size, (selected_j - 1) * size, size, size);
		pop();
	}
}

function keyPressed() {
	if (key == " ") {
		reset();
		done = false;
		impossible = false;
	}

	if (keyCode == ESCAPE) {
		resetStart();
		resetBoard();
		resetCollapsed();
	}
	if (selected_i == -1 || selected_i == -1) return;
	if (key >= "0" && key <= "9") {
		start[selected_i][selected_j] = key - "0";
		board[selected_i][selected_j] = [key - "0"];
	}
}

function mousePressed() {
	selected_i = floor(mouseX / size) + 1;
	selected_j = floor(mouseY / size) + 1;

	if (selected_i <= 0 || selected_i > 9 || selected_j <= 0 || selected_j > 9) {
		selected_i = selected_j = -1;
		return;
	}
}
