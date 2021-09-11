var ROWS = 18
var COLS = 26
var SNAKE_SIZE = 25
// [x][0]是left，[x][1]是top
var snakeLocation = [[8, 5],[7, 5],[6, 5],[5, 5]]
var snakeLen = 4;
var snakeHeadDirection = "right";
var gameover = false;
var timer = null;
var foodLeft = 0;
var foodTop = 0;
var score = 0;
var speed = 1;
// 当前食物类别：0为普通食物，1为稀有食物
var foodType = 0;
// 稀有食物出现的概率
var rarity = 0.15;

// 初始化
function init(){
	createSnake();
	onKeyDown();
	createFood();
	pause();
}

//创建初始的贪吃蛇
function createSnake(){
	var game_div = document.getElementsByClassName("gameDiv")[0];
	// 蛇头
	var snakeHead = document.createElement("img");
	snakeHead.setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbQkq.png")
	snakeHead.className = "snakeCube";
	game_div.appendChild(snakeHead);
	
	// 蛇身
	for(var i=0;i<3;i++){
		snakeBody = document.createElement("img");
		snakeBody.setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbK7n.png")
		snakeBody.className = "snakeCube";
		game_div.appendChild(snakeBody);
	}
	snakeLocate();
}

// 定位蛇的位置
function snakeLocate(){
	var snakes = document.getElementsByClassName("snakeCube");
	for(var i=0;i<snakeLen;i++){
		snakes[i].style.left = snakeLocation[i][0] * SNAKE_SIZE + "px";
		snakes[i].style.top = snakeLocation[i][1] * SNAKE_SIZE + "px";
	}
	
	switch(snakeHeadDirection){
		case "up":{
			snakes[0].setAttribute("src","https://z3.ax1x.com/2021/09/11/hzb1hV.png")
			break;
		}
		case "down":{
			snakes[0].setAttribute("src","https://z3.ax1x.com/2021/09/11/hzblt0.png")
			break;
		}
		case "left":{
			snakes[0].setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbu0s.png")
			break;
		}
		case "right":{
			snakes[0].setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbQkq.png")
			break;
		}
	}
}

// 键盘监听事件
function onKeyDown(){
	document.onkeydown = function(event){
		if(!gameover){
			switch(event.keyCode){
				// W 和 ↑
				case 38:
				case 87:{
					snakeHeadDirection = "up";
					break;
				}
				// A 和 ←
				case 37:
				case 65:{
					snakeHeadDirection = "left";
					break;
				}
				// S 和 ↓
				case 40:
				case 83:{
					snakeHeadDirection = "down";
					break;
				}
				// D 和 →
				case 39:
				case 68:{
					snakeHeadDirection = "right";
					break;
				}
				// 空格键
				case 32:{
					pause();
					break;
				}
			}
		}else{
			switch(event.keyCode){
				// 空格键
				case 32:{
					restart();
					break;
				}
			}
		}
	}
}

// 贪吃蛇移动，x为横向，y为纵向
function move(x, y){
	for(var i=snakeLen-1;i>0;i--){
		snakeLocation[i][0] = snakeLocation[i-1][0];
		snakeLocation[i][1] = snakeLocation[i-1][1];
	}
	snakeLocation[0][0] = snakeLocation[0][0] + x;
	snakeLocation[0][1] = snakeLocation[0][1] + y;
	isTouchItself();
	crashBoundary();
	snakeLocate();
	eatFood();
}

// 自身碰撞判定
function isTouchItself(){
	var left = snakeLocation[0][0];
	var top = snakeLocation[0][1];
	for(var i=1;i<snakeLen;i++){
		if(left == snakeLocation[i][0] && top == snakeLocation[i][1]){
			gameover = true;
			final();
		}
	}
}

// 边界碰撞判定
function crashBoundary(){
	var left = snakeLocation[0][0];
	var top = snakeLocation[0][1];
	if(left < 0){
		snakeLocation[0][0] = COLS - 1;
	}else if(left >= COLS){
		snakeLocation[0][0] = 0;
	}else if(top < 0){
		snakeLocation[0][1] = ROWS - 1;
	}else if(top >= ROWS){
		snakeLocation[0][1] = 0;
	}
}

// 暂停/继续游戏
function pause(){
	if(timer == null){
		timer = setInterval(function(){
			switch(snakeHeadDirection){
				case "up":{
					move(0, -1);
					break;
				}
				case "down":{
					move(0, 1);
					break;
				}
				case "left":{
					move(-1, 0);
					break;
				}
				case "right":{
					move(1, 0);
					break;
				}
			}
		}, 100 / speed);
		var end = document.getElementsByClassName("paused")[0]
		end.style.display = "none";
	}else{
		clearInterval(timer);
		timer = null;
		if(!gameover){
			var end = document.getElementsByClassName("paused")[0]
			end.style.display = "block";
		}
	}
}

// 结束
function final(){
	var end = document.getElementsByClassName("gameover")[0]
	end.style.display = "block";
	pause();
}

// 重新开始
function restart(){
	snakeLocation = [[8, 5],[7, 5],[6, 5],[5, 5]]
	snakeLen = 4;
	snakeHeadDirection = "right";
	gameover = false;
	timer = null;
	foodLeft = 0;
	foodTop = 0;
	score = 0;
	speed = 1;
	
	var gameDiv = document.getElementsByClassName("gameDiv")[0];
	var children = gameDiv.children;
	var childrenLen = children.length;
	for(var i=childrenLen-1;i>=0;i--){
		gameDiv.removeChild(children[i]);
	}
	var end = document.getElementsByClassName("gameover")[0]
	end.style.display = "none"; 
	createSnake();
	createFood();
	updateData();
	pause();
}

// 创建食物
function createFood(){
	foodLeft = Math.floor(Math.random() * COLS);
	foodTop = Math.floor(Math.random() * ROWS);
	var gameDiv = document.getElementsByClassName("gameDiv")[0];
	var food = document.createElement("img");
	food.className = "foodCube";
	if(Math.random() >= rarity){
		food.setAttribute("src","https://z3.ax1x.com/2021/09/11/hzb8pT.png");
		foodType = 0;
	}else{
		food.setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbG1U.png");
		foodType = 1;
	}
	food.style.top = foodTop * SNAKE_SIZE + "px";
	food.style.left = foodLeft * SNAKE_SIZE + "px";
	gameDiv.appendChild(food);
	updateData();
}

// 吃掉食物
function eatFood(){
	var left = snakeLocation[0][0];
	var top = snakeLocation[0][1];
	
	if(foodLeft == left && foodTop == top){
		var food = document.getElementsByClassName("foodCube")[0];
		var gameDiv = document.getElementsByClassName("gameDiv")[0];
		gameDiv.removeChild(food);
		var repeat = foodType==0?1:3;
		while(repeat > 0){
			snakeLen++;
			score += 10;
			speed += 0.05;
			grow();
			repeat--;
		}
		createFood();
	}
}

// 长身体
function grow(){
	var gameDiv = document.getElementsByClassName("gameDiv")[0];
	var body = document.createElement("img");
	body.className = "snakeCube";
	body.setAttribute("src","https://z3.ax1x.com/2021/09/11/hzbK7n.png");
	
	// 当前最后一个身体的位置
	var lastTop = snakeLocation[snakeLen-2][1];
	var lastLeft = snakeLocation[snakeLen-2][0];
	// 新的身体的位置
	var bodyTop = 0;
	var bodyLeft = 0;
	
	switch(snakeHeadDirection){
		case "up":{
			bodyTop = lastTop + 1;
			bodyLeft = lastLeft;
			break;
		}
		case "down":{
			bodyTop = lastTop - 1;
			bodyLeft = lastLeft;
			break;
		}
		case "left":{
			bodyTop = lastTop;
			bodyLeft = lastLeft + 1;
			break;
		}
		case "right":{
			bodyTop = lastTop;
			bodyLeft = lastLeft - 1;
			break;
		}
	}
	body.style.top = bodyTop * SNAKE_SIZE + "px";
	body.style.left = bodyLeft * SNAKE_SIZE + "px";
	snakeLocation[snakeLen-1] = [bodyLeft, bodyTop];
	gameDiv.appendChild(body);
}

// 更新界面中分数和长度
function updateData(){
	var scoreH1 = document.getElementsByClassName("score")[0];
	var lengthH1 = document.getElementsByClassName("length")[0];
	scoreH1.innerHTML = "分数：" + score;
	lengthH1.innerHTML = "长度：" + snakeLen;
}
