function guideHandler(status , elementID){
    if(status == "true") document.getElementById(elementID).style.display = "none";
    else document.getElementById(elementID).style.display = "flex";
}

const adddedAccount = localStorage.getItem("haveAccount");
guideHandler(adddedAccount, "accountGuide");

//===============================================================

const toggle = document.getElementById("toggle");

toggle.addEventListener('change', function() {
    if (toggle.checked) {
        document.getElementById("blur-filter").style.display = "flex";
        document.body.style.overflow = "hidden";
    } else {
        document.getElementById("blur-filter").style.display = "none";
        document.body.style.overflow = "auto";
    }
});
