document.addEventListener('DOMContentLoaded', () => {
    renderTampilan();
});


const posisiPekerjaan = sessionStorage.getItem('posisiPekerjaan');
const kodeKriteria = sessionStorage.getItem('kodeKriteria');
const nilaiProfilIdeal = sessionStorage.getItem('nilaiProfilIdeal');
const id = sessionStorage.getItem('id');
console.log(id);

const keterangan = document.getElementById('keterangan');
keterangan.innerHTML = `<b>*Nilai Profil Ideal Sebelumnya</b><br>
                        Posisi Pekerjaan: <b>${posisiPekerjaan}</b><br> 
                        Kode Kriteria: <b>${kodeKriteria} </b><br>
                        Nilai Profil Ideal: <b>${nilaiProfilIdeal}</b>`;

const containerselectNamaProfilIdeal = document.querySelector('.containerSelectNamaProfilIdeal');
const containerSelectKriteria = document.querySelector('.containerSelectKriteria');

const renderTampilan = () =>{
fetch('http://localhost:3000/api/readPosisiPekerjaan', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        let selectHTML = `
        <select name="" id="inputNamaProfilIdeal" class="form-select" required>
            <option value="">=== Pilih Posisi Pekerjaan ===</option>
    `;

        data.forEach(item => {
            selectHTML += `<option value="${item.id_alternatif}">${item.posisi_pekerjaan}</option>`;
        });

        selectHTML += `</select>`;

        containerselectNamaProfilIdeal.innerHTML = selectHTML;

        fetch('http://localhost:3000/api/readKriteria', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(datakriteria => {
                let selectHTMLKriteria = `
                    <select name="" id="inputKriteria" class="form-select" required>
                    <option value="">=== Masukan Kriteria ===</option>
                `;

                datakriteria.forEach(itemKriteria => {
                    selectHTMLKriteria += `<option value="${itemKriteria.id_kriteria}">${itemKriteria.kode}</option>`;
                });

                selectHTMLKriteria += `</select>`;

                containerSelectKriteria.innerHTML = selectHTMLKriteria;
            });

        const formUpdateProfilIdeal = document.getElementById('formUpdateProfilIdeal');
        formUpdateProfilIdeal.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputNamaProfilIdeal = document.getElementById('inputNamaProfilIdeal');
            const inputNamaProfilIdealValue = inputNamaProfilIdeal.value;
            const inputKriteria = document.getElementById('inputKriteria');
            const inputKriteriaValue = inputKriteria.value;
            const nilaiSkor = document.getElementById('inputNilai');
            const nilaiSkorValue = nilaiSkor.value

            updateProfilIdeal(id, nilaiSkorValue, inputNamaProfilIdealValue, inputKriteriaValue);
        });
    });
};


const updateProfilIdeal = (id, nilaiSkorValue, inputNamaProfilIdealValue, inputKriteriaValue) => {
        const inputNilai = document.getElementById('inputNilai');

        const dataNilaiProfilIdeal = {
            id_alternatif: inputNamaProfilIdealValue,
            id_kriteria: inputKriteriaValue,
            nilai_profil_ideal: nilaiSkorValue
        };

        console.log(dataNilaiProfilIdeal);

        fetch(`http://localhost:3000/api/updateNilaiProfilIdeal/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataNilaiProfilIdeal)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                Swal.fire({
                    title: "Berhasil Update Kriteria",
                    icon: "success"
                });
                setTimeout(() =>{
                    window.location.href = '../html/AlternatifProfilIdeal.html';
                }, 1500);
            });
}