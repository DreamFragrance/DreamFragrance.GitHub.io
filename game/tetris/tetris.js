// 列数
var COLS = 12
// 行数
var ROWS = 19
// 移动步长
var STEPS = 35
// 方块间隔
var GAP = 1.5
// 方块大小
var CUBE_SIZE = 35
// 预览方块大小
var CUBE_SIZE_NEXT = 50
// 方块样式
var CUBE_STYLE = {
	0: {
		0: {
			x: 0,
			y: 2
		},
		1: {
			x: 1,
			y: 2
		},
		2:{
			x: 2,
			y: 2
		},
		3:{
			x: 2,
			y: 1
		}
	},
	1: {
		0: {
			x: 1,
			y: 1
		},
		1: {
			x: 2,
			y: 1
		},
		2:{
			x: 1,
			y: 2
		},
		3:{
			x: 2,
			y: 2
		}
	},
	 2: {
	 	0: {
	 		x: 0,
	 		y: 2
	 	},
	 	1: {
	 		x: 1,
	 		y: 1
	 	},
	 	2:{
	 		x: 1,
	 		y: 2
	 	},
	 	3:{
	 		x: 2,
	 		y: 2
	 	}
	 },
	 3: {
	 	0: {
	 		x: 1,
	 		y: 1
	 	},
	 	1: {
	 		x: 1,
	 		y: 2
	 	},
	 	2:{
	 		x: 2,
	 		y: 2
	 	},
	 	3:{
	 		x: 3,
	 		y: 2
	 	}
	 },
	 4: {
	 	0: {
	 		x: 0,
	 		y: 1
	 	},
	 	1: {
	 		x: 1,
	 		y: 1
	 	},
	 	2:{
	 		x: 2,
	 		y: 1
	 	},
	 	3:{
	 		x: 3,
	 		y: 1
	 	}
	 },
	 5: {
	 	0: {
	 		x: 0,
	 		y: 2
	 	},
	 	1: {
	 		x: 1,
	 		y: 1
	 	},
	 	2:{
	 		x: 1,
	 		y: 2
	 	},
	 	3:{
	 		x: 2,
	 		y: 1
	 	}
	 },
	 6:{
		 0: {
		 	x: 0,
		 	y: 1
		 },
		 1: {
		 	x: 1,
		 	y: 1
		 },
		 2:{
		 	x: 1,
		 	y: 2
		 },
		 3:{
		 	x: 2,
		 	y: 2
		 }
	 }
}
// 方块样式深拷贝
var CUBE_STYLE_COPY = _.cloneDeep(CUBE_STYLE)
// ActiveCube/NextCube颜色样式
var ACTIVE_CUBE_COLOR = {
	0: {
		color: "#3dbd62", 
		boarder: "#2f8f4a 5px solid"
	},
	1: {
		color: "#8d3bbd", 
		boarder: "#69298f 5px solid"
	},
	2: {
		color: "#bd383a", 
		boarder: "#8f3738 5px solid"
	},
	3: {
		color: "#bbbd3b", 
		boarder: "#8f8936 5px solid"
	},
	4: {
		color: "#bd6b34", 
		boarder: "#8f4030 5px solid"
	},
}
// DeadCube颜色样式
var DEAD_CUBE_COLOR = {
	color: "#4f81bd", 
	boarder: "#3f628e 5px solid"
}
// 下一个方块编号（对预览进行校正）
var cube_num_next = Math.floor(Math.random() * 7)
// 当前方块颜色编号
var cube_color_num_now = null
// 下一个方块颜色编号（对预览进行校正）
var cube_color_num_next = Math.floor(Math.random() * 5)
// 预览矫正
var CUBE_ADJUST_NEXT = {
	0: {
		x: 30,
		y: 0
	},
	1: {
		x: 10,
		y: 0
	},
	2: {
		x: 35,
		y: 0
	},
	3: {
		x: -15,
		y: 0
	},
	4: {
		x: 8,
		y: 25
	},
	5: {
		x: 35,
		y: 0
	},
	6: {
		x: 35,
		y: 0
	},
}
// 当前方块样式
var cube_style_now = null
// 下一个方块样式
var cube_style_next = CUBE_STYLE[cube_num_next]
// 矩阵的逻辑位置
var Mx = 4
var My = -1
// 放置完毕的方块
var deadCubes = []
// 是否结束
var isEnd = false
// 是否触底（用于速降）
var atBottom = false
// 计时器
var timer = null
// 分数
var score = 0
// 难度
var level = 1

// 初始化
function init(){
	var start_btn = document.getElementById("start_btn")
	start_btn.style.display = "none"
	restart()
	createNextCubes()
	createCubes()
	onKeyDown()
	timerSwitch()
}

function restart(){
	var score_p = document.getElementById("score")
	var level_p = document.getElementById("level")
	var game_div = document.getElementById("game")
	var next_div = document.getElementById("next_div")
	var cubes = game_div.childNodes
	var cubes_next = next_div.childNodes
	var cubes_num = cubes.length
	var cubes_num_next = cubes_next.length
	for(var i=cubes_num-1;i>=0;i--){
		game_div.removeChild(cubes[i])
	}
	for(var i=cubes_num_next-1;i>=0;i--){
		if(cubes_next[i].className == "NextCube"){
			next_div.removeChild(cubes_next[i])
		}
	}
	cube_num_next = Math.floor(Math.random() * 7)
	cube_color_num_now = null
	cube_color_num_next = Math.floor(Math.random() * 5)
	cube_style_now = null
	cube_style_next = CUBE_STYLE[cube_num_next]
	Mx = 4
	My = -1
	deadCubes = []
	isEnd = false
	atBottom = false
	timer = null
	score = 0
	level = 1
	score_p.innerHTML = score
	level_p.innerHTML = level
}

// 监听键盘事件
function onKeyDown(){
	document.onkeydown = function(event){
		var keyCode = event.keyCode
		if(!isEnd){
			if(timer){
				switch(keyCode){
					case 37:
						move(-1, 0);
						break;
					case 39:
						move(1, 0);
						break;
					case 40:
						move(0, 1);
						break;
					case 90:
						rotate();
						break;
					case 84:
						timerSwitch();
						break;
					case 32:
						downTheBottom();
						break;
				}
			}else{
				switch(keyCode){
					case 84:
						timerSwitch();
						break;
				}
			}
		}
	}
}

// 方块移动
function move(row, col){
	Mx += row
	My += col
	// 只有在下落过程中才会变成DeadCubes
	if(row == 0 && col == 1){
		if(isBoundary() || isTouch()){
			Mx -= row
			My -= col
			petrifaciton()
			createCubes()
		}else{
			cubeLocate()
		}
	}else{
		if(isBoundary() || isTouch()){
			Mx -= row
			My -= col
		}else{
			cubeLocate()
		}
	}
}

// 方块定位
function cubeLocate(){
	var cubes = document.getElementsByClassName("ActiveCube")
	for(var i=0;i<4;i++){
		var y = GAP + (My + cube_style_now[i].y) * CUBE_SIZE
		var x = GAP + (Mx + cube_style_now[i].x) * CUBE_SIZE
		cubes[i].style.top = y + "px"
		cubes[i].style.left = x + "px"
	}
}

// 创建方块
function createCubes(){
    Mx = 4
    My = -1
	CUBE_STYLE = _.cloneDeep(CUBE_STYLE_COPY)
	cube_color_num_now = cube_color_num_next
	cube_num_next = Math.floor(Math.random() * 7);
	cube_color_num_next = Math.floor(Math.random() * 5);
	cube_style_now = cube_style_next
	cube_style_next = CUBE_STYLE[cube_num_next]
	game_div = document.getElementById("game")
	for(var i=0;i<4;i++){
		cube = document.createElement("div")
		cube.className = "ActiveCube"
		cube.style.backgroundColor = ACTIVE_CUBE_COLOR[cube_color_num_now].color
		cube.style.border = ACTIVE_CUBE_COLOR[cube_color_num_now].boarder
		game_div.appendChild(cube)
	}
	if(isTouch()){
		isEnd = true
		end()
	}
	cubeLocate()
	nextCubeLocate()
}

// 越界判定
function isBoundary(){
	for(var i=0;i<4;i++){
		x = cube_style_now[i].x + Mx
		y = cube_style_now[i].y + My
		if(x <= -1 || x >= 12 || y >= 19){
			return true;
		}
	}
}

// 旋转
function rotate(){
	cubes = document.getElementsByClassName("ActiveCube")
	// lodash中的深拷贝
	cube_style_copy = _.cloneDeep(cube_style_now)
	for(var i=0;i<4;i++){
		y = cube_style_now[i].y
		cube_style_now[i].y = cube_style_now[i].x
		cube_style_now[i].x = 3 - y
	}
	if(isBoundary() || isTouch()){
		cube_style_now = cube_style_copy
	}else{
		cubeLocate()
	}
}

// 触底石化
function petrifaciton(){
	cubes = document.getElementsByClassName("ActiveCube")
	len = cubes.length
	for(var i=len-1;i>=0;i--){
		cubes[i].style.backgroundColor = DEAD_CUBE_COLOR.color;
		cubes[i].style.border = DEAD_CUBE_COLOR.boarder;
		deadCubes[(My + cube_style_now[i].y) * COLS + (Mx + cube_style_now[i].x )] = cubes[i]
		cubes[i].className = "DeadCube" 
	}
	atBottom = true
	clearRows()
}

// 判断方块是否碰撞
function isTouch(){
	for(var i=0;i<4;i++){
		if(deadCubes[(My + cube_style_now[i].y) * COLS + (Mx + cube_style_now[i].x)]){
			return true
		}
	}
}

// 清除满行
function clearRows(){
	var game_div = document.getElementById("game")
	var score_p = document.getElementById("score")
	for(var i=ROWS-1;i>=0;i--){
		var isFull = true
		for(var j=COLS-1;j>=0;j--){
			if(!deadCubes[i*COLS+j]){
				isFull = false
				break
			}
		}
		if(isFull){
			for(var j=COLS-1;j>=0;j--){
				game_div.removeChild(deadCubes[i*COLS+j])
			}
			score += 10 * level
			levelUp()
			score_p.innerHTML = score
			for(var k=i;k>=0;k--){
				for(var j=COLS-1;j>=0;j--){
					deadCubes[k*COLS+j] = deadCubes[(k-1)*COLS+j]
					if(deadCubes[k*COLS+j]){
						deadCubes[k*COLS+j].style.top = GAP + k * CUBE_SIZE + "px"
					}
				}
			}
			i += 1
		}
	}
}

// 计时器开关
function timerSwitch(){
	if(timer){
		clearInterval(timer)
		timer = null
	}else{
		timer = setInterval(function(){
			move(0, 1);
		}, 1000 / level);
	}
	
}

// 速降
function downTheBottom(){
	for(var i=0;i<ROWS;i++){
		move(0,1)
		if(atBottom){
			atBottom = false
			break
		}
	}
}

// 获取升到下一难度的分数
function getLevelThreshold(){
	return 25 * (level + 1) * level
}

// 难度提升
function levelUp(){
	var level_p = document.getElementById("level")
	var level_threshold = getLevelThreshold()
	if(score >= level_threshold){
		level++
	}
	level_p.innerHTML = level
	timerSwitch()
	timerSwitch()
}

// 创建预览方块
function createNextCubes(){
	next_div = document.getElementById("next_div")
	for(var i=0;i<4;i++){
		cube = document.createElement("div")
		cube.className = "NextCube"
		next_div.appendChild(cube)
	}
}

// 预览方块定位
function nextCubeLocate(){
	next_cubes = document.getElementsByClassName("NextCube")
	for(var i=0;i<4;i++){
		next_cubes[i].style.top = CUBE_SIZE_NEXT * (cube_style_next[i].y + 0.5) + CUBE_ADJUST_NEXT[cube_num_next].y + "px"
		next_cubes[i].style.left = CUBE_SIZE_NEXT * cube_style_next[i].x + CUBE_ADJUST_NEXT[cube_num_next].x + "px"
		next_cubes[i].style.backgroundColor = ACTIVE_CUBE_COLOR[cube_color_num_next].color
		next_cubes[i].style.border = ACTIVE_CUBE_COLOR[cube_color_num_next].boarder
		next_cubes[i].style.borderWidth = "7px"
	}
}

// 游戏结束
function end(){
	var start_btn = document.getElementById("start_btn")
	start_btn.style.display = "block"
	start_btn.className = "btn btn-danger"
	start_btn.innerHTML = "重新开始！"
	timerSwitch()
}