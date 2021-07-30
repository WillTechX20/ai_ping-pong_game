var sound1=null;
var sound2=null;
var gameCanvas=null;
var gameStatusStr='Not Started';
var leftWristXNum=null;
var leftWristYNum=null;
var rightWristXNum=null;
var rightWristYNum=null;
var video=null;
var i=null;
var ballVXNum=0;
var ballVYNum=0;
var ballXNum=200;
var ballYNum=200;
var userScoreNum=0;
var CPUScoreNum=0;
var j=null;
var topUserPaddleYNum=150;
var bottomUserPaddleYNum=250;
var topCPUPaddleYNum=150;
var bottomCPUPaddleYNum=250;
var CPUPaddleVYNum=0;

var gameFunctionsObj={
    resetBall: function(){
        ballXNum=200;
        ballYNum=200;
        ballVXNum=Math.floor(Math.random()*(60)-30);
        ballVYNum=Math.floor(Math.random()*(60)-30);
    },
    updateBallPosition: function(){
        if(ballXNum+ballVXNum>=390){
            sound1.play();
            CPUScoreNum=CPUScoreNum+1;

            if(CPUScoreNum==7){
                endGame();
                alert('You Lost!');
            }
            
            this.resetBall();
        }else if(ballXNum+ballVXNum<=10){
            sound1.play();
            userScoreNum=userScoreNum+1;

            if(userScoreNum==7){
                endGame();
                alert('You Won!');
            }

            this.resetBall();
        }else if(ballYNum+ballVYNum>=390){
            ballYNum=390;
            ballVYNum=ballVYNum*-1;
        }else if(ballYNum+ballVYNum<=10){
            ballYNum=10;
            ballVYNum=ballVYNum*-1;
        }else if(ballYNum>=topUserPaddleYNum&&ballYNum<=bottomUserPaddleYNum&&ballXNum>=340){
            ballXNum=380;
            ballVXNum=ballVXNum*-1;
            ballVYNum=ballVYNum*-1;
            sound2.play();
        }else if(ballYNum>=topCPUPaddleYNum&&ballYNum<=bottomCPUPaddleYNum&&ballXNum<=55){
            ballXNum=55;
            ballVXNum=ballVXNum*-1;
            ballVYNum=ballVYNum*-1;
            sound2.play();
        }

        ballXNum=ballXNum+ballVXNum;
        ballYNum=ballYNum+ballVYNum;
    },
    updatePaddlePosition: function(){
        if((leftWristYNum+rightWristYNum)/2>150){
            topUserPaddleYNum=topUserPaddleYNum+10;
            bottomUserPaddleYNum=bottomUserPaddleYNum+10;
        }else if((leftWristYNum+rightWristYNum)/2<150){
            topUserPaddleYNum=topUserPaddleYNum-10;
            bottomUserPaddleYNum=bottomUserPaddleYNum-10;
        }

        topCPUPaddleYNum=topCPUPaddleYNum+CPUPaddleVYNum;
        bottomCPUPaddleYNum=bottomCPUPaddleYNum+CPUPaddleVYNum;
        
        if(topCPUPaddleYNum<0||bottomCPUPaddleYNum<100){
            topCPUPaddleYNum=0;
            bottomCPUPaddleYNum=100;
        }else if(topCPUPaddleYNum>300||bottomCPUPaddleYNum>400){
            topCPUPaddleYNum=300;
            bottomCPUPaddleYNum=400;
        }

        CPUPaddleVYNum=(ballYNum-(topCPUPaddleYNum+50))/15;
    }
}

function preload(){
    sound1=loadSound('sounds/missed.wav');
    sound2=loadSound('sounds/touch.wav');
}

function onModelLoaded(){
	console.log('Model Loaded!');
}

function gotPoses(results){
	if(results.length>0){
		console.log(results);
        leftWristXNum=results[0].pose.leftWrist.x;
		rightWristXNum=results[0].pose.rightWrist.x;
		leftWristYNum=results[0].pose.leftWrist.y;
		rightWristYNum=results[0].pose.rightWrist.y;
	}
}

function setup(){
    gameCanvas=createCanvas(400, 400);
    gameCanvas.parent('game_container');
    stroke('#FCBA03');
    strokeWeight('10');
    background('#03F0FC');
    line(200, 0, 200, 182.5);
    line(200, 217.5, 200, 400);
    noFill();
    circle(200, 200, 35);
    stroke('black');
    fill('black');
    textSize(10);
    text(JSON.stringify(JSON.stringify(0)), 45, 45);
    text(JSON.stringify(JSON.stringify(0)), 355, 45);
    stroke('#D4F542');
    fill('#D4F542');
    rect(380, topUserPaddleYNum, 20, 100);
    rect(0, topCPUPaddleYNum, 20, 100);
    video=createCapture(VIDEO);
	video.size(300, 300);
    video.hide();
    i=createGraphics(300, 300);
    i.position(875, 300);
    i.show();
	poseNet=ml5.poseNet(video, onModelLoaded);
	poseNet.on('pose', gotPoses);
}

function startGame(){
    ballVXNum=0;
    ballVYNum=0;
    ballXNum=200;
    ballYNum=200;
    userScoreNum=0;
    CPUScoreNum=0;
    CPUPaddleVYNum=0;
    gameStatusStr='Game Started';
    gameFunctionsObj.resetBall();
    j=setInterval(updateGame, 250);
}

function restartGame(){
    gameStatusStr='Not Started';
    clearInterval(j);
    clear();
    stroke('#FCBA03');
    strokeWeight('10');
    background('#03F0FC');
    line(200, 0, 200, 182.5);
    line(200, 217.5, 200, 400);
    noFill();
    circle(200, 200, 35);
    textFont('system-ui');
    stroke('black');
    fill('black');
    textSize(10);
    text(JSON.stringify(JSON.stringify(0)), 45, 45);
    text(JSON.stringify(JSON.stringify(0)), 355, 45);
    stroke('#D4F542');
    fill('#D4F542');
    rect(380, 100, 20, 100);
    rect(0, 100, 20, 100);
    j=null;
    startGame();
}

function endGame(){
    gameStatusStr='Not Started';
    clearInterval(j);
    clear();
    stroke('#FCBA03');
    strokeWeight('10');
    background('#03F0FC');
    line(200, 0, 200, 182.5);
    line(200, 217.5, 200, 400);
    noFill();
    circle(200, 200, 35);
    textFont('system-ui');
    stroke('black');
    fill('black');
    textSize(10);
    text(JSON.stringify(JSON.stringify(0)), 45, 45);
    text(JSON.stringify(JSON.stringify(0)), 355, 45);
    stroke('#D4F542');
    fill('#D4F542');
    rect(380, 100, 20, 100);
    rect(0, 100, 20, 100);
    j=null;
}

function updateGame(){
    clear();
    stroke('#FCBA03');
    strokeWeight('10');
    background('#03F0FC');
    line(200, 0, 200, 182.5);
    line(200, 217.5, 200, 400);
    noFill();
    circle(200, 200, 35);
    stroke('blue');
    fill('blue');
    circle(ballXNum, ballYNum, 10);
    gameFunctionsObj.updatePaddlePosition();
    gameFunctionsObj.updateBallPosition();
    textFont('system-ui');
    stroke('black');
    fill('black');
    textSize(10);
    text(JSON.stringify(JSON.stringify(0)), 45, 45);
    text(JSON.stringify(JSON.stringify(0)), 355, 45);
    stroke('#D4F542');
    fill('#D4F542');
    rect(380, 100, 20, 100);
    rect(0, 100, 20, 100);
}

function draw(){
    if(!(gameStatusStr=='Not Started')){
        i.image(video, 0, 0, 300, 300);
        i.fill('red');
        i.stroke('red');
        i.circle(leftWristXNum, leftWristYNum, 10);
        i.circle(rightWristXNum, rightWristYNum, 10);
    } 
}
