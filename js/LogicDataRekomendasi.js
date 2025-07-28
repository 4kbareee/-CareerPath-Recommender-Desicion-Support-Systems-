console.log('aw');


fetch('http://localhost:3000/api/readDataRekomendasi', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json'
    }
})
    .then(response => response.json())
    .then(dataRekomendasi => {
        console.log('Data Rekomendasi:', dataRekomendasi);
        renderDataRekomendasi(dataRekomendasi);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const renderDataRekomendasi = (dataRekomendasi) => {
    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
    }

    $('#myTable').DataTable({
        data: dataRekomendasi, // Gunakan array data langsung
        layout: {
            topStart: {
                buttons: ['csv', 'excel']
            }
        }, 
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: ':not(:last-child)' // abaikan kolom terakhir
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':not(:last-child)'
                }
            }],
        columns: [
            { data: 'jurusan', className: 'text-center' },
            { data: 'kelas', className: 'text-center' },
            { data: 'nama', className: 'text-center' },
            { data: 'nilai', className: 'text-center' },
            { data: 'rekomendasi', className: 'text-center' },
            {
                data: null,
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_hasilRekomendasi}">
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
}

$(document).on('click', '.btn-delete', function () {
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

            fetch(`http://localhost:3000/api/deleteDataRekomendasi/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        title: "Berhasil Menghapus Data Rekomendasi",
                        icon: "success"
                    });
                    setTimeout(() => {
                        window.location.href = '../html/dataRekomendasi.html';
                    }, 1500);
                });
        }
    });
});