document.addEventListener('DOMContentLoaded', () => {

    VANTA.NET({
        el: "#animate-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xffffff,
        backgroundColor: 0x4983f5,
        points: 19.00
    })
});

const formRegister = document.getElementById('formRegister');

formRegister.addEventListener('submit', async (event) => {
  event.preventDefault();

  const inputNama = document.getElementById('inputNama').value;
  const inputEmail = document.getElementById('inputEmail').value;
  const inputPassword = document.getElementById('inputPassword').value;

    // Hash password
    const msgUint8 = new TextEncoder().encode(inputPassword); // Mengubah string menjadi array byte
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // Hash password menggunakan SHA-256
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer ke byte array
    const hashPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert byte array ke string hex
    console.log(hashPassword); // Print hash password
    // hash password end

    const dataRegistrasiUser = {
      nama: inputNama,
      email: inputEmail,
      password: hashPassword,
    };

    insertData(dataRegistrasiUser);
});

const insertData = (dataRegistrasiUser) => {
  fetch('http://localhost:3000/api/registrasiUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataRegistrasiUser)
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log('berhasil insert data' + responseJson);

      Swal.fire({
        title: "Berhasil Registrasi",
        icon: "success"
      });

      setTimeout(() =>{
        window.location.href = '../html/index.html';
      }, 1500)
 
    })
    .catch(error => {
      console.log('gagal insert data' + error);
    });

};