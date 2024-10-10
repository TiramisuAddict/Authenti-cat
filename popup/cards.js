function loadAccountsList(){
    var list = localStorage.getItem('accountsList');
    if (list === null) {
        return [];
    }
    return JSON.parse(list);
}

function generateTOTP(accountData){
    const totp = new OTPAuth.TOTP({
      algorithm: accountData.algorithm,
      digits: accountData.digits,
      secret: accountData.secret,
      period: 30
    });
    return totp.generate();
}

function getQuickTime(){
    return (( (Math.floor((Math.floor(new Date().getTime()/1000.0))/30)) * 30) + 30) - (Math.floor(new Date().getTime()/1000.0));
}

function TOTP_Timer(time_difference){
    const local_Time = Math.floor(new Date().getTime()/1000.0);
    const time_counter = Math.floor((local_Time - time_difference)/30);

    const timerConst = document.getElementsByClassName('timer');
    for (let i = 0; i < timerConst.length; i++){
        timerConst[i].innerHTML = ((time_counter * 30) + 30) - local_Time;
    }
}

async function calculate_time_drift(){
    const response = await fetch('http://worldtimeapi.org/api/ip', {
        method: 'GET',
    });
    
    const result = await response.json();
    let timeDiff = result.unixtime - Math.floor(new Date().getTime()/1000.0);
    console.log("Time Difference:",timeDiff);

    if(timeDiff === -1){
        return 0;
    }else{
        return timeDiff;
    }
}

function showSnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", "hide"); }, 3000);
}

//=======================================================================================================//

localStorage.setItem("userIsSafe",false); //Temporary line

localStorage.setItem("haveAccount",true);
var accountsList = loadAccountsList();

if(accountsList.length != 0){
    localStorage.setItem("userIsSafe",true); //overlay
    document.addEventListener('DOMContentLoaded',async function() {
        const container = document.getElementById('cardContainer');
        for (var i = 0; i < accountsList.length; i++){
            const card = document.createElement("div");
            card.className = "card-body";
            
            const content = `
                <div class="card" id="card${i}">
        
                    <table border="0">
                        <tr>
                            <td id="issuer" colspan="3"> ${accountsList[i].issuer +" : "+accountsList[i].label.substr(accountsList[i].label.indexOf(":")+1,accountsList[i].label.length)}</td>
                        </tr>

                        <tr">
                            <td width="170px"> <div id="token${i}" class="tokens"> ${generateTOTP(accountsList[i])} </div> </td>
                            <td width="35px"> <div class="timer">${getQuickTime()}</div> </td>
                            <td>
                                <button class="delBtn" id="deleteBtn${i}"> <img id="trashIcon" src="/Ui_Elements/Homepage/trash.svg"> </button>
                            </td>
                        </tr>

                    </table>
                    
                </div>
                `;
            
            container.innerHTML += content;
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        for (let i = 0; i < accountsList.length; i++) {
            (function(i) {
                const deleteButton = document.getElementById(`deleteBtn${i}`);
                if (deleteButton) {
                    deleteButton.addEventListener('click', function() {
                        document.getElementById(`card${i}`).remove();
                        accountsList.splice(i, 1);
                        localStorage.setItem('accountsList', JSON.stringify(accountsList));
                    });
                }
            })(i);
        }
    });

    calculate_time_drift().then(gap => {
        document.addEventListener('DOMContentLoaded', () => TOTP_Timer(gap));
        setInterval(function() {
            TOTP_Timer(gap);
        }, 1000);
    });

    setInterval(function() {
        for (let i = 0; i < accountsList.length; i++) {
            document.getElementById(`token${i}`).innerHTML = generateTOTP(accountsList[i]);
        }
    }, 1000);

    document.addEventListener("DOMContentLoaded",function(){
        for(let i = 0; i<accountsList.length ; i++){
            document.getElementById(`token${i}`).addEventListener("click",function(){
                const token = generateTOTP(accountsList[i]);
                navigator.clipboard.writeText(token.toString());
                console.log("Token copied");
                showSnackbar();
            });
        }
    });
    
}else{
    localStorage.setItem("haveAccount",false);
}