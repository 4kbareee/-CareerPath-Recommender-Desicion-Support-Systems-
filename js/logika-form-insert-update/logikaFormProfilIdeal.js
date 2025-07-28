// console.log('tes')
const btnLanjut = document.querySelector('.btn-lanjut');
const btnSimpan = document.querySelector('.btn-simpan');
const containerInputPosisiKerja = document.getElementById('containerInputPosisiKerja');


document.addEventListener('DOMContentLoaded', () =>{
    renderPosisiKerja();

    btnSimpan.style.display = 'none';
});


const renderPosisiKerja = () => {
    fetch('http://localhost:3000/api/readPosisiPekerjaan')
        .then(response => response.json())
        .then(data => {
            console.log("Data diterima:", data);

            // Kosongkan dulu isi container agar tidak duplikat
            containerInputPosisiKerja.innerHTML = '';

            // Buat elemen select satu kali
            const selectElement = document.createElement('select');
            selectElement.setAttribute('id', 'inputPosisiPekerjaan');
            selectElement.setAttribute('class', 'form-select');
            selectElement.required = true;
            
            // Tambahkan opsi default
            selectElement.innerHTML = `<option value="">=== PILIH POSISI KERJA ===</option>`;

            // Loop untuk menambahkan opsi posisi pekerjaan
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id_alternatif;
                option.textContent = item.posisi_pekerjaan;
                selectElement.appendChild(option);
            });

            // Tambahkan dropdown ke dalam container
            containerInputPosisiKerja.appendChild(selectElement);

            const btnLanjut = document.querySelector('.btn-lanjut');

            btnLanjut.addEventListener('click', () => {
                // console.log('tes');
                btnSimpan.style.display = 'block';
                btnLanjut.style.display = 'none';
                
                const inputPosisiPekerjaan = document.getElementById('inputPosisiPekerjaan');
                const idPosisiPekerjaan = inputPosisiPekerjaan.value;
                console.log(idPosisiPekerjaan);

                renderInputNilai(idPosisiPekerjaan);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
};


const renderInputNilai = (idPosisiPekerjaan) => {
    console.log('ini function '+ idPosisiPekerjaan);

    fetch('http://localhost:3000/api/readKriteria')   
    .then(response => response.json())
    .then(data => {
        const containerInputNilaiKriteria = document.getElementById('containerInputNilaiKriteria');
        containerInputNilaiKriteria.innerHTML = ''; // Kosongkan sebelum menambahkan elemen baru

        data.forEach(kriteria => {
            const div = document.createElement('div');
            div.innerHTML = `
                <label class="form-label">${kriteria.kode} - ${kriteria.keterangan}</label>
                <select class="form-select mb-5" id="nilaiProfilIdeal" required>
                    <option value="">=== PILIH SKOR ===</option>
                    <option value="1">1 - Tidak Wajib</option>
                    <option value="2">2 - Rendah</option>
                    <option value="3">3 - Sedang</option>
                    <option value="4">4 - Wajib</option>
                    <option value="5">5 - Sangat Wajib</option>
                </select>
            `;
            containerInputNilaiKriteria.appendChild(div);
        });

        const formInputAlternatifProfiIdeal = document.getElementById('formInputAlternatifProfiIdeal')
        formInputAlternatifProfiIdeal.addEventListener('submit', (ev) =>{
            ev.preventDefault();
            const dropdownNilai = document.querySelectorAll('#nilaiProfilIdeal');
            const listNilaiProfilideal = [];

            dropdownNilai.forEach((select, index) => {
                const objDatanilaiProfilIdeal = {
                    id_alternatif: idPosisiPekerjaan,
                    id_kriteria: data[index].id_kriteria, // Ambil id_kriteria sesuai urutan
                    nilai_profil_ideal: select.value, // Ambil nilai dari dropdown
                };
        
                listNilaiProfilideal.push(objDatanilaiProfilIdeal);
            });
        
            console.log(listNilaiProfilideal);
            insertNilaiProfilIdeal(listNilaiProfilideal);
        });
    })
    .catch(error => console.error("Error fetching kriteria:", error));
};

const insertNilaiProfilIdeal = (listNilaiProfilideal) =>{
    fetch('http://localhost:3000/api/insertNilaiProfilIdeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(listNilaiProfilideal),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data berhasil disimpan:', data);
        alert('Data berhasil disimpan');
        window.location.href = '../html/AlternatifProfilIdeal.html';
    })
    .catch(error => console.error('Error:', error));
};
