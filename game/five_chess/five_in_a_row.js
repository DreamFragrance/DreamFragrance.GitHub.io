var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")
// 15行，15列
var SIDE_LENGTH = 15
// 棋盘格边长
var CUBE_SIZE = 40
// 棋盘外边距
var BOARD_MARGIN = 20
// 界面大小
var WHOLE_SIZE = 640
// 当前黑子
var isBlack = true
// 棋子大小
var CHESS_SIZE = 15
// 棋子位置
var chessboard = []
// 当前棋局结束
var isEnd = false

// 初始化
function init(){
	chessboard_init()
	draw_chessboard()
	onKeyDown()
}

// 重新开始
function restart(){
	// ctx.clearRect(0, 0, canvas.width, canvas.height)
	canvas.width = canvas.width
	chessboard_init()
	draw_chessboard()
	isBlack = true
	isEnd = false
}

// 初始化二维数组
function chessboard_init(){
	for(var i=0;i<SIDE_LENGTH;i++){
		chessboard[i] = new Array(SIDE_LENGTH)
	}
}


// 键盘监听事件
function onKeyDown(){
	document.onkeydown = function(event){
		var keyCode = event.keyCode
		if(isEnd){
			switch(keyCode){
				case 32:
					restart()
					break
			}
		}
		switch(keyCode){
			case 87:
			case 119:
				surprise(0)
				break
			case 77:
			case 109:
				surprise(1)
				break
			case 74:
			case 106:
				surprise(2)
				break
		}
	}
}

function surprise(idx){
	var egg = document.getElementsByClassName("egg")[idx]
	var display = getComputedStyle(egg).getPropertyValue("display")
	if(display == "none"){
		egg.style.display = "block"
	}else{
		egg.style.display = "none"
	}
}

// 绘制界面
function draw_chessboard(){
	for(var i=0;i<=SIDE_LENGTH;i++){
		ctx.strokeStyle = "#D6D1D1"
		ctx.moveTo(BOARD_MARGIN + i * CUBE_SIZE, BOARD_MARGIN)
		ctx.lineTo(BOARD_MARGIN + i * CUBE_SIZE, WHOLE_SIZE - BOARD_MARGIN)
		ctx.stroke()
		ctx.moveTo(BOARD_MARGIN, BOARD_MARGIN + i * CUBE_SIZE)
		ctx.lineTo(WHOLE_SIZE - BOARD_MARGIN, BOARD_MARGIN + i * CUBE_SIZE)
		ctx.stroke()
	}
}

// 落子
function down_pieces(e){
	if(isEnd){
		return
	}
	
	var x = e.offsetX
	var y = e.offsetY
	x = Math.floor(x / CUBE_SIZE)
	y = Math.floor(y / CUBE_SIZE)
	if(chessboard[x][y] != undefined){
		return
	}
	
	draw_pieces(x, y)
	chessboard[x][y] = isBlack
	if(isWin(x, y)){
		isEnd = true
		ctx.font = "bold 72px serif"
		ctx.fillStyle = "#d6170a"
		if(isBlack){
			ctx.fillText("BLACK WIN!", 140, 200)
		}else{
			ctx.fillText("WHITE WIN!", 140, 200)
		}
		ctx.fillText("PRESS SPACE!", 105, 325)
		return
	}
	isBlack = !isBlack
}

// 绘制棋子
function draw_pieces(x, y){
	var rx = x * CUBE_SIZE + BOARD_MARGIN
	var ry = y * CUBE_SIZE + BOARD_MARGIN
	var g = ctx.createRadialGradient(rx, ry, 30, rx, ry , 0)
	if (isBlack) {
		g.addColorStop(0, '#0A0A0A')
		g.addColorStop(1, '#3d3f3e')
	} else {
		g.addColorStop(0, '#D1D1D1')
		g.addColorStop(1, '#F9F9F9')
	}
	ctx.beginPath()
	ctx.arc(rx, ry, CHESS_SIZE, 0, 2 * Math.PI)
	ctx.fillStyle = g
	ctx.fill()
	ctx.closePath()
}

// // 显示鼠标坐标
// function cnvs_getCoordinates(e){
// 	x1=e.offsetX
// 	y1=e.offsetY
// 	x2=e.clientX
// 	y2=e.clientY
// 	document.getElementById("test").innerHTML="Coordinates: (" + x1 + "," + y1 + ")<br>"+ "Coordinates: (" + x2 + "," + y2 + ")"
// }

// 判断是否结束
function isWin(x, y){
	var count = 1
	var directions = [[[1, 0], [-1, 0]], [[0, 1], [0, -1]], [[1, 1], [-1, -1]], [[1, -1], [-1, 1]]]
	for(var i=0;i<4;i++){
		count = 1
		for(var j=0;j<2;j++){
			var x1 = x + directions[i][j][0]
			var y1 = y + directions[i][j][1]
			while(chessboard[x1][y1] == isBlack){
				count++
				if(count == 5){
					return true
				}
				x1 += directions[i][j][0]
				y1 += directions[i][j][1]
			}
		}
	}
	return false
}