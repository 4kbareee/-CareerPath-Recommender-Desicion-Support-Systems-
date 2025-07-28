document.addEventListener('DOMContentLoaded', () => {
    const kodeTable = sessionStorage.getItem('kode');
    const keteranganTable = sessionStorage.getItem('keterangan');
    const jenisTable = sessionStorage.getItem('jenis');
    console.log(kodeTable)
    console.log(keteranganTable);
    console.log(jenisTable);
    
    const inputKodeKriteria = document.getElementById('inputKodeKriteria');
    const inputKeterangan = document.getElementById('inputKeterangan'); 
    const inputJenis = document.getElementById('inputJenis');
    
    inputKodeKriteria.value = kodeTable;
    inputKeterangan.value = keteranganTable;
    inputJenis.value = jenisTable;
})

const id = sessionStorage.getItem('id');
console.log(id);

const formUpdateKriteria = document.getElementById('formUpdateKriteria');

formUpdateKriteria.addEventListener('submit', (event) =>{
    event.preventDefault();
    const inputKodeKriteria = document.getElementById('inputKodeKriteria');
    const inputKeterangan = document.getElementById('inputKeterangan'); 
    const inputJenis = document.getElementById('inputJenis');

    const dataKriteria = {
        kode: inputKodeKriteria.value,
        keterangan: inputKeterangan.value,
        jenis: inputJenis.value
    };

    updateKriteria(dataKriteria);
});

const updateKriteria = (dataKriteria) =>{
    const id = sessionStorage.getItem('id');

    fetch(`http://localhost:3000/api/updateKriteria/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataKriteria)
    })
    .then(response => {
        sessionStorage.setItem('responStatus', response.status);

        return response.json();
    })
    .then(responseJson =>{
        const responStatus = parseInt(sessionStorage.getItem('responStatus'));

        if (responStatus !== 200) {
            Swal.fire({
                icon: "error",
                title: "Kriteria Tidak Boleh Duplikat",
            });
            return;
        }


        console.log('berhasil update data kriteria' + responseJson);

        Swal.fire({
            title: "Berhasil Update Kriteria",
            icon: "success"
        });

        setTimeout(() =>{
            window.location.href = '../html/Kriteria.html';
        }, 1500)
    })
};



