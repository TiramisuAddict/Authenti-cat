function loadAccountsList(){
    var list = localStorage.getItem('accountsList');
    if (list === null) {
        return [];
    }
    return JSON.parse(list);
}

function periodsList(){
    pList = [];
    for (var i = 0; i < accountsList.length; i++)
        pList.push(accountsList[i].period);
    return pList;
}

function generateTOTP(accountData){
    const totp = new OTPAuth.TOTP({
      algorithm: accountData.algorithm,
      digits: accountData.digits,
      secret: accountData.secret,
      period: accountData.period
    });
    return totp.generate();
}

function showSnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", "hide"); }, 3000);
}

function getIntervalRemaining(interval) {
    const now = Math.floor(Date.now() / 1000);
    return interval - (now % interval);
}

function startCountdown(intervals) {
    const counters = document.querySelectorAll('.counter');

    counters.forEach((counter, index) => {
        const interval = intervals[index];

        function updateCountdown() {
        const remaining = getIntervalRemaining(interval);
        counter.textContent = remaining;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

//=======================================================================================================//

var accountsList = loadAccountsList();
var pList = periodsList();
console.log(accountsList);
console.log(pList);
if(accountsList.length != 0){
    localStorage.setItem("haveAccount",true); //overlay
    document.addEventListener('DOMContentLoaded',async function() {
        const container = document.getElementById('cardContainer');
        for (var i = 0; i < accountsList.length; i++){
            const card = document.createElement("div");
            card.className = "card-body";

            /*html*/
            const content = `
                <div class="card" id="card${i}">
                    <table>
                        <tr>
                            <td id="issuer" colspan="3"> ${accountsList[i].issuer +" : "+accountsList[i].label.substr(accountsList[i].label.indexOf(":")+1,accountsList[i].label.length)}</td>
                        </tr>

                        <tr>
                            <td width="170px"> <div id="token${i}" class="tokens"> ${generateTOTP(accountsList[i])} </div> </td>
                            <td width="35px"> <div class="counter"></div> </td>
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
            startCountdown(pList); //start All the countdowns
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
    
} else{
    localStorage.setItem("haveAccount",false);
}