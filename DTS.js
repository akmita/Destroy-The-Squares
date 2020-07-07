//CHANGELOG

//2/18/2019
/*projectile fires from front of player*/  


//GOALS NEXT TIME
//make game over text creen opdate continusly
//do not cancel the animation once it goes to game over
//add hit sounds
//not have the animation go through all those if statements 20 times evey second
//rework the whole app using functional and object oriented programming techniques learned on freecodecamp OOORRR just start new app


var canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 700;
var c = canvas.getContext('2d');
var hit = new Audio("hit.mp3");
var eHit = new Audio("hit.mp3"); // enemy hit
var shot = new Audio("shot.mp3");
var eShot = new Audio("shot.mp3");
let projectileArray=[];
let enemyAmmo=[];
let redPieces=[];
let greenPieces=[];

function createPiecesArray() {
	redPieces=[];
	greenPieces=[];
}

for (let shots=25; shots>0; shots--) {
	projectileArray.push(new projectile(-100,-100,0,false));
}

for (let shots=25; shots>0; shots--) {
	enemyAmmo.push(new projectile(-100,-100,0,true));
}

var mainPlayer = new Player(200,300,5,5,100); 
var enemyPlayer = new Enemy(400,300,5,5,100); //set velocity to 2 for testing purposes

DisplayPlayerHealth(); //displays initial, full health of player
DisplayEnemyHealth(); //displays initial, full health of enemy

function DisplayPlayerHealth() {
	c.fillStyle= "green";
	c.fillRect(0,0,mainPlayer.health,20);
	DisplayPlayerLives();
}

function DisplayEnemyHealth() {
	c.fillStyle= "red";
	c.fillRect(700-enemyPlayer.health,0,700,20);
	DisplayEnemyLives();
}
 
function DisplayPlayerLives() {
	c.font = "bold 14px verdana";
	c.fillStyle = "white";
	c.fillText("Lives: " + mainPlayer.lives, 5, 15);
	c.stroke();
}

function DisplayEnemyLives() {
	c.font = "bold 14px verdana";
	c.fillStyle = "white";
	c.fillText("Lives: " + enemyPlayer.lives, 635, 15);
	c.stroke();
}

function kill(object) {
	object.display=false;
	createPiecesArray();
	object.canShoot=false;
	console.log(object + " Killed");
	if (object==enemyPlayer) {createPieces(object.x,object.y,"red"); }
	if (object==mainPlayer) {createPieces(object.x,object.y,"green"); }
}

function respawn(object) {
	object.immune=true;
	setTimeout(function() {
		object.lives-=1;
		object.display=true;
		object.health=350;					
		DisplayEnemyHealth();
		DisplayPlayerHealth();
		var respawnImmunity = setInterval(function() { object.display= !object.display; },200);
		setTimeout(function() { 
			clearInterval(respawnImmunity);
			object.display=true;
			object.immune=false;
			object.canShoot=true;
		}, 1000);
	}, 1000);
}

function gameEnds(greenWins) {
	var color = greenWins ? "GREEN" : "RED";
	gameOver=true;
	c.font = "bold 40px verdana";
	c.fillStyle = "black";
	c.fillText(color + "WINS", 100, 100);
	c.stroke();	
} 


function checkIfHit(enemy,x,y,num) { //change enemy to isEnemy
	var whichPlayer;
	if (enemy==true) { whichPlayer=mainPlayer } //check if it's the enemy's or player's shot
	if (enemy==false) { whichPlayer=enemyPlayer }


	if (x>=whichPlayer.x-4 && x<=whichPlayer.x+whichPlayer.size-4 && y<=whichPlayer.y+whichPlayer.size-1 && y>=whichPlayer.y-4  && whichPlayer.display==true && whichPlayer.immune==false) { //checks if player was hit
		whichPlayer.health-=50;
		playHitAudio(whichPlayer);
		enemy ? c.clearRect(0,0,350,20) : c.clearRect(350,0,700,20);
		enemy ? DisplayPlayerHealth() : DisplayEnemyHealth(); //decrease health bar
		enemy ? enemyAmmo[num].x=-50 : projectileArray[num].x=-50;
		enemy ? enemyAmmo[num].velocity=0 : projectileArray[num].velocity=0;
	
		if (whichPlayer.health<=0) { //checks if player is dead, removes from canvas if it is
			kill(whichPlayer);
			if (whichPlayer.lives>0) {respawn(whichPlayer);}
			else {gameEnds(enemy ? false : true);} 
		} 		
	} 
}


console.log([mainPlayer,enemyPlayer]);


function playHitAudio(enemy) {
	enemy ? hit.play() : eHit.play();
	setTimeout(function() {
		enemy ? hit.pause() : eHit.pause();
		enemy ? hit.currentTime=0 : eHit.currentTime=0;
	},200);
}

function displayShotCountdown() {
	c.fillStyle="black";
	c.fillRect(0, 20, mainPlayer.countdown, 10);  
	c.fillRect(350, 20, enemyPlayer.countdown, 10); //working on this
}

function startCountdown(isEnemy) {
	

	if (isEnemy.canShoot==true && isEnemy.countdown<350) {
		console.log("error");
	}
	isEnemy.countdown=0;
	function increment() {
		isEnemy.countdown+=9;
	}
	function testIfDone() {
		if (isEnemy.countdown>=350) { 
			clearInterval(incrementer); 
			isEnemy.countdown=350; 
			console.log("clearing countdown interval"); 
		}
	}
	var incrementer = setInterval(function(isEnemy) {
		increment();
		testIfDone();
	},10)

	
}

function projectile(x,y,velocity,enemy,num) {
	this.x=x;
	this.y=y;
	this.velocity=velocity;
	this.enemy=enemy;

	this.draw=function(num) {
		this.num=num;
		this.x=this.velocity+this.x;
		c.fillStyle="black";
		c.fillRect(this.x, this.y, 5, 5);
		if (this.x>window.innerWidth) { 
			this.velocity=0;
		}
		checkIfHit(this.enemy, this.x, this.y, this.num); 
	}
}

function Player(x,y,dx,dy,size) {  
	this.x=x;
	this.y=y;
	this.dx=dx;
	this.dy=dy;
	this.size=size;
	this.shotNum=0;
	this.canShoot=true;
	this.health=350;
	this.lives=3;
	this.display=true;
	this.immune=false;
	this.countdown=350;
			
	this.draw=function() {
		c.fillStyle="darkgreen";
		c.fillRect(this.x, this.y, this.size, this.size);
	}

	this.up=function() { 
		if (this.y>20) {
			this.y-=this.dy;
		}
	}

	this.down=function() {
		if (this.y<canvas.width-this.size) {
			this.y+=this.dy;
		}
	}

	this.left=function() {
		if (this.x>0) {
			this.x-=this.dx;
		}
	}

	this.right=function() {
		if (this.x<canvas.width/2-this.size) {
			this.x+=this.dx;
		}
	}

	this.shoot=function() { 
		if (this.shotNum<projectileArray.length-1) {
			console.log("shot successful");
			startCountdown(mainPlayer);
			shot.play();
			setTimeout(function() {
				shot.pause();
				shot.currentTime = 0;
			}, 50);
	
			projectileArray[this.shotNum].x=this.x+(this.size-10);
			projectileArray[this.shotNum].y=this.y+(this.size/2);
			projectileArray[this.shotNum].velocity=10;
			this.shotNum++;
			if (this.shotNum>=projectileArray.length-1) { this.shotNum=0; }
			this.canShoot=false;
			setTimeout(function() { 
				if (!mainPlayer.immune) {
					mainPlayer.canShoot=true; 
				}
			}, 400)
		}

		else {
			console.log("shot failed: " + this.canShoot);
		}
	}
}

function Enemy(x,y,dx,dy,size) {
	this.x=x;
	this.y=y;
	this.dx=dx;
	this.dy=dy;
	this.size=size;
	this.shotNum=0;
	this.canShoot=true;
	this.health=350;
	this.lives=3;
	this.display=true;
	this.immune=false;
	this.countdown=350;

	this.draw=function() {
		c.fillStyle="darkred";
		c.fillRect(this.x, this.y, this.size, this.size);
	}

	this.up=function() { 
		if (this.y>20) {
			this.y-=this.dy;
		}
	}

	this.down=function() {
		if (this.y<canvas.width-this.size) {
			this.y+=this.dy;
		}
	}

	this.left=function() {
		if (this.x>canvas.width/2) {
			this.x-=this.dx;
		}
	}

	this.right=function() {
		if (this.x<canvas.width-this.size) {
			this.x+=this.dx;
		}
	}

	this.shoot=function() {    
		if (this.shotNum<enemyAmmo.length-1) {
			console.log("shot successful");
			startCountdown(enemyPlayer);
			eShot.play();
			setTimeout(function() {
				eShot.pause();
				eShot.currentTime = 0;
			}, 50);
			enemyAmmo[this.shotNum].x=this.x+5;
			enemyAmmo[this.shotNum].y=this.y+(this.size/2);
			enemyAmmo[this.shotNum].velocity=-10;                            //fix  \/ \/ \/ 

			this.shotNum++;
			if (this.shotNum>=enemyAmmo.length-1) { this.shotNum=0; }
			this.canShoot=false;
			setTimeout(function() { 
				if (!enemyPlayer.immune) { 
					enemyPlayer.canShoot=true; 
				}; 
			} ,400)
		}

		else {
			console.log("shot failed: " + this.canShoot);
		}
	}
}

function PlayerPieces(x,y,color,xCenter,yCenter) {
	this.x=x;
	this.y=y;
	this.dx=Math.random()*20-10;
	this.dy=Math.random()*20-10;
	this.color;
	this.opacity=1;

	this.checkColor=function() {
		if (color=="green") { this.color='rgba(0,100,0,'+this.opacity+')'; }
		if (color=="red") { this.color='rgba(139,0,0,'+this.opacity+')'; }
	}

	this.draw=function() {
		this.opacity-=.015;
		this.checkColor();
		c.fillStyle=this.color;
		c.fillRect(this.x,this.y,9,9);
		this.x+=this.dx;
		this.y+=this.dy;
		if (this.y<=20) { this.dx=0; this.dy=0; this.x=-50; }
	}
}

function createPieces(x,y,color) {
	for (var b=0; b<100; b=b+10) {
		for (var i=10; i<=100; i=i+10) {
			if (color=="green") { greenPieces.push(new PlayerPieces(x+i-10,y+b,color,x+45,y+45)); }
			if (color=="red") { redPieces.push(new PlayerPieces(x+i-10,y+b,color,x+45,y+45)); }
		}
	}
}

var doAnim=true; //figure out a way to not go through so many ifs
var gameOver=false;
var keyCodeArr=[];
function animate() {
	if (!doAnim) {context=null; return;}
	requestAnimationFrame(animate);
	c.clearRect(0,20, innerWidth, innerHeight);
	checkForMovement();
	checkForEnemyMovement();
	displayShotCountdown();
	for (let i=0; i<projectileArray.length; i++) {
		projectileArray[i].draw(i);
	}
	for (let i=0; i<enemyAmmo.length; i++) {
		enemyAmmo[i].draw(i);
	}
	for (let i=0; i<greenPieces.length; i++) {  //change
		greenPieces[i].draw();
	}
	for (let i=0; i<redPieces.length; i++) {  //change
		redPieces[i].draw();
	}
	if (mainPlayer.display==true) {
		mainPlayer.draw();

	}
	if (enemyPlayer.display==true) {
		enemyPlayer.draw();
	}

	if (gameOver==true) {
		gameEnds();
	}
}

animate();

function checkForMovement() {
	if (keyCodeArr[87]) { mainPlayer.up()    };
	if (keyCodeArr[83]) { mainPlayer.down()  };
	if (keyCodeArr[65]) { mainPlayer.left()  };
	if (keyCodeArr[68]) { mainPlayer.right() };
}

function checkForEnemyMovement() {
	if (keyCodeArr[38]) { enemyPlayer.up()    };
	if (keyCodeArr[40]) { enemyPlayer.down()  };
	if (keyCodeArr[37]) { enemyPlayer.left()  };
	if (keyCodeArr[39]) { enemyPlayer.right() };
}

addEventListener("keydown", function(e) {
	keyCodeArr[e.keyCode]=true;
	
});

window.addEventListener("keyup", function (e) {
	keyCodeArr[e.keyCode]=false;
})

window.addEventListener("keydown", function(e) {
	if (e.keyCode==16 && e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT && mainPlayer.canShoot==true) {
		console.log("player shift pressed");
		mainPlayer.shoot();
	}
})

window.addEventListener("keydown", function(e) {
	if (e.keyCode==16 && e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT  && enemyPlayer.canShoot==true) {
		console.log("enemy shift pressed");
		enemyPlayer.shoot();
	}
})





























