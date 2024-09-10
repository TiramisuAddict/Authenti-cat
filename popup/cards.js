document.getElementById('aa').addEventListener('click', createCard);
document.addEventListener('DOMContentLoaded',createCard);

console.log(localStorage.getItem('secretID'));
function createCard(){
    const container = document.getElementById('coolCards');

    const card = document.createElement("div");
    card.className = "card-body";
    
    const content = `
        <div class="card">

            <table border="0">
                <tr>
                    <td id="issuer">Github : TiramissuAddict</td>
                    <td rowspan="2" id="timer">30s</td>
                    <td rowspan="2"><img id="trashIcon" src="/Ui_Elements/Homepage/trash.svg"></td>
                </tr>

                <tr>
                    <td id="secret">22525</td>
                </tr>
            </table>
            
        </div>
        `;
    
    container.innerHTML += content;

}