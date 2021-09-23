/* 
    Author: Mary Catherine Villondo
    Description: This project is a requirement for submission in IT461 - Advance Web Systems.The languages used here are html, css and vanila js. Patuti is 2D Game where in the controlled character (Patuti) is a space alien which aim is to stay alive. The user controlls the character to ensure that it must evade the collision with the bullets.  
*/
// Canvas setup
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = 880;
canvas.height = 672;

let health = 100;
let gameFrame = 1;
let gameSpeed = 1;
let gameOver = false;

context.font = '3.125rem Poppins';

//Mouse Interactivity 
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width /2,
    y: canvas.height/2,
    click:false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    //console.log(mouse.x,mouse.y);
});

canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
});

//Player  
const playerLeft = new Image();
playerLeft.src = './assets/images/sprites/patuti_left.png';
const playerRight = new Image();
playerRight.src = './assets/images/sprites/patuti_right.png';

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update(){
        const distance_x = this.x - mouse.x;
        const distance_y = this.y - mouse.y;
        // Angle calculations
        /* let theta = Math.atan2(distance_x, distance_y);
        this.angle = theta; */
        //Player Movement Speed 
        if(mouse.x != this.x){
            this.x -= distance_x/30;
        }
        if(mouse.y != this.y){
            this.y -= distance_y/30;
        }
    }

    draw(){
        if(mouse.click){
            // Skeleton Movement Path
            context.lineWidth = 0.2;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
        // Skeleton for Patuti
        /* context.fillStyle ='red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.fillRect(this.x, this.y, this.radius, 10); */

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if(this.x >= mouse.x){
            context.drawImage(playerLeft, this.frameX * this.spriteWidth - 200, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 115, 0 - 60, this.spriteWidth/3, this.spriteHeight/3);
        }else{
            context.drawImage(playerRight, this.frameX * this.spriteWidth - 200, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 115, 0 - 60, this.spriteWidth/3, this.spriteHeight/3);
        }
        context.restore();
    }
}
const player = new Player();

//Bullets  
const bulletsVerticalArray = [];
const bulletsHorizontalArray = [];
const bulletImage_Vertical = new Image();
bulletImage_Vertical.src = 'assets/images/bullet_v.png'
const bulletImage_Horizontal = new Image();
bulletImage_Horizontal.src = 'assets/images/bullet_h.png'


//Horizontal Bullets Play
class BulletHorizontal {
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 50;
        this.speed = Math.random() * 1 + 1;
        this.distance
        this.frame = 0 ;
        this.frameX  = 0;
        this.frameY = 0;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.spriteWidth = 100;
        this.spriteHeight = 50;
    }

    draw(){
        //Skeleton bullet
        /* context.fillStyle = 'purple';
        context.beginPath();
        context.arc(this.x,this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.stroke(); */
        context.drawImage(bulletImage_Horizontal, this.x - 50, this.y - 25, this.spriteWidth, this.spriteHeight);
    }

    update(){
        this.x -= this.speed;
        const distance_x = this.x - player.x;
        const distance_y = this.y - player.y;
        this.distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
        //Bullet recursion on random horizontal point
        /* if(distance < this.radius + player.radius){
            handleGameOver();
        } */
    }

}
const bulletHorizontal = new BulletHorizontal();

//Vertical Bullets
class BulletVertical{
    constructor(){
        this.x = Math.random() * (canvas.width);
        this.y = -100;
        this.radius = 50;
        this.speed = Math.random() * 1 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.spriteWidth = 50;
        this.spriteHeight = 100;
    }

    update(){
        this.y += this.speed;
        const distance_x = this.x - player.x;
        const distance_y = this.y - player.y;
        this.speed = Math.random() * 1 + 1;
        // Collision detection
        this.distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y); //pythagorean theorem
        
    }

    draw(){
        //Skeleton bullet
        /* context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x,this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.stroke(); */
        context.drawImage(bulletImage_Vertical, this.x - 25, this.y - 50, this.spriteWidth, this.spriteHeight);
    }
}

const bulletsPop1 = document.createElement('audio');
bulletsPop1.src = './assets/audio/vgmenuhighlight.ogg';
const bulletsPop2 = document.createElement('audio');
bulletsPop2.src = './assets/audio/vgmenuselect.ogg';

function handleBulletsVertical(){
    if(!gameOver){
        if(gameFrame % 225 == 0){
            bulletsVerticalArray.push(new BulletVertical());
            //(console.log(bulletsVerticalArray.length));
        }
        for(let i = 0; i < bulletsVerticalArray.length; i++){
            bulletsVerticalArray[i].draw();
            bulletsVerticalArray[i].update();
            if(bulletsVerticalArray[i].y < 0 - bulletsVerticalArray[i].radius * 2 ){
                bulletsVerticalArray.splice(i, 1);
                i--;
            }else if(bulletsVerticalArray[i].distance < bulletsVerticalArray[i].radius + player.radius){
                //(console.log('collision'));
                
                if(!bulletsVerticalArray[i].counted && health > 20){
                    if(bulletsVerticalArray[i].sound == 'sound1'){
                        bulletsPop1.play();
                    }else{
                        bulletsPop2.play();
                    }
                    
                    bulletsVerticalArray[i].counted = true;    
                    bulletsVerticalArray.splice(i, 1);  
                    i--; 
                    health-=20;
                }else if(!bulletsVerticalArray[i].counted && health == 20){
                    if(bulletsVerticalArray[i].sound == 'sound1'){
                        bulletsPop1.play();
                    }else{
                        bulletsPop2.play();
                    }
                    i--; 
                    health = health-20;
                    handleGameOver();
                }
    
            }
    
        }
    }
}

function handleBulletsHorizontal(){
    if(!gameOver){
        if(gameFrame % 225 == 0){
            bulletsHorizontalArray.push(new BulletHorizontal());
            //(console.log(bulletsHorizontalArray.length));
        }
        for(let i = 0; i < bulletsHorizontalArray.length; i++){
            bulletsHorizontalArray[i].draw();
            bulletsHorizontalArray[i].update();
            if(bulletsHorizontalArray[i].y < 0 - bulletsHorizontalArray[i].radius * 2){
                bulletsHorizontalArray.splice(i, 1);
                i--;
            }else if(bulletsHorizontalArray[i].distance < bulletsHorizontalArray[i].radius + player.radius){
                //(console.log('collision'));
                if(!bulletsHorizontalArray[i].counted && health > 20){
                    if(bulletsHorizontalArray[i].sound == 'sound1'){
                        bulletsPop1.play();
                    }else{
                        bulletsPop2.play();
                    }
                    
                    bulletsHorizontalArray[i].counted = true;    
                    bulletsHorizontalArray.splice(i, 1);  
                    i--; 
                    health-=20;
                }else if(!bulletsVerticalArray[i].counted && health == 20){
                    if(bulletsVerticalArray[i].sound == 'sound1'){
                        bulletsPop1.play();
                    }else{
                        bulletsPop2.play();
                    }
                    i--; 
                    health = health-20;
                    handleGameOver();
                }
               
            }
    
        }
    }
}

//Area platform
const background = new Image();
background.src = 'assets/images/area.png';

function handleBackground(){
    var wrh = background.width / background.height;
    var newWidth = canvas.width;
    var newHeight = newWidth / wrh;
    if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
      }
    var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 3) : 0;
    var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 3) : 0;

    context.drawImage(background, xOffset, yOffset + 350, newWidth, newHeight/3);
}

//Game-over
function handleGameOver() {
    context.fillStyle = 'red';
    context.fillText('GAME OVER', (canvas.width/2) - 100 , (canvas.height/2) - 50);
    gameOver = true;
}


//Animation Loop
function animate(){
    context.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    handleBulletsVertical();
    handleBulletsHorizontal();
    player.update();
    player.draw();
    context.fillStyle = '#202830';
    context.fillText('Health: '+health, 10,50);
    gameFrame++;
    //console.log(gameFrame);
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});