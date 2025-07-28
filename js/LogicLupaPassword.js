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
    });

});

const formLupaPassword = document.getElementById('formLupaPassword');

formLupaPassword.addEventListener('submit', async (event) =>{
    event.preventDefault();

    const email = document.getElementById('inputemail').value;
    const inputpwlama = document.getElementById('inputpwlama').value; 
    const inputpwbaru = document.getElementById('inputpwbaru').value; 

    console.log(email, inputpwlama, inputpwbaru);

    const dataLupaPassword = {
        email: email,
        passwordLama: inputpwlama,
        passwordBaru: inputpwbaru,
    };

    LupaPassword(dataLupaPassword);
});

const LupaPassword = (dataLupaPassword) =>{
    fetch('http://localhost:3000/api/lupaPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLupaPassword)
    })
    .then(response => response.json())
    .then(responseJson => {
        console.log(responseJson.message);

        if(responseJson.message === 'Password berhasil diubah'){
            Swal.fire({
                title: 'Berhasil',
                text: responseJson.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = './index.html';
            });
        } else {
            Swal.fire({
                title: 'Gagal',
                text: responseJson.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}