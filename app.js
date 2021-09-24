/* 
    Author: Mary Catherine Villondo
    Description: This project is a requirement for submission in IT461 - Advance Web Systems.The languages used here are html, css and vanila js. Patuti is 2D Game where in the controlled character (Patuti) is a space alien which aim is to stay alive. The user controlls the character to ensure that it must evade the collision with the bullets.  
*/
// Canvas setup
// Global Variables
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = 880;
canvas.height = 672;

let health = 100;
let gameFrame = 1;
let gameSpeed = 1;
let gameOver = false;

context.font = '2.5rem Poppins';

//Mouse Interactivity 
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width /2,
    y: canvas.height/2,
    click:false
}

//Events everytime a mouse is clicked or not
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
//Sprite images for moving left and right
const playerLeft = new Image();
playerLeft.src = './assets/images/sprites/patuti_left.png';
const playerRight = new Image();
playerRight.src = './assets/images/sprites/patuti_right.png';

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = (canvas.height/2);
        this.radius = 50;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 323;
        this.spriteHeight = 323;
    }

    update(){
        // Distance calculation between patuti and mouse cursor position
        const distance_x = this.x - mouse.x;
        const distance_y = this.y - mouse.y;
        //Player Movement Speed Calculation
        if(mouse.x != this.x){
            this.x -= distance_x/30;
        }
        if(mouse.y != this.y){
            this.y -= distance_y/30;
        }

         // Spaghetti code refactored using the modulus operator
        if(gameFrame % 10 === 0) {
            this.frame++;
            if(this.frame >= 5) this.frame = 0;
            this.frameX++;
            if(this.frameX > 4) {
                this.frameX = 0;
            }
            console.log('current frame ' + this.frame + ' frameY: ' + this.frameY);
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
        // Uncomment to view geometic skeleton for Patuti
        /* context.fillStyle ='red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.fillRect(this.x, this.y, this.radius, 10); */

        //Creating the sprites in the canvas to prepare for animation
        context.save();
        context.translate(this.x, this.y);
        if(this.x >= mouse.x){
            context.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 53, 0 - 60, this.spriteWidth/3, this.spriteHeight/3);
        }else{
            context.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 53, 0 - 60, this.spriteWidth/3, this.spriteHeight/3);
        }
        context.restore();
    }
}
const player = new Player();

class HealthBar{
    constructor(x, y, width, height, maxHealth, color){
        this.x = x;
        this.y  = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.maxWidth = width;
        this.health = maxHealth;
        this.color = color;
    }

    show(){
        context.lineWidth = 5;
        context.strokeStyle = "#202830";
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.maxWidth, this.height);
    }

    updateHealth(value){
        this.health = value;
        this.width = (this.health/this.maxHealth) *this.maxWidth;
    }
}

const healthBarWidth = 200;
const healthBarHeight = 30;
const positionXHealthBar = canvas.width - (healthBarWidth + 15);
const positionYHealthBar = canvas.height - (healthBarHeight + 20);
const healthBar = new HealthBar (positionXHealthBar,  positionYHealthBar, healthBarWidth, healthBarHeight, health, "green");

//Bullets  
const bulletsVerticalArray = [];
const bulletsHorizontalArray = [];

//Sprite Images for the bullets
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
        this.distance;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.spriteWidth = 100;
        this.spriteHeight = 50;
    }

    draw(){
        //Uncomment to view geometric skeleton for horizontal bullet
        /* context.fillStyle = 'purple';
        context.beginPath();
        context.arc(this.x,this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.stroke(); */
        context.drawImage(bulletImage_Horizontal, this.x - 50, this.y - 25, this.spriteWidth, this.spriteHeight);
    }

    update(){
        //Bullet path
        this.x -= this.speed;
        // Caculation for collision using the pythagorian theorem.
        const distance_x = this.x - player.x;
        const distance_y = this.y - player.y;
        this.distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
    }

}
const bulletHorizontal = new BulletHorizontal();

//Vertical Bullets
class BulletVertical{
    constructor(){
        this.x = Math.random() * (canvas.width - 150) + 90;
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
        //Bullet path
        this.y += this.speed;
        // Caculation for collision using the pythagorian theorem.
        const distance_x = this.x - player.x;
        const distance_y = this.y - player.y;
        this.distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y); 
        
    }

    draw(){
        //Uncommetn to view geometric skeleton bullet
        /* context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x,this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.stroke(); */
        context.drawImage(bulletImage_Vertical, this.x - 25, this.y - 50, this.spriteWidth, this.spriteHeight);
    }
}

//Audio file sources for bullet collision
const audio_Bullets1 = document.createElement('audio');
audio_Bullets1.src = './assets/audio/vgmenuhighlight.ogg';
const audio_Bullets2 = document.createElement('audio');
audio_Bullets2.src = './assets/audio/vgmenuselect.ogg';

//Function for handling bullets
function handleBullets(){
    if(!gameOver){
        if(gameFrame % 225 == 0){
            bulletsVerticalArray.push(new BulletVertical());
            bulletsHorizontalArray.push(new BulletHorizontal());
            //(console.log(bulletsVerticalArray.length));
            //(console.log(bulletsHorizontalArray.length));
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
                        audio_Bullets1.play();
                    }else{
                        audio_Bullets2.play();
                    }
                    
                    bulletsVerticalArray[i].counted = true;    
                    bulletsVerticalArray.splice(i, 1);  
                    i--; 
                    health-=20;
                }else if(!bulletsVerticalArray[i].counted && health == 20){
                    if(bulletsVerticalArray[i].sound == 'sound1'){
                        audio_Bullets1.play();
                    }else{
                        audio_Bullets2.play();
                    }
                    i--; 
                    health = health-20;
                    
                    handleGameOver();
                }
                healthBar.updateHealth(health);
            }
    
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
                        audio_Bullets1.play();
                    }else{
                        audio_Bullets2.play();
                    }
                    
                    bulletsHorizontalArray[i].counted = true;    
                    bulletsHorizontalArray.splice(i, 1);  
                    i--; 
                    health-=20;
                }else if(!bulletsVerticalArray[i].counted && health == 20){
                    if(bulletsVerticalArray[i].sound == 'sound1'){
                        audio_Bullets1.play();
                    }else{
                        audio_Bullets2.play();
                    }
                    i--; 
                    health = health-20;
                    
                    handleGameOver();
                }
                healthBar.updateHealth(health);
            }
    
        }
    }
}

//Area platform
const background = new Image();
background.src = 'assets/images/area.png';

//Drawing the platform in the canvas element
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

    context.drawImage(background, xOffset, yOffset + 300, newWidth, newHeight/3);
}

//Game-over
const audio_gameOver = document.createElement('audio');
audio_gameOver.src = './assets/audio/gameover.ogg';

function handleGameOver() {
    context.fillStyle = 'red';
    context.fillText('GAME OVER', (canvas.width/2) - 120 , (canvas.height/2) - 50);
    gameOver = true;
    audio_gameOver.play();

}

//Animation Loop
function animate(){
    context.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    handleBullets();
    healthBar.show();
    player.update();
    player.draw();
    context.fillStyle = '#202830';
    context.fillText('Health: '+health, 10,50);
    gameFrame++;
    //console.log(gameFrame);
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

// Function to ensure that points stay the same event if window is resized
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});