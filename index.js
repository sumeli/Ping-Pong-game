//select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//select user paddle
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "White",
    score : 0, 
}

//create computer paddle
const com = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "White",
    score : 0, 
}

//create the ball
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "White"
}

//draw rectangle function
function drawRect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

//create the net
const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "White"
}

//draw net
function drawNet(){
    for(let i = 0; i<= cvs.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//draw Circle
function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

//draw text
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
}

function render(){
    //clear the canvas
    drawRect(0, 0, cvs.width, cvs.height, "Black");

    //draw the net
    drawNet();

    //draw Score
    drawText(user.score, cvs.width/4, cvs.height/5, "White");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "White");

    //draw the paddle of user and computer
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//control the user paddle
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY -  rect.top - user.height/2;
}

//collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//set the reset fucntion
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//update the game that is the movements of the balls, scores and all
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //simple AI to control the computer paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

     if (collision(ball,player)){
        //where the ball hit the player
        let collidePoint = ball.y - (player.y + player.height/2);

        //normalization 
        collidePoint = collidePoint/(player.height/2);

        //calculate nagle in Radian
        let angleRad = collidePoint * Math.PI/4;

        //X direction of the ball when it's hit
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        //change velocity of x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY =  ball.speed * Math.sin(angleRad);

        //everytime the ball hit the paddle we increase the speed
        ball.speed += 0.3;
     }

     //reset the ball and update the score
     if(ball.x - ball.radius < 0){
        //computer wins
        com.score++;
        resetBall();
     }
     else if(ball.x + ball.radius > cvs.width){
        //user wins
        user.score++;
        resetBall();
     }
}


//create the function game
function game(){
    update();
    render();
}

//loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);