"// noprotect"
var n=0, Max=5000, freq=5;
var R=[];
var bg,shaping;
var isUp=false, isDown=false;
var bgm;
function preload()
{
  soundFormats('mp3','ogg');
  bgm=loadSound('Pouring-rain.mp3');
}
function setup()
{
  createCanvas(windowWidth,windowHeight);
//  fullScreen();
  rainSet();
  bgSet();
  for(var i=0;i<Max;i++) R.push(new rain());
  bgm.loop();
}
function draw()
{
  image(bg,0,0);
  rainCreate();
  rainFall();
  rainDestroy();
  fraqControl();
  console.log(frameRate());
  bgm.setVolume(map(freq,1,100,0.1,1.0));
}
function keyPressed()
{
  if(keyCode==UP_ARROW) isUp=true;
  if(keyCode==DOWN_ARROW) isDown=true;
}
function keyReleased()
{
  if(keyCode==UP_ARROW) isUp=false;
  if(keyCode==DOWN_ARROW) isDown=false;
}

function rainSet()
{
  shaping=createGraphics(1,100);
  for(var i=0;i<100;i++)
  {
    shaping.stroke(255,map(i,0,100,300,0));
    shaping.point(0,100-i);
  }
}
function bgSet()
{
  bg=createGraphics(width,height);
  bg.noFill();
  bg.strokeWeight(1);
  for(var i=0;i<height;i++)
  {
    bg.stroke(map(i,0,height,100,0));
    bg.line(0,i,width,i);
  }
}
function rainCreate()
{
  var i;
  for(i=0;i<freq/10;i++)
  {
    R[n%Max].create();
    n++;
  }
  if(random(1)<freq/10-i+1)
  {
    R[n%Max].create();
    n++;
  }
}
function rainFall()
{
  for(var i=0;i<n;i++)
  {
    R[i].fall();
    R[i].drawing();
  }
}
function rainDestroy()
{
  for(var i=0;i<n-1;i++)
  {
    if(!R[i].onoff&&i!=n-1)
    {
      R[i]=R[n-1].copy();
      n--;
    }
  }
}
function fraqControl()
{
  if(isUp)
  {
    if(freq<10) freq+=1;
    else if(freq<30) freq+=2;
    else if(freq<100) freq+=5;
  }
  if(isDown)
  {
    if(freq>30) freq-=5;
    else if(freq>10) freq-=2;
    else if(freq>1) freq-=1;
  }
}

function rain()
{
  this.pos=createVector();
  this.dir=createVector();
  this.vel=0;
  this.onoff=false;
}
rain.prototype.create=function()
{
  this.pos.set(random(-width,width*2),0);
  this.vel=random(2,4);
  this.dir.set(0,this.vel);
  this.onoff=true;
}
rain.prototype.fall=function()
{
  this.dir.y=this.vel*map(mouseY,0,height,0.5,5);
  this.dir.x=map(mouseX,0,width,-2,2)*this.vel/4;
  this.pos.add(this.dir);
  this.destroyCheck();
}
rain.prototype.drawing=function()
{
  var stretch=map(this.dir.y,1,20,10,100);
  translate(this.pos.x,this.pos.y);
  rotate(this.dir.heading()-HALF_PI);
  image(shaping,0,-stretch,2,stretch);
  resetMatrix();
}
rain.prototype.copy=function()
{
  var newRain=new rain();
  newRain.pos=this.pos.copy();
  newRain.dir=this.dir.copy();
  newRain.vel=this.vel;
  newRain.onoff=this.onoff;
  return newRain;
}
rain.prototype.destroyCheck=function()
{
  if(mouseIsPressed)
  {
    var mouse=createVector(mouseX,mouseY+50);
    var dist=p5.Vector.sub(mouse,this.pos).mag();
    if(dist<50) this.onoff=false;
  }
  if(this.pos.y-100>height) this.onoff=false;
}
