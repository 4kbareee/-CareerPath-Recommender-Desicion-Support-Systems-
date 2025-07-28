const forminputkriteria = document.getElementById('formInputKriteria');

forminputkriteria.addEventListener('submit', (event) =>{
    event.preventDefault();

    const inputkodeKriteria = document.getElementById('inputKodeKriteria');
    const inputKeterangan = document.getElementById('inputKeterangan');
    const inputJenis = document.getElementById('inputJenis');

    const dataKriteria = {
        kode: inputkodeKriteria.value,
        keterangan: inputKeterangan.value,
        jenis: inputJenis.value
    };
    

    insertKriteria(dataKriteria);
});

const insertKriteria = (dataKriteria) =>{
    fetch('http://localhost:3000/api/insertKriteria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataKriteria)
    })
    .then(response => {
        console.log(response.status);

        sessionStorage.setItem('responStatus', response.status);
        return response.json();
    })
    .then(responseJson =>{
        const responStatus = parseInt(sessionStorage.getItem('responStatus'));

        if(responStatus !== 200 ){
            console.log('error');
            Swal.fire({
                icon: "error",
                title: "Kriteria Tidak Boleh Duplikat",
            });

            return;
        }

            console.log('berhasil insert data kriteria' + responseJson);
    
            Swal.fire({
                title: "Berhasil Menambahkan Kriteria",
                icon: "success"
            });
    
            setTimeout(() =>{
                window.location.href = '../html/Kriteria.html';
            }, 1500)
        
    })
};