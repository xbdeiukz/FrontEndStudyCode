/*
 *	判断一个点是否在一个三角形内
 */

/* ***************************非模块化*************************** */
function vec(a, b) {
	return {
		x: b.x - a.x,
		y: b.y - a.y
	}
}

function vecProduct(v1, v2) {
	return v1.x * v2.y - v2.x * v1.y;
}

function sameSymbols(a, b) {
	return (a ^ b) >= 0;
}

// 判断p点在不在a b c 3个点连成的三角形内，返回布尔值：
function pointInTriangle(p, a, b, c) {
	var PA = vec(p, a),
		PB = vec(p, b),
		PC = vec(p, c),
		R1 = vecProduct(PA, PB),
		R2 = vecProduct(PB, PC),
		R3 = vecProduct(PC, PA);

	return sameSymbols(R1, R2) && sameSymbols(R2, R3);
}


/* *********************************** 模块化 ************************************ */
// var pointInTriangle = (function () {
// 	function vec(a, b) {
// 		return {
// 			x: b.x - a.x,
// 			y: b.y - a.y
// 		}
// 	}

// 	function vecProduct(v1, v2) {
// 		return v1.x * v2.y - v2.x * v1.y;
// 	}

// 	function sameSymbols(a, b) {
// 		return (a ^ b) >= 0;
// 	}

// 	return function (opt) {
// 		var PA = vec(opt.curPos, opt.prePos),
// 				PB = vec(opt.curPos, opt.topLeft),
// 				PC = vec(opt.curPos, opt.bottomLeft),
// 				R1 = vecProduct(PA, PB),
// 				R2 = vecProduct(PB, PC),
// 				R3 = vecProduct(PC, PA);
// 	}

// 	return sameSymbols(R1, R2) && sameSymbols(R2, R3);
// })();