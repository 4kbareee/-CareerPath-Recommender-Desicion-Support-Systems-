// const formInputBobot = document.getElementById("formInputBobot");
// let dataGlobalBobot = [];
// let isUpdate = false;
// let updateId = null;

// fetch('http://localhost:3000/api/readBobotCFSF', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then(response => response.json())
//     .then(dataBobot => {
//         dataGlobalBobot = dataBobot;
//         renderData(dataBobot);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });



// formInputBobot.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const inputKeterangan = document.getElementById("inputKeterangan");
//     const inputBobot = document.getElementById("inputBobot");

//     const dataBobotCFSF = {
//         keterangan: inputKeterangan.value,
//         bobot: inputBobot.value
//     };

//     if (isUpdate && updateId !== null) {
//         // Mode update
//         fetch(`http://localhost:3000/api/updateBobotCFSF/${updateId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(dataBobotCFSF)
//         })
//             .then(response => response.json())
//             .then(responseJson => {
//                 Swal.fire({
//                     title: "Berhasil Update Bobot CFSF",
//                     icon: "success"
//                 });

//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 1500);
//             });
//     } else {

//         insertDataBobotCFSF(dataBobotCFSF);

//     }
// });


// const insertDataBobotCFSF = (dataBobotCFSF) => {
//     fetch("http://localhost:3000/api/insertBobotCFSF", {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify(dataBobotCFSF)
//     })
//         .then(response => response.json())
//         .then(responseJson => {
//             console.log('berhasil insert data bobot cfsf' + responseJson);

//             Swal.fire({
//                 title: "Berhasil Menambahkan Bobot",
//                 icon: "success"
//             });

//             isUpdate = false;
//             updateId = null;

//             setTimeout(() => {
//                 window.location.href = '../html/BobotCFSF.html';
//             }, 1500)
//         })
// };





// const renderData = (dataBobot) => {
//     if ($.fn.DataTable.isDataTable('#myTable')) {
//         $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
//     }

//     $('#myTable').DataTable({
//         data: dataBobot, // Gunakan array data langsung
//         columns: [
//             { data: 'keterangan', className: 'text-center' },
//             { data: 'bobot', className: 'text-center' },
//             {
//                 data: null,
//                 className: 'text-center',
//                 render: function (data, type, row) {
//                     return `
//                         <button class="btn btn-warning btn-sm btn-update" data-id="${row.id_bobot_cf_sf}">
//                             Update
//                         </button>
//                         <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_bobot_cf_sf}">
//                             Delete
//                         </button>
//                         `;
//                 }
//             }
//         ],
//         columnDefs: [
//             { type: 'natural', targets: 0 } // Kolom pertama (index 0) yaitu 'kode' pakai natural sort
//         ]
//     });
// };


// $(document).on('click', '.btn-update', function () {
//     let id = $(this).data('id');

//     updateId = id;
//     isUpdate = true;

//     const selected = dataGlobalBobot.find(item => item.id_bobot_cf_sf === id);
//     console.log(selected);

//     if (selected) {
//         // Set form untuk update
//         $('#exampleModalLabel').text('Update Bobot');
//         $('#inputKeterangan').val(selected.keterangan);
//         $('#inputBobot').val(selected.bobot);

//         // Simpan status edit
//         sessionStorage.setItem('mode', 'update');

//         // Tampilkan modal
//         $('#exampleModal').modal('show');
//     }

// });

// $(document).on('click', '.btn-delete', function () {
//     let id = $(this).data('id');

//     // Tambahkan logika delete di sini
//     Swal.fire({
//         title: "Kamu yakin ingin menghapus data ini?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Ya, Hapus!"
//     }).then((result) => {
//         if (result.isConfirmed) {
//             Swal.fire({
//                 title: "Dihapus!",
//                 text: "Data Telah Dihapus.",
//                 icon: "success"
//             });

//             fetch(`http://localhost:3000/api/deleteBobotCFSF/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log(data);
//                     Swal.fire({
//                         title: "Berhasil Menghapus Data ",
//                         icon: "success"
//                     });
//                     setTimeout(() => {
//                         window.location.href = '../html/bobotCFSF.html';
//                     }, 1500);
//                 });
//         }
//     });
// });

const formInputBobot = document.getElementById("formInputBobot");
let dataGlobalBobot = [];
let isUpdate = false;
let updateId = null;

fetch('http://localhost:3000/api/readBobotCFSF', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(dataBobot => {
        dataGlobalBobot = dataBobot;
        renderData(dataBobot);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// ✅ Fungsi hitung total bobot
const hitungTotalBobot = (data, isUpdateMode = false, idYangDiupdate = null, bobotBaru = 0) => {
    let total = 0;

    data.forEach(item => {
        const currentBobot = parseFloat(item.bobot);
        if (!isNaN(currentBobot)) {
            if (isUpdateMode && item.id_bobot_cf_sf === idYangDiupdate) {
                total += parseFloat(bobotBaru); // tambahkan bobot baru
            } else {
                total += currentBobot;
            }
        }
    });

    return total;
};

formInputBobot.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputKeterangan = document.getElementById("inputKeterangan");
    const inputBobot = document.getElementById("inputBobot");

    const dataBobotCFSF = {
        keterangan: inputKeterangan.value,
        bobot: inputBobot.value
    };

    const bobotValue = parseFloat(dataBobotCFSF.bobot);
    if (isNaN(bobotValue) || bobotValue < 0 || bobotValue > 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Bobot tidak valid',
            text: 'Bobot harus bernilai antara 0 dan 1.'
        });
        return;
    }

    if (isUpdate && updateId !== null) {
        // ✅ Validasi untuk UPDATE
        const totalBobot = hitungTotalBobot(dataGlobalBobot, true, updateId, bobotValue);
        if (totalBobot > 1) {
            Swal.fire({
                icon: 'error',
                title: 'Total bobot tidak boleh lebih dari 100%',
                text: `Jumlah total saat ini adalah ${(totalBobot * 100).toFixed(2)}%.`
            });
            return;
        }
        

        // Mode update
        fetch(`http://localhost:3000/api/updateBobotCFSF/${updateId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataBobotCFSF)
        })
            .then(response => response.json())
            .then(responseJson => {
                Swal.fire({
                    title: "Berhasil Update Bobot CFSF",
                    icon: "success"
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            });
    } else {
        // ✅ Validasi untuk INSERT
        const totalBobot = hitungTotalBobot(dataGlobalBobot, false, null, bobotValue);
        if (totalBobot > 1) {
            Swal.fire({
                icon: 'error',
                title: 'Total bobot tidak boleh lebih dari 100%',
                text: `Jumlah total saat ini adalah ${(totalBobot * 100).toFixed(2)}%.`
            });
            return;
        }

        insertDataBobotCFSF(dataBobotCFSF);
    }
});


const insertDataBobotCFSF = (dataBobotCFSF) => {
    fetch("http://localhost:3000/api/insertBobotCFSF", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(dataBobotCFSF)
    })
        .then(response => response.json())
        .then(responseJson => {
            console.log('berhasil insert data bobot cfsf' + responseJson);

            Swal.fire({
                title: "Berhasil Menambahkan Bobot",
                icon: "success"
            });

            isUpdate = false;
            updateId = null;

            setTimeout(() => {
                window.location.href = '../html/BobotCFSF.html';
            }, 1500)
        })
};

const renderData = (dataBobot) => {
    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
    }

    $('#myTable').DataTable({
        data: dataBobot, // Gunakan array data langsung
        columns: [
            { data: 'keterangan', className: 'text-center' },
            { data: 'bobot', className: 'text-center' },
            {
                data: null,
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-update" data-id="${row.id_bobot_cf_sf}">
                            Update
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_bobot_cf_sf}">
                            Delete
                        </button>
                        `;
                }
            }
        ],
        columnDefs: [
            { type: 'natural', targets: 0 } // Kolom pertama (index 0) yaitu 'kode' pakai natural sort
        ]
    });
};

$(document).on('click', '.btn-update', function () {
    let id = $(this).data('id');

    updateId = id;
    isUpdate = true;

    const selected = dataGlobalBobot.find(item => item.id_bobot_cf_sf === id);
    console.log(selected);

    if (selected) {
        // Set form untuk update
        $('#exampleModalLabel').text('Update Bobot');
        $('#inputKeterangan').val(selected.keterangan);
        $('#inputBobot').val(selected.bobot);

        // Simpan status edit
        sessionStorage.setItem('mode', 'update');

        // Tampilkan modal
        $('#exampleModal').modal('show');
    }
});

$(document).on('click', '.btn-delete', function () {
    let id = $(this).data('id');

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

            fetch(`http://localhost:3000/api/deleteBobotCFSF/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        title: "Berhasil Menghapus Data ",
                        icon: "success"
                    });
                    setTimeout(() => {
                        window.location.href = '../html/bobotCFSF.html';
                    }, 1500);
                });
        }
    });
});
