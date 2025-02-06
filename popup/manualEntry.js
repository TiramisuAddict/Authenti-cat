class Account{
    constructor(label,issuer,secret,algorithm,digits,period){
        this.label = label;
        this.issuer = issuer;
        this.secret = secret;
        this.algorithm = algorithm;
        this.digits = digits;
        this.period = period;
    }
}

const showButton = document.getElementById('showAdvanced');

showButton.addEventListener('click',function(){
    if (document.getElementById("advancedToggle").style.display == "none") {
        
        showButton.value = "Hide";
        document.getElementById("advancedToggle").style.display = "block";
    }else{
        showButton.value = "Show";
        document.getElementById("advancedToggle").style.display = "none";
    }
});

function saveAccountData(accountData){
    var list = localStorage.getItem('accountsList');
    list = JSON.parse(list);
    list.push(accountData);
    localStorage.setItem('accountsList',JSON.stringify(list));
}

function getDataFromForm(){ // label,issuer,secret,algorithm,digits
    const issuer = document.getElementById('issuer').value;
    const secret = document.getElementById('secret').value;
    const useName = document.getElementById('useName').value;
    const period = document.getElementById('period').value;
    const digits = document.getElementById('digits').value;
    const algorithm = document.getElementById('algorithm').value;

    saveAccountData(new Account(useName,issuer,secret,algorithm,digits,period));
}

document.querySelector('form').addEventListener('submit',getDataFromForm);