function guideHandler(status , elementID){
    if(status == "true") document.getElementById(elementID).style.display = "none";
    else document.getElementById(elementID).style.display = "flex";
}

const adddedAccount = localStorage.getItem("haveAccount");
guideHandler(adddedAccount, "accountGuide");