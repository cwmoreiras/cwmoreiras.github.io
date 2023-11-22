//**************** HTML5 setup ******************

var canvas = document.createElement('canvas');
var cx = canvas.getContext("2d");
cx.canvas.width = 600;
cx.canvas.height = 600;
cx.fillStyle='black';
cx.fillRect(0,0, canvas.width, canvas.height);
var script_tag = document.getElementById('game');
script_tag.appendChild(canvas)
var sprite_img = document.getElementById("script").getAttribute('sprite_img');
//*************** THE SPRITE CLASS **************


function Sprite(spriteSheet, x, y, speed)
{
    this.image = new Image();
    this.image.src = spriteSheet;
    this.direction = 'up';
    this.activity = 'idle';
    this.spriteSheetRowPixel = 0;
    this.spriteSheetColumnPixel = 0;
    this.imageIndex = 0;
    this.slowDownIndex = 0;
    this.isMoving = false;
    this.x = x;
    this.y = y;
    this.speed = speed;
    
    this.update = function() {

        if (keyState[KEY_W]) {
            this.spriteSheetRowPixel = 0;
            this.y -= this.speed;
        } 
        if (keyState[KEY_S]) {
            this.spriteSheetRowPixel = 128; 
            this.y += this.speed;
        }
        if (keyState[KEY_A]) { 
            this.spriteSheetRowPixel = 64; 
            this.x -= this.speed;
        }
        if (keyState[KEY_D]) {
            this.spriteSheetRowPixel = 192; 
            this.x += this.speed;
        }
           
        if ((keyState[KEY_W] || keyState[KEY_A] 
          || keyState[KEY_D] || keyState[KEY_S]))
        {
            this.isMoving = true;
        }
        else
            this.isMoving = false;
        
        if (this.isMoving)
        {    
           switch(this.imageIndex)
            {
                case 0: this.spriteSheetColumnPixel =   0; 
                break;
                case 1: this.spriteSheetColumnPixel =  64; 
                break;
                case 2: this.spriteSheetColumnPixel = 128; 
                break;
                case 3: this.spriteSheetColumnPixel = 192; 
                break;
                case 4: this.spriteSheetColumnPixel = 256; 
                break;
                case 5: this.spriteSheetColumnPixel = 320; 
                break;
                case 6: this.spriteSheetColumnPixel = 384; 
                break;
                case 7: this.spriteSheetColumnPixel = 448; 
                break;
                case 8: this.spriteSheetColumnPixel = 512; 
                break;      
            };
        }
        else
            this.spriteSheetColumnPixel = 0;
        this.slowDownIndex++;
        if (this.slowDownIndex > 3)
        {
            this.imageIndex++;
            if (this.imageIndex > 8)
               this.imageIndex = 0;
            this.slowDownIndex = 0;  
        };
    };
    this.render = function()
    {
     // cx.drawImage(img,                 sx,                            sy,          swidth,sheight,    x,     y,   width,height);
        cx.drawImage(this.image, this.spriteSheetColumnPixel, this.spriteSheetRowPixel, 64,    64,   this.x, this.y,  64,    64);
    };
};



//**************** game Loop ***********************


var update = function(modifier) {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.fillRect(0, 0, canvas.width, canvas.height);
    sprite.update();
};

var render = function() {
    sprite.render();
};

var main = function() {
    
    var then = Date.now();
    var delta = then - now;

    update(delta/1000);
    render();
    requestAnimationFrame(main);

};



//****************** KEYBOARD EVENTS **********************

var keyState = [];
const KEY_W = 87;
const KEY_A = 65;
const KEY_D = 68;
const KEY_S = 83;

var keyLogger = function(e) {
    keyState[e.keyCode] = e.type == 'keydown'; 
};
window.addEventListener("keydown", keyLogger, false);
window.addEventListener("keyup", keyLogger, false);



//******************* setup **************************


requestAnimationFrame = window.requestAnimationFrame 
                     || window.webkitRequestAnimationFrame
                     || window.mozRequestAnimationFrame
                     || window.msRequestAnimationFrame;

var sprite = new Sprite(sprite_img, (canvas.width - 64)/2 , (canvas.height - 64)/2, 3);
var now = Date.now();
main();     // GO