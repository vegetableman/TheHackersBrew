
function booze(domid,width,height,ingredients){

//Resig style : check for instantiation    
  if(!(this instanceof arguments.callee)){
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function(){
    self.paper = Raphael(domid,width,height);
    self.loadBoozeFonts();
    self.fillBottom();
    self.fillMid();
    self.fillHandle();
    self.fillFoam();
  }

  self.loadBoozeFonts = function(){
    self.boozeFonts = ['Courier New','Arial','Lucida Console'];
  }


//fill Bottom part of the jug
  self.fillBottom = function(){
    var hypX=250, hypY=100;
   //No. of rows at the bottom
    var rows=5;
    var traverseFlag=1,ingredientsSlice=[];
    for(var row=1;row<rows;row++){
      hypX -= row*20;
      hypY -= 20;
   //flag to traverse from left to right and right to left
      traverseFlag *= -1;
   //Decrease the no. of elements to loop over on increase of row counter
      ingredientsSlice = $(ingredients).slice(0,$(ingredients).size()/row);
      self.fillBottomHalf(ingredientsSlice,self.boozeFonts,hypX,hypY,traverseFlag);
  }
}

  self.fillBottomHalf = function(ingredients,boozeFonts,hypX,hypY,traverseFlag){
    var bottomLabel,bottomColors=["#2C3033","#000000"];
    var angle = (Math.PI)/($(ingredients).size()-1);
    var dx = 0,dy = 0,interval=100;
    console.log('<<<<<Size:'+$(ingredients).size()+'>>>>>');
    $.each(ingredients,function(index,content){
    //multiply interval with index so as to see the delay in traverse 
      $(this).delay(interval*index).queue(function(){
        console.log('<<<<<'+content.ingredient+'>>>>>')
        dx = traverseFlag*hypX*Math.cos(angle*index*-1);
        dy = -1*hypY*Math.sin(angle*index*-1);
        var attrObj = {
	  'text':content.ingredient,
          'x':dx,
          'y':dy,
	  'fill':bottomColors[Math.floor(Math.random()*$(bottomColors).length)],
	  'font-family':self.boozeFonts[Math.floor(Math.random()*$(self.boozeFonts).length)]
        }
        console.log("x :"+attrObj.x)
        console.log("y :"+attrObj.y)
        bottomLabel = self.paper.text()
        bottomLabel.attr(attrObj);
       //translate relative to heigth passed
        bottomLabel.translate(height-200,height-200);
     //empty the queue for the new rows to show up
        $(this).dequeue();
      });
    });
  }

//fill text contents in the middle portion
//Need to simplify this function
  self.fillMid = function(){
    var startY=height-220,startX,endX,midLabel,bottomColors=["#2C3033","#000000"];
    var dx=0;
    var isEven = 0;
    var indent = 0;
    while(startY > 20){

     //for creating the curves based on predefined portions of the mug
      if(startY > 400){
        indent -= 2;
      }
      else if(startY > 450){
        indent -= 1;
      }
      else if(startY < 100){
        indent -= 1;
      }
      else{
        indent += 1;
      }

    //for traversing from left to right and right to left based on even/odd row number   
     if(isEven % 2 == 0){
      startX = 360;
      endX = 830;
      for(var index=0;index<10;index++){
        if(index === 0 && startY < 580){
          startX -= (5 + indent);
        }
        if(index === 9 && startY < 580){
          endX += (10 + indent);
        }

        dx = (index===0)?startX:(index===9)?endX:startX +(50*index)+Math.floor(Math.random()*20);

        console.log("startY: "+startY);
        console.log("dx: "+dx) 

        var attrObj = {
          'text':ingredients[index].ingredient,
          'x':dx,
          'y':startY,
          'fill':bottomColors[Math.floor(Math.random()*$(bottomColors).length)],
          'font-family':self.boozeFonts[Math.floor(Math.random()*$(self.boozeFonts).length)]
        };
        midLabel = self.paper.text();
        midLabel.attr(attrObj);
      }
     }
    else{
       startX = 830;
       endX = 360;
       for(var index=9;index>-1;index--){
        if(index === 9 && startY < 580){
          startX += (10 + indent);
        }
        if(index === 0 && startY < 580){
          endX -= (5 + indent);
        }

        dx = (index===9)?startX:(index===0)?endX:startX-(50*index)+Math.floor(Math.random()*20);

        console.log("startY: "+startY);
        console.log("dx: "+dx) 

        var attrObj = {
          'text':ingredients[index].ingredient,
          'x':dx,
          'y':startY,
          'fill':bottomColors[Math.floor(Math.random()*$(bottomColors).length)],
          'font-family':self.boozeFonts[Math.floor(Math.random()*$(self.boozeFonts).length)]
        };

        midLabel = self.paper.text();
        midLabel.attr(attrObj);
     }
    }
     startY-=30;
     isEven++;
    }
  }

/*Bezier Cubic Curve transformation
 Reference:-http://processingjs.nihongoresources.com/bezierinfo/
 Reference:-http://www.paultondeur.com/2008/03/09/drawing-a-cubic-bezier-curve-using-actionscript-3*/
//fill Handle of the jug
self.fillHandle = function(){
  var handLabel, x = 0, y = 0;
  var brewArr = ["The","Hackers","Brew"],brewIndex=0;
  var anchorX1=800,anchorX2=860,controlX1=1100,controlX2=1100;
  var anchorY1=600,controlY1=700,controlY2=50,anchorY2=150;
  while(brewIndex < 5){
    (function(controlX,controlY,anchorY1,controlY1,controlY2,anchorY2){
      for(var t=0;t<=1;t+=1/20){
       //two control points for better curve manipulation
        x = Math.pow(t,3)*anchorX1+3*Math.pow(t,2)*(1-t)*controlX+3*Math.pow((1-t),2)*t*controlY+Math.pow((1-t),3)*anchorX2;
        y = Math.pow(t,3)*anchorY1+3*Math.pow(t,2)*(1-t)*controlY1+3*Math.pow((1-t),2)*t*controlY2+Math.pow((1-t),3)*anchorY2;
        console.log(">>>>x in bezier curve<<<<<"+x);
        console.log(">>>>y in bezier curve<<<<<"+y);
       //to handle the merging of text elements for subsequent rows
        if(brewIndex < 3) {x += 10;} 
        handLabel =  self.paper.text(x,y,brewArr[Math.floor(Math.random()*3)]);
        }
    })(controlX1,controlX2,anchorY1,controlY1,controlY2,anchorY2);
//  controlX1 += 10;
    controlX2 += 10;
    anchorY1 -= 10;
    anchorY2 -= 10;
    controlY1 -= 5;
    controlY2 -= 10;
    brewIndex++;
  }
}

//yet to be done :-)
self.fillFoam = function(){
  
}

 self.init();
}


        

var booze;

//Color Sample => #EAB102

//Array of objects to interate over to fetch text contents from
//Need to update the array with more languages
jQuery(function(){
  booze = new booze('booze',2000,800,[
    {ingredient:'C++',x:100,y:100,size:15},
    {ingredient:'ASSEMBLY',x:100,y:120,size:15},
    {ingredient:'LISP',x:160,y:200,size:15},					
    {ingredient:'C',x:160,y:200,size:15},					
    {ingredient:'JAVA',x:160,y:200,size:15},					
    {ingredient:'ALGOL',x:160,y:200,size:15},					
    {ingredient:'PASCAL',x:160,y:200,size:15},
    {ingredient:'R',x:100,y:100,size:15},
    {ingredient:'SCALA',x:100,y:100,size:15},
    {ingredient:'C#',x:100,y:100,size:15},
    {ingredient:'COBOL',x:100,y:100,size:15},
    {ingredient:'MATLAB',x:100,y:100,size:15},
    {ingredient:'LUA',x:100,y:100,size:15},
    {ingredient:'JAVASCRIPT',x:100,y:100,size:15},
    {ingredient:'JQUERY',x:100,y:100,size:15},
    {ingredient:'VB',x:100,y:100,size:15},
    {ingredient:'ASP',x:100,y:100,size:15},
    {ingredient:'PHP',x:100,y:100,size:15},
    {ingredient:'JSP',x:100,y:100,size:15}
  ]);

  console.log("height : "+window.innerHeight);
  console.log("width : "+window.innerWidth);
 });


//Path transformation from Raphael library

  // for(var i=0;i<270;i+=30){
  //   var t="t900,400r"+i+"";
  //   var attrObj ={
  //     'text':'The Hackers Brew',
  //     'transform':t
  //   }
  //  handLabel = self.paper.text();
  //  handLabel.attr(attrObj);
  // }
