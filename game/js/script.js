var line_num=15;
var line_width=18;
var me=true;
var chessBoard=[];
var over=false;
var steps=[];


var chess=document.getElementById('chess');
var context=chess.getContext('2d');
context.strokeStyle="#BFBFBF";

for(var i=0;i<line_num*line_num;i++){
    chessBoard[i]=0;
}

//methods to win the game

//定义了3维数组，[line_num][line_num][count],数组的顺序没有影响，前2维代表一个 line_num*line_num 的二维空间
var wins=[];
for(var i=0;i<line_num;i++){
    wins[i]=[];
    for(var j=0;j<line_num;j++){
        wins[i][j]=[];
    }
}

var count=0;   //初始化每一种可能
//横向5子情况
for(var i=0;i<line_num;i++){//第几行
    for(var j=0;j<line_num-4;j++){//从该行的第几个开始
        for(var k=0;k<5;k++){//共初始化5个点
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//纵向5子情况
for(var i=0;i<line_num;i++){//第几列
    for(var j=0;j<line_num-4;j++){//从该列的第几个开始
        for(var k=0;k<5;k++){//共初始化5个点
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//左上到右下 斜向5子情况
for(var i=0;i<line_num-4;i++){   //注意点，斜线时也是最大line_num-4
    for(var j=0;j<line_num-4;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//左下到右上 斜向5子情况
for(var i=4;i<line_num;i++){   //注意点，斜线时也是最大line_num-4
    for(var j=0;j<line_num-4;j++){
        for(var k=0;k<5;k++){
            wins[i-k][j+k][count]=true;
        }
        count++;
    }
}

//统计数组
var myWin=[];
var aiWin=[];
for(var i=0;i<count;i++){
    myWin[i]=0;
    aiWin[i]=0;
}

chess.height=line_num*line_width*2;
chess.width=line_num*line_width*2;

var drawChessBoard=function(){
    for(var i=0;i<line_num;i++){
        context.moveTo(line_width,line_width+line_width*2*i);
        context.lineTo(line_num*line_width*2-line_width,line_width+line_width*2*i);
        context.moveTo(line_width+line_width*2*i,line_width);
        context.lineTo(line_width+line_width*2*i,line_num*line_width*2-line_width);
    }
    context.stroke();
}

drawChessBoard();


var step_num=0;
var oneStep=function(i,j,me){

    steps.push(line_num*i+j);

    context.beginPath();
    context.arc(line_width+line_width*2*j ,line_width+line_width*2*i,line_width*0.8,0,2*Math.PI);
    context.closePath();
    var gradient=context.createRadialGradient(line_width+j*line_width*2+line_width*0.2,line_width+i*line_width*2-line_width*0.2,line_width*0.8,line_width+j*line_width*2+2,line_width+i*line_width*2-2,0);
    if(me){
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle=gradient;
    context.fill();
    
    context.fillStyle="#E63472";	
    context.textBaseline="top";
    context.textAlign='center';
    context.textBaseline='middle'
    context.font="15px Arial";
    step_num+=1;
    context.fillText(step_num,line_width+line_width*2*j ,line_width+line_width*2*i);
}

chess.onclick=function(e){
    if(over){
        return;
    }
    var x=e.offsetX;
    var y=e.offsetY;
    var j=Math.floor(x/(line_width*2));
    var i=Math.floor(y/(line_width*2));
    if(chessBoard[line_num*i+j]==0){//棋盘为空时才允许落子
        if(me){//黑子先行
            oneStep(i,j,me);
            me=!me;
            chessBoard[line_num*i+j]=2;
            for(var k=0;k<count;k++){
                if(wins[i][j][k]){
                    myWin[k]++;
                    aiWin[k]=6;  //异常值
                    if(myWin[k]>6){
                        myWin[k]=6;
                    }
                    //判断输赢
                    if(myWin[k]==5){
                        window.alert("You got it!");
                        window.location.href="https://wrx331.github.io/love.html";
                        over=true;
                    }
                }
            }
        }
        if(!over){
            ComputerAi();
        }
    }
}

var MyMax=0;

var ComputerAi=function(){
    var myScore=[];
    var ComputerScore=[];
    for(var i=0;i<line_num*line_num;i++){
        myScore[i]=0;
        ComputerScore[i]=0;
    }

 
    var maxscore=0;
    var posi=0;
    var posj=0;

    for(var i=0;i<line_num;i++){
        for(var j=0;j<line_num;j++){
            //为0时代表可以落子，然后计算每个点对于双方的权重（分数）
            if(chessBoard[line_num*i+j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[line_num*i+j]+=10;
                        }
                        if(myWin[k]==2){
                            myScore[line_num*i+j]+=20;
                        }
                        if(myWin[k]==3){
                            myScore[line_num*i+j]+=100;
                        }
                        if(myWin[k]==4){
                            myScore[line_num*i+j]+=400;
                        }
                        if(aiWin[k]==1){
                            ComputerScore[line_num*i+j]+=15;
                        }
                        if(aiWin[k]==2){
                            ComputerScore[line_num*i+j]+=30;
                        }
                        if(aiWin[k]==3){
                            ComputerScore[line_num*i+j]+=150;
                        }
                        if(aiWin[k]==4){
                            ComputerScore[line_num*i+j]+=600;
                        }

                        var percent=0.8;
                        if(maxscore< myScore[line_num*i+j]*percent+ComputerScore[line_num*i+j]*(1-percent)){
                            maxscore= myScore[line_num*i+j]*percent+ComputerScore[line_num*i+j]*(1-percent)
                            posi=i;
                            posj=j;
                        }
                    }
                }
            }
        }
    }

    oneStep(posi,posj,me);
    me=!me;
    chessBoard[line_num*posi+posj]=1;
    for(var k=0;k<count;k++){
        if(wins[posi][posj][k]){
            aiWin[k]++;
            myWin[k]=6;  //异常值
            if(aiWin[k]>6){
                aiWin[k]=6;
            }
            //判断输赢
            if(aiWin[k]==5){
                window.alert("I win !");
                over=true;
            }
        }
    }

}
