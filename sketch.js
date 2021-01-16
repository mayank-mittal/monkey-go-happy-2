//creating objects
var monkey , monkeySound, monkey_running, monkeyEnd;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score = 0;
var grass,firstGrass, grassImage;
var invisibleGround;
var START = 0;
var PLAY = 1;
var END = 2;
var gameState = START;
var time = 0;
var gameOverSound, gameWinSound;
var fruitLeft = 15;
var forest, forest1, forestImage;
var frameCount1,frameRate1;
var levelUp;
var chances = 1;
var rockDestroy;

//loding the images
function preload(){
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  monkeySound = loadSound("monkey.mp3");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  grassImage = loadImage("grass-.png");
  gameOverSound = loadSound("gameover.mp3");
  gameWinSound = loadSound("game_win.mp3");
  forestImage = loadImage("forest.png");
  monkeyEnd = loadAnimation("sprite_0.png");
  levelUp = loadSound("level_up.mp3");
  rockDestroy = loadSound("rock_crash.mp3");
  
}


//creating sprites and groups
function setup() {
 createCanvas(500,450);
  
  //creating the background

 
  //creating the monkey
  monkey = createSprite(80,400);
  monkey.addAnimation("monkey",monkey_running);
  monkey.addAnimation("monkey1",monkeyEnd);
  monkey.scale = 0.18;
  monkey.setCollider("rectangle",0,0,500,600);
  monkey.debug = false;

  //creating the invisible ground
  invisibleGround = createSprite(80,460,150,20);
  invisibleGround.visible = false;
  
  //creating groups
  FoodGroup = new Group();
  obstacleGroup = new Group();
  grassGroup = new Group();
  forestGroup = new Group();
}

//adding functions to the objects
function draw() {
  //clearing the screen
  background("skyblue");

if(gameState === START || gameState === PLAY){  

  if(frameCount % 30 === 0){
  
  //creating the grasses
  grass = createSprite(750,430);
  grass.addImage(grassImage);
  grass.scale = 0.4; 
  grass.lifetime = 200;
  grass.velocityX = -9;  
  grassGroup.add(grass); 
  grass.depth = 5;
  monkey.depth = grass.depth + 5; 
   }
  if(frameCount % 17.75  === 0){
  
  forest = createSprite(900,220);
  forest.scale = 0.65;
  forest.addImage(forestImage);
  forest.velocityX = -9;
  forest.lifetime = 300;
  forestGroup.add(forest);
  forest.depth = 1;

  }
}

  //drawing the sprites
   drawSprites();
  
  //applying gameState and functions etc. to the game 
   if(gameState === START){        
   
  //giving value to frameCount1
   frameCount1 = frameCount;
  
   monkey.scale = 0.18; 
    
   textStyle("bold");
   fill("red");
   textFont("comic sans ms");
   textSize(15);
   text("CLICK ON THE SCREEN FIRST",140,150);
   fill("orangered");
   text("THEN PRESS 'SPACE' TO START THE GAME",85,175);
   fill("blue");
   text("THE MONKEY HAS 15 BANANAS ONLY",100,200);
   fill("BROWN");
   text("MONKEY HAS TO TOUCH 10 BANANAS",100,225);

   //changing animation of the monkey
     monkey.changeAnimation("monkey",monkey_running);
     
    if(frameCount === 1){
      
    firstGrass = createSprite(400,440);
    firstGrass.addImage(grassImage);
    firstGrass.scale = 0.6;
    firstGrass.lifetime = 150;
    firstGrass.velocityX = -9;
      
    forest1 = createSprite(580,220);
    forest1.scale = 0.89;
    forest1.addImage(forestImage);
    forest1.lifetime = 200;
    forest1.velocityX = -9;
    monkey.depth = forest1.depth + 2;
    forest1.depth = 2;
   }
 }
  
  if(gameState === START && keyDown("space")){
    gameState = PLAY; 
  }
  
  if(gameState === PLAY){

      if(keyDown("space") && monkey.collide(invisibleGround)){
      monkey.velocityY = -18; 

      monkeySound.play(); 

     setTimeout(function(){
      monkeySound.stop();
     },1000);
  }
  
    //giving gravity to the monkey
    monkey.velocityY = monkey.velocityY + 0.5;
    
    monkey.collide(invisibleGround);
    
    spawnObjects();
    
    scoreIncrease();
    
    gameOver();
    
    time = Math.round((frameCount - frameCount1)/60);
    console.log("Survival time : " + time);  
    textStyle("bold");
    textSize(12);
    textFont("comic sans ms");
    fill("WHITE");
    text("SURVIVAL TIME : " + time,200,30);
    fill("orangered")
    text("SCORE : " + score + " / 10",215,50);
    console.log("fruitLeft : " + fruitLeft);
}
  
  if(gameState === END){
        
    monkey.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setVelocityXEach(0);
    FoodGroup.setLifetimeEach(-1);

    grassGroup.setVelocityXEach(0);
    grassGroup.setLifetimeEach(-1);
    
    forestGroup.setVelocityXEach(0);
    forestGroup.setLifetimeEach(-1);
    
    textStyle("bold");
    fill("red");
    textSize(15);
    textFont("comic sans ms");
    text("PRESS 'R' TO RESTART",155,210);
    
    if(score === 10){
      
      textStyle("bold");
      textSize(20);
      textFont("comic sans ms");
      fill("blue");
      text("YOU WIN",200,180);
    }
    
    if(score < 10){
           
      textStyle("bold");
      textSize(20);
      textFont("comic sans ms");
      fill("darkviolet");
      text("YOU LOSE",190,180); 
    }
    
    //creating reset function
    if(keyDown("r")){
      
      gameState = START;
      score = 0;
      fruitLeft = 15;
      chances = 1;
      
      obstacleGroup.destroyEach();
      FoodGroup.destroyEach();
      monkey.y = 400;
      grassGroup.destroyEach();
      forestGroup.destroyEach();
      
      frameCount = 0;
    }
    //chnaging animation of the monkey when it touches the obstacles 
    monkey.changeAnimation("monkey1",monkeyEnd);
  }
}

//creating function to spawn random objects
function spawnObjects(){
  
  //creating random banana spawn function
  if(frameCount % 80 === 0 && fruitLeft > 0){
    
    banana = createSprite(550,Math.round(random(100,300)));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.lifetime = 100;
    banana.velocityX = -7;
    banana.depth = monkey.depth - 1;
    
    banana.setCollider("rectangle",0,30,600,180);
    banana.debug = false;
    
    FoodGroup.add(banana);
    
    fruitLeft = fruitLeft - 1;
  }

  //creating andom obstacle spawn
  if(frameCount % 300 === 0){
    
    obstacle = createSprite(550,410);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.3;
    obstacle.lifetime = 200;
    obstacle.velocityX = -9;
    
    obstacle.setCollider("circle",0,0,180);
    obstacle.debug = false
    obstacleGroup.add(obstacle);
    obstacle.depth = 15;
  } 
}

//creating function to increase the score
function scoreIncrease(){
  
  if(monkey.isTouching(FoodGroup)){
    
    score = score + 1;
    FoodGroup.destroyEach();
    
    if(score % 4 === 0 && score > 0){
       monkey.scale = monkey.scale + 0.03;
       levelUp.play();
    }
  }
  
}
//creating fuction for win and lose
function gameOver(){
  
  if(monkey.isTouching(obstacleGroup)){

    if(chances === 0){
    gameState = END;
    gameOverSound.play();
  }
    if(chances > 0){
      
    obstacleGroup.destroyEach();
    rockDestroy.play();
      
    setTimeout(function(){
      
    rockDestroy.stop();
    },600);
    chances = chances - 1;
    monkey.scale = monkey.scale - 0.05;
      
    console.log("Your chances left : " + chances);
    }
  }
  
  if(score === 10){
    gameState = END;
    gameWinSound.play();
  }
  
  if(fruitLeft === 0){
    
    setTimeout(function(){
    if(score < 10 && fruitLeft === 0 && gameState === PLAY){
      gameState = END;
      gameOverSound.play();
      }
    },3500);
    
  }
}
