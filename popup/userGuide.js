function guideHandler(status , elementID){
    if(status == "true") document.getElementById(elementID).style.display = "none";
    else document.getElementById(elementID).style.display = "flex";
}

const havePassword = localStorage.getItem("userIsSafe");
guideHandler(havePassword, "securityGuide");

const adddedAccount = localStorage.getItem("haveAccount");
guideHandler(adddedAccount, "accountGuide");