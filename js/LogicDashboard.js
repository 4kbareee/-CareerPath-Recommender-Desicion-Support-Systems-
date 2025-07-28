const user = sessionStorage.getItem('username');

const nama = document.querySelector('.nama');

nama.innerHTML = user;


const jumlahKriteria = document.getElementById('jumlahKriteria');
const jumlahRekomendasi = document.getElementById('jumlahRekomendasi');
const bobotCF = document.getElementById('bobotCF');
const bobotSF = document.getElementById('bobotSF');
const jumlahAlternatif = document.getElementById('jumlahAlternatif');

function getJumlahKriteria() {
    fetch('http://localhost:3000/api/jumlahKriteria', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        jumlahKriteria.innerHTML = data[0].jumlah_kriteria;
    });
};

function getJumlahRekomendasi() {
    fetch('http://localhost:3000/api/jumlahRekomendasi', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        jumlahRekomendasi.innerHTML = data[0].jumlah_rekomendasi;
    });
};

function getBobotCF() {
    fetch('http://localhost:3000/api/getBobotCF', {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data =>{
        bobotCF.innerHTML = data[0].bobot * 100 + '%';
    })
};

function getBobotSF() {
    fetch('http://localhost:3000/api/getBobotSF', {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data =>{
        bobotSF.innerHTML = data[0].bobot * 100 + '%';
    })
};

function getJumlahAlternatif(){
    fetch('http://localhost:3000/api/jumlahAlternatif', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        jumlahAlternatif.innerHTML = data[0].jumlah_posisi_pekerjaan;
    });
}



// eksekusi function
getJumlahKriteria();
getJumlahRekomendasi();
getBobotCF();
getBobotSF();
getJumlahAlternatif();
