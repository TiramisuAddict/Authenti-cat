const secret = '';

class URLData{
    constructor(serciveName,secret,issuer){
        this.serciveName = serciveName;
        this.secret = secret;
        this.issuer = issuer;
    }
}

function extractDataFromQRCode(qrData) {
    const url = new URL(qrData);
    const serciveName = url.pathname;
    const secret = url.searchParams.get("secret");
    const issuer = url.searchParams.get("issuer");
    return new URLData(serciveName,secret,issuer);
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
      const qrData = result[0].symbol[0].data;
      console.log("QR Code Data:", qrData);
        const secretData = extractDataFromQRCode(qrData);
        if(secretData.secret){
            console.log(secretData.serciveName);
            console.log(secretData.secret);
            console.log(secretData.issuer);

            //Generate TOTP token
            
            const totp = new OTPAuth.TOTP({
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: secretData.secret,
            })

            const token = totp.generate();
            console.log("Current token:", token);
            localStorage.setItem("secretID",token);
        }else{
            console.log("Failed to extract secret key from QR code");
        }
    } else {
      alert("Failed to decode the QR code.");
      //window.close();
    }
  });
  