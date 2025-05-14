ga = [];
function getApi(id,action,values) { 
	if(!values) values="?tm"+Math.random();
	else values=values+"&tm"+Math.random();
	pass = document.getElementById("password").value;
	if(pass != ""){
		document.getElementById(id).innerHTML="";
		values = values + "&pass=" + pass;
		if (window.XMLHttpRequest) { ga[id]=new XMLHttpRequest(); }
		else { ga[id]=new ActiveXObject("Microsoft.XMLHTTP"); }
		ga[id].onreadystatechange=function() {
			if (ga[id].readyState==4 && ga[id].status==200) {
				var result=ga[id].responseText;		
				var values=JSON.parse(result);	
				if(!values.error){
					if(values.html) {
						document.getElementById(id).innerHTML=values.html;
					}
					if(values.cmd){
						for(var c=0;c<values.cmd.length;c++){
							console.log("Eval: "+values.cmd[c]);
							eval(values.cmd[c]);
						}
					}
					
				}
				else{
					document.getElementById(id).innerHTML=values.error;
				}	
			}
		}
		ga[id].open("GET",action+values,true);
		ga[id].send();	
	
	}
	else {
		document.getElementById(id).innerHTML="Password can't be empty"
	}		
}

function geStats(id) { 
	if (window.XMLHttpRequest) { gStats=new XMLHttpRequest(); }
	else { gStats=new ActiveXObject("Microsoft.XMLHTTP"); }
	gStats.onreadystatechange=function() {
		if (gStats.readyState==4 && gStats.status==200) {
			var result=gStats.responseText;		
			var values=JSON.parse(result);	
			if(!values.error){
				document.getElementById("statsCPUSpeed").innerHTML=values.cpuspeed;
				document.getElementById("statsCPUTemp").innerHTML=values.cputemp;
				document.getElementById("statsRAMFree").innerHTML=values.ramfree;
				document.getElementById("statsRAMTotal").innerHTML=values.ramtotal;
				document.getElementById("statsSYSLoad").innerHTML=values.load;
				document.getElementById("statsSYSUptime").innerHTML=values.uptime;
				document.getElementById("statsSYSIP").innerHTML=values.ip;
                                document.getElementById("statsWIFI").innerHTML=values.wifi;
			}
			else{
				document.getElementById(id).innerHTML=values.error;
			}	
			//setTimeout("geStats('output')",10000);
		}
	}
	gStats.open("GET","stats.json?"+Math.random(),true);
	gStats.send();	
}

geStats('output')

// Update the count down timer and also the stats
var timeLeft = 5;
var timerId = setInterval(countdown, 1000);
function countdown() {
 	var elem = document.getElementById('timer');
        var pulseBox = document.getElementById('stats');
	function sleep (time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

    // Do something after the sleep!
	if (timeLeft == 0) {
		elem.innerHTML = timeLeft;
		timeLeft = '5'
		geStats('output')
		pulseBox.classList.add("animate");
		sleep(500).then(() => {
			pulseBox.classList.remove("animate");
		});
	} else {
		elem.innerHTML = timeLeft;
		timeLeft--;
	}
}
