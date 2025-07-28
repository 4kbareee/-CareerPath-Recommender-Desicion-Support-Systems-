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


     const inputNama = document.getElementById('inputNama');
     const inputPassword = document.getElementById('inputPassword');

     inputNama.value = localStorage.getItem('username');
     inputPassword.value = localStorage.getItem('password');
});


const formLogin = document.getElementById('formLogin');


formLogin.addEventListener('submit', async (event) =>{
    event.preventDefault();

    const inputNama = document.getElementById('inputNama').value;
    const inputPassword = document.getElementById('inputPassword').value; 

    localStorage.setItem('username', inputNama);
    localStorage.setItem('password', inputPassword);
    
    console.log(inputPassword);

    const dataLoginUser = {
        username: inputNama,
        password: inputPassword,
    };

    LoginUser(dataLoginUser);
});

const LoginUser = (dataLoginUser) =>{
    fetch('http://localhost:3000/api/loginUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLoginUser)
    })
    .then(response => response.json())
    .then(responseJson => {
        console.log(responseJson.message);

        if(responseJson.message === 'Login berhasil' && dataLoginUser.username === 'admin' ){
            
            console.log('Selamat Datang');
            sessionStorage.setItem('username', dataLoginUser.username);
            Swal.fire({
                title: "Selamat Datang di Aplikasi Profile Matching",
                text: "Login Berhasil Sebagai Admin",
                icon: "success"
            });

            setTimeout(() =>{
            window.location.href = '../html/dashboardAdmin.html';
        }, 1500)
        }
         if(responseJson.message === 'Login berhasil' && dataLoginUser.username !== 'admin'){
            console.log('Selamat Datang');

            sessionStorage.setItem('username', dataLoginUser.username);

            Swal.fire({
                title: "Selamat Datang di Aplikasi Profile Matching",
                text: "Login Berhasil Sebagai User",
                icon: "success"
            });

            setTimeout(() =>{
            window.location.href = '../html/dashboardAdmin.html';
        }, 1500)
        }
        else if(responseJson.message === 'Login gagal, pastikan Username dan Password benar'){
            console.log('tampilkan notif error');
            Swal.fire({
                title: "Login Gagal",
                text: "Pastikan Username dan Password benar",
                icon: "error"
            });
        };
    })
    .catch(error => {
        console.log('gagal login' + error);
    });
};