localStorage.setItem("userIsSafe",true); //Temporary line

const adddedAccount = localStorage.getItem("haveAccount");
const havePassword = localStorage.getItem("userIsSafe");

if(havePassword == "true" && adddedAccount == "true"){
    localStorage.setItem("userGuided",true);
}else{
    localStorage.setItem("userGuided",false);
}

const safeUser = localStorage.getItem("userGuided");

if(safeUser === "true"){
    document.getElementById("userGuide").style.display = "none";
}else{
    document.getElementById("userGuide").style.display = "flex";
}