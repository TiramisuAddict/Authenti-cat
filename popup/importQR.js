class Account{
    constructor(label,issuer,secret,algorithm,digits){
        this.label = label;
        this.issuer = issuer;
        this.secret = secret;
        this.algorithm = algorithm;
        this.digits = digits;
    }
}

function extractDataFromQRCode(qrData) {
    const url = new URL(qrData);

    const label = url.pathname;

    const issuer = url.searchParams.get("issuer");
    const secret = url.searchParams.get("secret");

    var algorithm = url.searchParams.get("algorithm");
    if(!algorithm){
      var algorithm = 'SHA1';
    }

    var digits = url.searchParams.get("digits");
    if(!digits){
      var digits = 6;
    }

    return new Account(label,issuer,secret,algorithm,digits);
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

function saveAccountData(accountData){
  var list = localStorage.getItem('accountsList');
  list = JSON.parse(list);
  list.push(accountData);
  localStorage.setItem('accountsList',JSON.stringify(list));
}

if(localStorage.getItem('accountsList') == null){
  var accountsList = [];
  localStorage.setItem('accountsList',JSON.stringify(accountsList));
}

document.getElementById('scanQRButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('qrCodeInput');
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please upload a QR code image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData
    }); 
  
    const result = await response.json();
  
    if (result[0] && result[0].symbol[0].data) {

      //QR code data
      const qrData = result[0].symbol[0].data;

      //Get clean data from QR code
      const newAccountData = extractDataFromQRCode(qrData);

      if(newAccountData.secret){

          saveAccountData(newAccountData);

          window.close();
      }else{
          console.log("Failed to extract secret key from QR code");
      }
    } else {
      alert("Failed to decode the QR code.");
    }
});
