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
    return totp;
}

function updateTimer(){
    const timer = document.getElementsByClassName('timer');

    const current_time = Math.floor(new Date().getTime()/1000);
    const interval_counter = Math.floor(current_time/30);
    const interval_time_start = interval_counter * 30;
    const interval_time_end = interval_time_start + 30;
    const token_expiration_time = interval_time_end - current_time;

    for (var i = 0; i < timer.length; i++){
        timer[i].innerHTML = token_expiration_time+"s";
    }
}

function createCard(){
    const container = document.getElementById('coolCards');
    for (var i = 0; i < accountsList.length; i++){
        const card = document.createElement("div");
        card.className = "card-body";
        
        const content = `
            <div class="card" id="card${i}">
    
                <table border="0">
                    <tr>
                        <td id="issuer">${accountsList[i].label.substr(7,accountsList[i].label.length)}</td>
                        <td rowspan="2" class="timer">${token_expiration_time}s</td>
                        <td rowspan="2">
                            <button id="deleteBtn${i}"> <img id="trashIcon" src="/Ui_Elements/Homepage/trash.svg"> </button>
                        </td>
                    </tr>
    
                    <tr>
                        <td id="secret">${generateTOTP(accountsList[i]).generate()}</td>
                    </tr>
                </table>
                
            </div>
            `;
        
        container.innerHTML += content;
    }
}

function deleteCard(cardID){
    document.getElementById(cardID).remove();
}

//Initial time Calculations

const current_time = Math.floor(new Date().getTime()/1000);
const interval_counter = Math.floor(current_time/30);
const interval_time_start = interval_counter * 30;
const interval_time_end = interval_time_start + 30;
const token_expiration_time = interval_time_end - current_time;

const accountsList = loadAccountsList();
if(accountsList.length != 0){
    document.addEventListener('DOMContentLoaded',createCard);
}

document.addEventListener('DOMContentLoaded', function() {
    for (var i=0;i<accountsList.length;i++){
        (function(i){
            const deleteButton = document.getElementById(`deleteBtn${i}`);
            if(deleteButton){
                deleteButton.addEventListener('click',function(){
                    deleteCard(`card${i}`);
                });
            }
        })(i);
    }
});

setInterval(updateTimer,1);