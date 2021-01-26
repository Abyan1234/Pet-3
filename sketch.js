
var dog,dogImg,dogImg1;
var database;
var foodS,foodStock; 
var lastFed;
var fedTime,feed,addFood,foodObj,sadDog;

  function preload(){ 
    dogImg=loadImage("images/dogImg.png");
     dogImg1=loadImage("images/dogImg1.png");
     bedroom=loadImage("images/Bed Room.png");
    garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
 sadDog=loadImage("images/Lazy.png");
} 
    
     //Function to set initial environment 
     function setup() { 
       database=firebase.database(); 
       createCanvas(400,500); 
       
      foodObj=new Food();

       dog=createSprite(790,200,150,150);
        dog.addImage(dogImg); 
        dog.scale=0.15; 
        
        foodStock=database.ref('Food');
         foodStock.on("value",readStock); 
         
         fedTime=database.ref('FeedTime');
         fedTime.on("value",function(data){
           lastFed=data.val();
         });

         readState=database.ref('gameState');
         readState.on("value",function(data){
           gameState=data.val();
         })

         feed=createButton("Feed The Dog");
          feed.position(700,95);
      feed.mousePressed(feedDog);

      addFood=createButton("Add Food");
      addFood.position(800,95);
      addFood.mousePressed(addFoods);

        
     }
   

// function to display UI 
function draw() { 
  
 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("Playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
   update("Sleeping");
foodObj.bedroom();
 }else if(currentTime>(lastFed+2 && currentTime<=(lastFed+4))){
   update("Bathing");
   foodObj.washroom();
 }else{
   update("Hungry");
   foodObj.display();
 }
  
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

    drawSprites(); 
   
     } 
     //Function to read values from DB function
      function readStock(data)
      { 
        foodS=data.val(); 
        foodObj.updateFoodStock(foodS);
      } 

    //Function for feedDog here
    function feedDog(){
      dog.addImage(dogImg1);

      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
      database.ref('/').update({
          Food:foodObj.getFoodStock(),
          FeedTime:hour(),
          gameState:"Hungry"
      })
    }
     
//Function for addFoods here
function addFoods(){

  foodS++;
database.ref('/').update({
  Food:foodS
})

}

function update(state){
database.ref('/').update({
  gameState:state
})

}