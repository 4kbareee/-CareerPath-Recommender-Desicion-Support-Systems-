const btnSimpanHasilRekomendasi = document.getElementById("simpanHasilRekomendasi");

const Formperhitungan = document.getElementById("Formperhitunganrekomendasi");
let biodataSiswa = {};

fetch('http://localhost:3000/api/readKriteria', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        renderDataKriteria(data);
        // console.log(data);
    });

const renderDataKriteria = (data) => {
    const container = document.getElementById("kriteria-container");

    data.forEach(kriteria => {
        const div = document.createElement("div");
        div.classList.add("container-kriteria");
        div.classList.add("mb-5");

        const label = document.createElement("label");
        label.classList.add("form-label");
        label.textContent = `${kriteria.kode} - ${kriteria.keterangan}`;

        const select = document.createElement("select");
        select.classList.add("form-select");
        select.required = true;

        const options = [
            { value: "", text: "=== PILIH SKOR ===" },
            { value: "1", text: "1 - Sangat Kurang" },
            { value: "2", text: "2 - Kurang" },
            { value: "3", text: "3 - Sedang" },
            { value: "4", text: "4 - Baik" },
            { value: "5", text: "5 - Sangat Baik" }
        ];

        options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);
    });


    Formperhitungan.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputNamaSiswa = document.getElementById("inputNamaSiswa");
        const inputKelas = document.getElementById("inputKelas");
        const inputJurusan = document.getElementById("inputJurusan");

        biodataSiswa = {
            nama: inputNamaSiswa.value,
            kelas: inputKelas.value,
            jurusan: inputJurusan.value
        };

        const dropdownNilaiSiswa = document.querySelectorAll(".form-select");
        const listNilaiSiswa = [];

        dropdownNilaiSiswa.forEach((select, index) => {
            const nilaiSiswa = {
                id_kriteria: data[index].id_kriteria,
                nilai_siswa: select.value
            };

            listNilaiSiswa.push(nilaiSiswa);
        });

        console.log(listNilaiSiswa);
        sessionStorage.setItem('DataKompetensiSiswa', JSON.stringify(listNilaiSiswa));


        hitungGap(listNilaiSiswa);
    });
};


const hitungGap = (listNilaiSiswa) => {
    fetch('http://localhost:3000/api/readNilaiProfilIdeal', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Data Profil Ideal:", data);

            const listGapPerAlternatif = [];

            // Ambil semua posisi pekerjaan unik dari data
            const posisiPekerjaanUnik = [...new Set(data.map(item => item.posisi_pekerjaan))];

            // Loop setiap posisi pekerjaan (misalnya: Full Stack Developer & Teknisi Jaringan)
            posisiPekerjaanUnik.forEach(posisi => {
                console.log(`\nAlternatif: ${posisi}`);

                const listGap = [];

                // Loop setiap nilai siswa dan cari nilai profil ideal yang sesuai
                listNilaiSiswa.forEach((nilaiSiswa, index) => {
                    const nilaiSiswaNum = parseInt(nilaiSiswa.nilai_siswa);

                    // Cari nilai ideal berdasarkan posisi pekerjaan dan kode kriteria (C1, C2, dst.)
                    const kodeKriteria = `C${index + 1}`;
                    const dataIdeal = data.find(item => item.posisi_pekerjaan === posisi && item.kode === kodeKriteria);
                    const nilaiIdealNum = dataIdeal ? parseInt(dataIdeal.nilai_profil_ideal) : null;

                    if (!isNaN(nilaiSiswaNum) && !isNaN(nilaiIdealNum)) {
                        const gap = nilaiSiswaNum - nilaiIdealNum; // Perhitungan GAP
                        listGap.push(gap);
                        console.log(`${kodeKriteria}: ${nilaiSiswaNum} - ${nilaiIdealNum} = ${gap}`);
                    } else {
                        console.warn(`${kodeKriteria}: Nilai tidak valid!`, nilaiSiswaNum, nilaiIdealNum);
                        listGap.push(NaN);
                    }
                });

                console.log(`GAP untuk ${posisi}:`, listGap);
                listGapPerAlternatif.push({ alternatif: posisi, gap: listGap });
            });

            console.log("GAP untuk semua alternatif:", listGapPerAlternatif);
            sessionStorage.setItem("listGapPerAlternatif", JSON.stringify(listGapPerAlternatif));

            // Lanjutkan ke perhitungan bobot jika diperlukan
            konversiGap(listGapPerAlternatif);
        })
        .catch(error => console.error("Error fetching data:", error));
};



const konversiGap = (listGapPerAlternatif) => {
    const konversiGap = {
        "0": 5,
        "1": 4.5,
        "-1": 4,
        "2": 3.5,
        "-2": 3,
        "3": 2.5,
        "-3": 2,
        "4": 1.5,
        "-4": 1,
        "5": 0
    };

    const listBobotPerAlternatif = listGapPerAlternatif.map(alternatif => {
        const bobot = alternatif.gap.map(gap => konversiGap[gap.toString()] || 0); // Jika gap tidak ditemukan, default ke 0
        return {
            alternatif: alternatif.alternatif,
            bobot: bobot
        };
    });

    console.log("hasil konversi gap:", listBobotPerAlternatif);
    sessionStorage.setItem("konversiGap", JSON.stringify(listBobotPerAlternatif));

    // Lanjutkan ke langkah berikutnya jika diperlukan
    // return listBobotPerAlternatif;

    Ranking(listBobotPerAlternatif);
};



const Ranking = (listBobotPerAlternatif) => {
    fetch('http://localhost:3000/api/readKriteria', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(dataKriteria => {
            // Pisahkan indeks CF dan SF berdasarkan data kriteria dari database
            const CF_index = [];
            const SF_index = [];

            dataKriteria.forEach((kriteria, index) => {
                if (kriteria.jenis === "CF") {
                    CF_index.push(index);
                } else if (kriteria.jenis === "SF") {
                    SF_index.push(index);
                }
            });

            console.log('cf index =', CF_index);
            console.log('sf index =', SF_index);

            const tableDataBobotCFSF = [
                {
                    jenis: "Core Factor",
                    kriteria: CF_index.map(i => `C${i + 1}`).join(' , '),
                    bobot: "60%"
                },
                {
                    jenis: "Secondary Factor",
                    kriteria: SF_index.map(i => `C${i + 1}`).join(' , '),
                    bobot: "40%"
                }
            ];

            sessionStorage.setItem("tableDataBobotCFSF", JSON.stringify(tableDataBobotCFSF));

            fetch('http://localhost:3000/api/readBobotCFSF', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(dataBobotCFSF => {

                    const bobotCF = parseFloat(dataBobotCFSF.find(item => item.keterangan === "Core Factor")?.bobot || 0.6); // Bobot Core Factor
                    const bobotSF = parseFloat(dataBobotCFSF.find(item => item.keterangan === "Secondary Factor")?.bobot || 0.4); // Bobot Secondary Factor

                    let hasilRanking = [];

                    listBobotPerAlternatif.forEach(alternatif => {
                        const bobot = alternatif.bobot;

                        // Ambil 3 nilai pertama dari CF dan SF, jika kurang dari 3 maka tetap pakai yang ada
                        const nilaiCF = CF_index.length >= 8 ?
                            (bobot[CF_index[0]] + bobot[CF_index[1]] + bobot[CF_index[2]] + bobot[CF_index[3]] + bobot[CF_index[4]] + bobot[CF_index[5]] + bobot[CF_index[6]] + (bobot[CF_index[7]] / CF_index.length)) :
                            0;

                        const nilaiSF = SF_index.length >= 3 ?
                            (bobot[SF_index[0]] + bobot[SF_index[1]] + (bobot[SF_index[2]] / SF_index.length)) :
                            0;

                        // Hitung nilai akhir
                        const nilaiRanking = (bobotCF * nilaiCF) + (bobotSF * nilaiSF);

                        hasilRanking.push({
                            alternatif: alternatif.alternatif,
                            NCF: nilaiCF.toFixed(2),
                            NSF: nilaiSF.toFixed(2),
                            Ranking: nilaiRanking.toFixed(2)
                        });
                    });

                    // Urutkan berdasarkan ranking tertinggi
                    hasilRanking.sort((a, b) => b.Ranking - a.Ranking);

                    console.log("Hasil Perhitungan Ranking:", hasilRanking);
                    sessionStorage.setItem('hasilPerhitunganRangking', JSON.stringify(hasilRanking));

                    // Ambil alternatif terbaik (peringkat 1)
                    if (hasilRanking.length > 0) {
                        console.log(`\nPekerjaan yang paling direkomendasikan: ${hasilRanking[0].alternatif} dengan nilai ${hasilRanking[0].Ranking}`);
                        renderTabelHasilRekomendasi(hasilRanking);
                    } else {
                        console.log("Tidak ada data untuk rekomendasi.");
                    }

                })

        })
        .catch(error => console.error("Error fetching data:", error));
};




// logika tabelll
const renderTabelHasilRekomendasi = (hasilRanking) => {

    console.log("biodata siswa :", biodataSiswa.nama, biodataSiswa.kelas, biodataSiswa.jurusan);

    const dataTable = [{
        nama: biodataSiswa.nama,
        kelas: biodataSiswa.kelas,
        jurusan: biodataSiswa.jurusan,
        rekomendasi: hasilRanking[0].alternatif,
        nilai: hasilRanking[0].Ranking,
    }];

    $('#myTable').DataTable({
        data: dataTable,
        columns: [
            { data: 'nama', className: 'text-center' },
            { data: 'kelas', className: 'text-center' },
            { data: 'jurusan', className: 'text-center' },
            { data: 'rekomendasi', className: 'text-center' },
            { data: 'nilai', className: 'text-center' },
            {
                data: null,
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-success btn-sm btn-detail" data-id="${row.id_kriteria}">
                            Detail
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_kriteria}">
                            Delete
                        </button>
                    `;
                }
            }
        ]
    });


    // Fungsi bantu untuk inisialisasi DataTable secara aman
function inisialisasiDataTable(selector, options) {
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().clear().destroy();
    }
    $(selector).DataTable(options);
}

const btnDetailRekomendasi = document.querySelector('.btn-detail');
btnDetailRekomendasi.addEventListener("click", () => {
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();

    // tampil tabel data siswa
    const DataKompetensiSiswa = JSON.parse(sessionStorage.getItem("DataKompetensiSiswa"));

    document.getElementById('theadDataKompetensiSiswa').innerHTML = `
        <tr>
            <th>No</th>
            <th>Kode Kriteria</th>
            <th>Nilai</th>
        </tr>
    `;

    const tbody = document.getElementById('tbodyDataKompetensiSiswa');
    tbody.innerHTML = "";
    DataKompetensiSiswa.forEach((item, index) => {
        const kode = `C${index + 1}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${kode}</td>
            <td>${item.nilai_siswa}</td>
        `;
        tbody.appendChild(row);
    });
    // tampil tabel data siswa end

    // tampil tabel gap per alternatif
    const listGapPerAlternatif = JSON.parse(sessionStorage.getItem("listGapPerAlternatif"));
    const theadGapAlternatif = document.getElementById("theadGapAlternatif");
    const tbodyGapAlternatif = document.getElementById("tbodyGapAlternatif");

    theadGapAlternatif.innerHTML = "";
    tbodyGapAlternatif.innerHTML = "";

    if (listGapPerAlternatif.length > 0) {
        const jumlahGap = listGapPerAlternatif[0].gap.length;
        let headerRow = "<tr><th>Alternatif</th>";

        for (let i = 0; i < jumlahGap; i++) {
            headerRow += `<th>C ${i + 1}</th>`;
        }

        headerRow += "</tr>";
        theadGapAlternatif.innerHTML = headerRow;
    }

    listGapPerAlternatif.forEach((dataGap) => {
        let row = `<tr><td>${dataGap.alternatif}</td>`;
        dataGap.gap.forEach((nilaiGap) => {
            row += `<td>${nilaiGap}</td>`;
        });
        row += "</tr>";
        tbodyGapAlternatif.innerHTML += row;
    });

    inisialisasiDataTable('#tabelGapAlternatif', {
        columnDefs: [{ targets: '_all', className: 'text-center' }],
        searching: false,
        paging: false,
        info: false
    });
    // tampil tabel list gap per alternatif end

    // Tampil tabel hasil konversi gap
    const listKonversiGap = JSON.parse(sessionStorage.getItem("konversiGap"));
    const theadHasilKonversi = document.getElementById("theadHasilKonversi");
    const tbodyHasilKonversi = document.getElementById("tbodyHasilKonversi");

    theadHasilKonversi.innerHTML = "";
    tbodyHasilKonversi.innerHTML = "";

    if (listKonversiGap.length > 0) {
        let headerRow = "<tr><th>Kriteria</th>";
        listKonversiGap.forEach(item => {
            headerRow += `<th>${item.alternatif}</th>`;
        });
        headerRow += "</tr>";
        theadHasilKonversi.innerHTML = headerRow;

        const jumlahKriteria = listKonversiGap[0].bobot.length;

        for (let i = 0; i < jumlahKriteria; i++) {
            let row = `<tr><td>C${i + 1}</td>`;
            for (let j = 0; j < listKonversiGap.length; j++) {
                row += `<td>${listKonversiGap[j].bobot[i]}</td>`;
            }
            row += "</tr>";
            tbodyHasilKonversi.innerHTML += row;
        }
    }

    inisialisasiDataTable('#tabelHasilKonversi', {
        columnDefs: [
            { targets: '_all', className: 'text-center' },
            { type: 'natural', targets: 0 }
        ],
        searching: false,
        paging: false,
        info: false
    });
    // tampil tabel hasil konversi gap end

    // tampil tabel bobot cf sf
    const dataBobotCFSF = JSON.parse(sessionStorage.getItem("tableDataBobotCFSF"));

    inisialisasiDataTable('#tabelBobotCFSF', {
        data: dataBobotCFSF,
        columns: [
            { data: 'jenis', className: 'text-center' },
            { data: 'kriteria', className: 'text-center' },
            { data: 'bobot', className: 'text-center' }
        ],
        searching: false,
        paging: false,
        info: false
    });
    // tampil tabel bobot cf sf end

    // tampil tabel hitung rata" cf sf setiap alternatif
    let hasilPerhitunganRangking = JSON.parse(sessionStorage.getItem("hasilPerhitunganRangking"));

    inisialisasiDataTable('#tabelCFSFAlternatif', {
        data: hasilPerhitunganRangking,
        columns: [
            { data: 'alternatif', className: 'text-center' },
            { data: 'NCF', className: 'text-center' },
            { data: 'NSF', className: 'text-center' }
        ],
        searching: false,
        paging: false,
        info: false
    });
    // tampil tabel hitung rata" cf sf setiap alternatif end

    // tampil tabel ranking
    hasilPerhitunganRangking.sort((a, b) => b.Ranking - a.Ranking);
    hasilPerhitunganRangking = hasilPerhitunganRangking.map((item, index) => ({
        ...item,
        AngkaRanking: index + 1
    }));

    inisialisasiDataTable('#tabelPerankingan', {
        data: hasilPerhitunganRangking,
        columns: [
            { data: 'AngkaRanking', className: 'text-center' },
            { data: 'alternatif', className: 'text-center' },
            { data: 'Ranking', className: 'text-center' }
        ],
        searching: false,
        paging: false,
        info: false
    });
    // tampil tabel ranking end
});


    const btnhapusRekomendasi = document.querySelector('.btn-delete');
    btnhapusRekomendasi.addEventListener("click", () => {
        console.log('hapus data rekomendasi');

        Swal.fire({
            title: "Are you sure?",
            text: "Hapus hasil rekomendasi ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Terhapus!",
                    text: "sudah terhapus.",
                    icon: "success"
                });
                window.location.reload();
            }
        });
    });

    btnSimpanHasilRekomendasi.addEventListener("click", () => {
        console.log('coba');

        insertHasilRekomendasi(dataTable);
    });
};
// logika tabel end



const insertHasilRekomendasi = (dataTable) => {

    console.log(dataTable);

    fetch('http://localhost:3000/api/insertHasilRekomendasi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataTable),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Data berhasil disimpan:", data);
            alert("Data berhasil disimpan!");
            window.location.reload(); // Reload halaman setelah menyimpan data
        })
        .catch(error => console.error("Error saving data:", error));
};

