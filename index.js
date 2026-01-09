var outBox = document.getElementById("outBox");
var time = document.getElementById("time");
var green = document.getElementById("green");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var inner = document.getElementById("inner");
var btn_status = 0;
var hour = 0;
var min = 0;
var sec = 0;
var curr_time = "";
green.addEventListener("click", ()=>{
    if (btn_status==0){
        yellow.disabled=false;
        outBox.style.backgroundColor = "#00A800";
        green.setAttribute('class', 'btn red');
        btn_status = 1;
        green.innerHTML = "STOP";
        timer = setInterval(()=>{
            curr_time = "";
            sec = sec+1;
            if (hour<10){
                curr_time += "0"+hour+":";
            } else{
                curr_time += hour+":";
            }
            if (min<10){
                curr_time += "0"+min+":";
            } else{
                curr_time += min+":";
            }
            if (sec<10){
                curr_time += "0"+sec;   
            } else{
                curr_time += sec;
            }
            time.innerHTML = curr_time;

            if (sec==59){
                min = min+1;
                sec = 0;
            }

            if (min==60){
                hour = hour+1;
                min = 0;
            }

        },1000)
    }
    else{
        outBox.style.backgroundColor = "#E50000";
        green.setAttribute('class', 'btn green');
        btn_status = 0;
        green.innerHTML = "START";
        clearInterval(timer);
    }
});

yellow.addEventListener("click",()=>{
    inner.innerHTML+= "<br>"+curr_time;
    outBox.style.backgroundColor = "#FFD700";
    setTimeout(()=>{
        outBox.style.backgroundColor = "#00A800";
    },500);
})

red.addEventListener("click",()=>{
    outBox.style.backgroundColor = "#111111";
    sec = min = hour = 0;
    green.setAttribute('class', 'btn green');
    btn_status = 0;
    green.innerHTML = "START";
    clearInterval(timer);
    time.innerHTML = "00:00:00";
    inner.innerHTML = "LAPS"
    yellow.disabled=true;
})