let dataGlobalAlternatif = [];
let isUpdate = false;
let updateId = null;

fetch('http://localhost:3000/api/readNilaiProfilIdeal', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        renderDataNilaiProfilIdeal(data);
        // console.log(data);
    });


fetch('http://localhost:3000/api/readPosisiPekerjaan', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        dataGlobalAlternatif = data; // Simpan data ke variabel global
        renderDataPosisiPekerjaan(data);
        // console.log(data);
    });


const renderDataPosisiPekerjaan = (data) => {
    if ($.fn.DataTable.isDataTable('#myTablePosisiPekerjaan')) {
        $('#myTablePosisiPekerjaan').DataTable().destroy(); // Hapus instance DataTable sebelumnya
    }

    $('#myTablePosisiPekerjaan').DataTable({
        data: data, // Gunakan array data langsung
        columns: [
            // { data: 'id_alternatif' }, 
            { data: 'kode', className: 'text-center' },
            { data: 'posisi_pekerjaan', className: 'text-center' },
            {
                data: null, 
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-update-posisi-pekerjaan" data-id="${row.id_alternatif}">
                            Update
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete-posisi-pekerjaan" data-id="${row.id_alternatif}">
                            Delete
                        </button>
                        `;
                }
            }
        ]
    });
};

$(document).on('click', '.btn-update-posisi-pekerjaan', function () {
    let id = $(this).data('id');
    // console.log(id);
    updateId = id;
    isUpdate = true;


    const selected = dataGlobalAlternatif.find(item => item.id_alternatif === id);
    console.log(selected);

    if (selected) {
        // Set form untuk update
        $('#exampleModalLabel').text('Update Alternatif Posisi Pekerjaan');
        $('#inputKodeAlternatif').val(selected.kode);
        $('#inputAlternatifPosisiPekerjaan').val(selected.posisi_pekerjaan);

        // Simpan status edit
        sessionStorage.setItem('mode', 'update');

        // Tampilkan modal
        $('#exampleModal').modal('show');
    }
});

$(document).on('click', '.btn-delete-posisi-pekerjaan', function () {
    let id = $(this).data('id');

    // Tambahkan logika delete di sini
    Swal.fire({
        title: "Kamu yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Dihapus!",
                text: "Data Telah Dihapus.",
                icon: "success"
            });

            fetch(`http://localhost:3000/api/deletePosisiPekerjaan/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        title: "Berhasil Menghapus Posisi Pekerjaan",
                        icon: "success"
                    });
                    setTimeout(() => {
                        window.location.href = '../html/AlternatifProfilIdeal.html';
                    }, 1500);
                });
        }
    });
});




const renderDataNilaiProfilIdeal = (data) => {
    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
    }

    $('#myTable').DataTable({
        data: data, // Gunakan array data langsung
        columns: [
            { data: 'posisi_pekerjaan', className: 'text-center' },
            { data: 'kode', className: 'text-center' },
            { data: 'nilai_profil_ideal', className: 'text-center' },
            {
                data: null,
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-update" data-id="${row.id_nilai_profil_ideal}">
                            Update
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_nilai_profil_ideal}">
                            Delete
                        </button>
                        `;
                }
            }
        ]
    });
};

$(document).on('click', '.btn-update', function () {
    let id = $(this).data('id');
    console.log(id);

    const row = this.closest("tr");
    const posisiPekerjaan = row.cells[0].textContent.trim();
    const kodeKriteria = row.cells[1].textContent.trim();
    const nilaiProfilIdeal = row.cells[2].textContent.trim();

    sessionStorage.setItem('id', id);
    sessionStorage.setItem('posisiPekerjaan', posisiPekerjaan);
    sessionStorage.setItem('kodeKriteria', kodeKriteria);
    sessionStorage.setItem('nilaiProfilIdeal', nilaiProfilIdeal);

    console.log(posisiPekerjaan);
    console.log(kodeKriteria);
    console.log(nilaiProfilIdeal);
    // Tambahkan logika update di sini
    window.location.href = '../html/updateAlternatifProfilIdeal.html';
});

$(document).on('click', '.btn-delete', function () {
    let id = $(this).data('id');
    console.log(id);

    Swal.fire({
        title: "Kamu yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Dihapus!",
                text: "Data Telah Dihapus.",
                icon: "success"
            });

            fetch(`http://localhost:3000/api/deleteNilaiProfilIdeal/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        title: "Berhasil Menghapus Nilai Profil Ideal",
                        icon: "success"
                    });
                    setTimeout(() => {
                        window.location.href = '../html/AlternatifProfilIdeal.html';
                    }, 1500);
                });
        };
    });


});

const formTambahPosisiPekerjaan = document.getElementById('formTambahPosisiPekerjaan');
formTambahPosisiPekerjaan.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputKodeAlternatif = document.getElementById('inputKodeAlternatif');
    const inputAlternatifPosisiPekerjaan = document.getElementById('inputAlternatifPosisiPekerjaan');

    const dataPosisiPekerjaanObject = {
        kode: inputKodeAlternatif.value,
        posisi_pekerjaan: inputAlternatifPosisiPekerjaan.value
    };

    if (isUpdate && updateId !== null) {
        // mode update
        fetch(`http://localhost:3000/api/updatePosisiPekerjaan/${updateId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataPosisiPekerjaanObject)
        })
        .then(response => {
            sessionStorage.setItem('responStatus', response.status);

            return response.json();
        })
        .then(data => {
            const responStatus = parseInt(sessionStorage.getItem('responStatus'));

            if (responStatus !== 200) {
                Swal.fire({
                    icon: "error",
                    title: "Alternatif Tidak Boleh Duplikat",
                });
                return;
            };

             Swal.fire({
                title: "Berhasil Update Alternatif Posisi Pekerjaan",
                icon: "success"
            });

            setTimeout(() => {
                window.location.href = 'AlternatifProfilIdeal.html';
            }, 1500);
        });

    } else {
        // mode insert
        fetch('http://localhost:3000/api/insertPosisiPekerjaan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataPosisiPekerjaanObject)
        })
        .then(response => {
            sessionStorage.setItem('responStatus', response.status);

            return response.json();
        })
        .then(data => {
            const responStatus = parseInt(sessionStorage.getItem('responStatus'));

            if (responStatus !== 200) {
                Swal.fire({
                    icon: "error",
                    title: "Alternatif Tidak Boleh Duplikat",
                });
                return;
            };

            Swal.fire({
                title: "Berhasil Menambahkan Alternatif Posisi Pekerjaan",
                icon: "success"
            });

            setTimeout(() => {
                window.location.href = 'AlternatifProfilIdeal.html';
            }, 1500);
        });
    };
});

const tambahNilaiProfilIdeal = document.getElementById('tambahNilaiProfilIdeal');
tambahNilaiProfilIdeal.addEventListener('click', () => {
    window.location.href = 'inputAlternatifProfilIdeal.html';
});
