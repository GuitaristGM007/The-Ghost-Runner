//declare necessary variables of sprites, groups, images, gameStates, sounds, score and other counting, etc.
//declare the sprites, their images and necessary groups
var tower, towerImage;
var door, doorImage, doorGroup;
var climber, climberImage, climberGroup;
var ghost, ghostImage1, ghostImage2;
var fire, fireImage, fireGroup;
var potion, potionImage, potionGroup;
var invisibleGround1, invisibleGround2, invisibleGround3, invisibleGround4, invisibleGroundGroup;
var reset, resetImage;

//declare the sound
var bgSound;

//declare the gameStates and set the initial gameState
var SERVE = 0;
var PLAY = 1;
var END = 2;
var gameState = SERVE;
 
//declare the score and positional count
var score = 0;
var position = 0;

//call the function to preload the images and sounds
function preload(){
//load the image(s)
  rulesImage = loadImage("rules.jpg");
  towerImage = loadImage("tower.png");
  doorImage = loadImage("door.png");
  climberImage = loadImage("climber.png");
  ghostImage1 = loadImage("ghost-standing.png");
  ghostImage2 = loadImage("ghost-jumping.png");
  fireImage = loadImage("Fire.jpg");
  potionImage = loadImage("Potion.jpg");
  resetImage = loadImage("19 - Reset.png");
  
//load the sound(s)
  bgSound = loadSound("spooky.wav");
}

//call the function to design the basic setup of the game
function setup(){
//create the canvas area of required size
  createCanvas(windowWidth, windowHeight);
  
//create necessary group(s)
  climberGroup = new Group();
  invisibleGroundGroup = new Group();
  doorGroup = new Group();
  fireGroup = new Group();
  potionGroup = new Group();
  
//create a sprite for the tower with its general properties
  tower = createSprite(windowWidth/2, windowHeight/2,  windowWidth, windowHeight);
  tower.addImage("base", towerImage);
  
//create a sprite for ghost with its general properties
  ghost = createSprite(windowWidth/3, windowHeight/3,  windowWidth/12, windowHeight/12);
  ghost.scale = 0.375;

//set a collider of ghost to make the game realistic
  ghost.setCollider("circle", 0, 0, 140);
//debugging the ghost - true/false
  ghost.debug = false;
  
//create a sprite for invisible ground - down
  invisibleGround1 = createSprite(windowWidth/2, windowHeight/1,  windowWidth, windowHeight/windowHeight);
  invisibleGround1.visible = false;
  
//create a sprite for invisible ground - up
  invisibleGround2 = createSprite(windowWidth/2,    windowHeight/windowHeight, windowWidth,  windowHeight/windowHeight);
  invisibleGround2.visible = false;  
  
//create a sprite for invisible ground - left
  invisibleGround3 = createSprite(windowWidth/windowWidth,  windowHeight/2, windowWidth/windowWidth, windowHeight);
  invisibleGround3.visible = false;
  
//create a sprite for invisible ground - right
  invisibleGround4 = createSprite(windowWidth/1, windowHeight/2, windowWidth/windowWidth, windowHeight);
  invisibleGround4.visible = false;
  
//add the invisible grounds to the respective group
  invisibleGroundGroup.add(invisibleGround1);
  invisibleGroundGroup.add(invisibleGround2);
  invisibleGroundGroup.add(invisibleGround3);
  invisibleGroundGroup.add(invisibleGround4);
  
//create a sprite for reset
  reset = createSprite(windowWidth/2, windowHeight/1.2,    windowWidth/3, windowHeight/12); 
  reset.addImage("again", resetImage);
  reset.scale = 0.2;
}

//call the function to draw the sprites with different properties
function draw(){
//define background
  background(0);
  
//game controls for gameState SERVE
if (gameState === SERVE){
//set the velocity of tower
  tower.velocityY = 0;
//set the visibility of reset
  reset.visible = false;
//set the required image of ghost
  ghost.addImage("standing", ghostImage1);
//set a collider of ghost to make the game realistic
  ghost.setCollider("circle", 0, 0, 140);
//debugging the ghost
  ghost.debug = true;
//set the initial position of ghost
  ghost.x = windowWidth/3;
  ghost.y = windowHeight/3;
//set the score
  score = 0;
//set the position
  position = 0;
//commands to enter playState
  if (keyDown("SPACE")){
    gameState = PLAY;
}
}
  
//game controls for gameState PLAY
if (gameState === PLAY){
//set the visibility of reset
  reset.visible = false;
//set the score and make it increase automatically
  score = score + Math.round(getFrameRate()/60);
  
//display game adaptivity - 1
if(score >= 0 && score < 100){
  tower.velocityY = 1.5;
}
  
//display game adaptivity - 2
if(score >= 100 && score < 250){
  tower.velocityY = 3;
}
  
//display game adaptivity - 3
if(score >= 250 && score < 500){
  tower.velocityY = 4.5;
}
  
//display game adaptivity - 4
if(score >= 500 && score < 750){
  tower.velocityY = 6;
}
  
//display game adaptivity - 5
if(score >= 750 && score < 1000){
  tower.velocityY = 7.5;
}
  
//display game adaptivity - 6
if(score >= 1000 && score < 2000){
  tower.velocityY = 10;
}
  
//display game adaptivity - 7
if(score >= 2000){
  tower.velocityY = 12.5;
}
  
//set the required image of ghost
  ghost.addImage("jumping", ghostImage2);
//make the ghost jump at a certain condition
if (keyDown("SPACE")){
  ghost.velocityY = -5;
  ghost.velocityX = 0;
}
//make the ghost move left at a certain condition
if (keyDown("LEFT_ARROW")){
  ghost.velocityX = -3;
}
//make the ghost move right at a certain condition
if (keyDown("RIGHT_ARROW")){
  ghost.velocityX = 3;
}
  
//call the function to spawn the climbers and doors
spawnClimbersDoors();
  
//call the function to spawn the threats - fire  and potion
spawnThreats();
  
//make the background infinite
if (tower.y > 400){
  tower.y = height/10;
}
  
//add the gravitational effect to the ghost to make it fall
  ghost.velocityY = ghost.velocityY + 0.75;
  
//destroy the climbers and doors once their role is over and increase the count of positions
if (ghost.isTouching(climberGroup) || ghost.isTouching(doorGroup)){
  climberGroup.destroyEach();
  doorGroup.destroyEach();
  position = position + 1;
}
  
//give all the necessay conditional commands to enter endState
if (ghost.isTouching(invisibleGroundGroup) || ghost.isTouching(fireGroup) || ghost.isTouching(potionGroup)){
  gameState = END
}
}
  
//game controls for gameState END
if (gameState === END){
//set the visibility of ghost
  ghost.visible = false;
//set the visibility of reset
  reset.visible = true;
//set the velocity of tower
  tower.velocityY = 0;
//set the score
  score = 0;
//set the position
  position = 0;
//destroy the sprites in all the required groups
  climberGroup.destroyEach();
  doorGroup.destroyEach();
  fireGroup.destroyEach();
  potionGroup.destroyEach();
//set the velocity of all the required groups
  climberGroup.setVelocityYEach(0);
  doorGroup.setVelocityYEach(0);
  fireGroup.setVelocityYEach(0);
  potionGroup.setVelocityYEach(0);
//set the lifetime of all the required groups
  climberGroup.setLifetimeEach(-1);
  doorGroup.setLifetimeEach(-1);
  fireGroup.setLifetimeEach(-1);
  potionGroup.setLifetimeEach(-1);
//call the function to reset the game at a user_defined condition
if (mousePressedOver(reset)){
  again();
}
}
  
//play a specific sound which can be heard continuously once the gameState enters playState
if (gameState === PLAY){
  bgSound.play();
}
  
//give the command to draw the sprites
  drawSprites();
//text for gameState SERVE
if (gameState === SERVE){
  strokeWeight(2);
  stroke("yellow");
  fill("purple");
  textSize(windowHeight/24);
  text("Score = "+score, windowWidth/2.15, windowHeight/12);  
  text("Position = "+position, windowWidth/2.2, windowHeight/8);
  textSize(windowHeight/12.5);
  text("Ghost Runner", windowWidth/2.65, windowHeight/2);
  textSize(windowHeight/17.5);
  text("Press Space To Start The Game", windowWidth/3.15,  windowHeight/1.25);
}
//text for gameState PLAY
if (gameState === PLAY){
  strokeWeight(2);
  stroke("yellow");
  fill("purple");
  textSize(windowHeight/24);
  text("Score = "+score, windowWidth/2.15, windowHeight/12);  
  text("Position = "+position, windowWidth/2.2, windowHeight/8);
}
//text for gameState END
if (gameState === END){
  strokeWeight(2);
  stroke("yellow");
  fill("purple");
  textSize(windowHeight/24);
  text("Score = "+score, windowWidth/2.15, windowHeight/12);  
  text("Position = "+position, windowWidth/2.2, windowHeight/8);
  textSize(windowHeight/12.5);
  text("Game Over", windowWidth/2.5, windowHeight/3);
  textSize(windowHeight/17.5);
  text("Press Reset Button To Restart", windowWidth/3.1,      windowHeight/1.6);
}
}

//function to spawn the climbers
function spawnClimbersDoors(){
//set a specific frameCount to spawn the sprite
if (frameCount % windowHeight/30 === 0){
//call the sprites and define their properties
  climber = createSprite(Math.round(random(windowWidth/windowWidth,      windowWidth/1)), windowHeight/windowHeight, windowWidth/15,  windowHeight/30);
  door = createSprite(climber.x, climber.y-55,  windowWidth/15,  windowHeight/30);
//add the images to the sprites 
  climber.addImage("step", climberImage);
  door.addImage("portal", doorImage);
//scale the sprites
  door.scale = 0.8;
//set the velocityY for both the sprites
  climber.velocityY = tower.velocityY;
  door.velocityY = climber.velocityY;
//set the lifetime of both the sprites
  climber.lifetime = windowHeight/climber.velocityY;
  door.lifetime = climber.lifetime;
//add the sprites to their respective groups
  climberGroup.add(climber);
  doorGroup.add(door);
}
}

//function to spawn the fire
function spawnFire(){
//set a specific frameCount at which the sprite will be released
if (frameCount % windowHeight/20 === 0){
//call the sprite
  fire = createSprite(Math.round(random(windowWidth/windowWidth,  windowWidth/1)), windowHeight/windowHeight, windowWidth/15,  windowHeight/30);
//add the image to the sprite
  fire.addImage("flames", fireImage);
//scale the sprite(s)
  fire.scale = 0.08;
//set the velocity of the sprite
  fire.velocityY = tower.velocityY;
//set the lifetime of the sprite
  fire.lifetime = windowHeight/fire.velocityY;
//add the sprite to the respective group
  fireGroup.add(fire);
}
}


//function to spawn the potions
function spawnPotion(){
//set a specific frameCount at which the sprite will be released
if (frameCount % windowHeight/20 === 0){
//call the sprite
  potion = createSprite(Math.round(random(windowWidth/windowWidth,  windowWidth/1)), windowHeight/windowHeight, windowWidth/15,  windowHeight/30);
//add the image to the sprite
  potion.addImage("trap", potionImage);
//scale the sprite(s)
  potion.scale = 0.2;
//set the velocity of the sprite
  potion.velocityY = tower.velocityY;
//set the lifetime of the sprite
  potion.lifetime = windowHeight/potion.velocityY;
//add the sprite to the respective group
  potionGroup.add(potion);
}
}

//function to spawn any one of the threats fire/potion
function spawnThreats(){
//set a specific frameCount at which the sprite will be released
if (frameCount % windowHeight % 20 === 0){
//declare the sprite
  var rand = Math.round(random(1, 2));
//switch the sprite
  switch (rand){
//declare case 1
    case 1 : spawnFire();
    break;
//declare case 2
    case 2 : spawnPotion();
    break;
//default  
    default : break;
}
}
}

//function to reset the game
function again(){
//set the required gameState
  gameState = SERVE;
//set the visibility of ghost
  ghost.visible = true;
//set the visibility of false
  reset.visile = false;
//set the initial position of ghost in function of again
  ghost.x = windowWidth/3;
  ghost.y = windowHeight/3;

//destroy each and every sprite of required group(s)
  climberGroup.destroyEach();
  doorGroup.destroyEach();
  fireGroup.destroyEach();
  potionGroup.destroyEach();
  
//set the score
  score = 0;
//set the position
  position = 0;
}
