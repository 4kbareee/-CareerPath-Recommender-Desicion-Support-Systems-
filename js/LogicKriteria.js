fetch('http://localhost:3000/api/readKriteria', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
}
)
    .then(response => response.json())
    .then(data => {
        renderData(data);
    });


const renderData = (data) => {

    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
    }

    $('#myTable').DataTable({
        data: data, // Gunakan array data langsung
        columns: [
            { data: 'kode', className: 'text-center' },   
            { data: 'keterangan', className: 'text-center' },
            { data: 'jenis', className: 'text-center' }, 
            {
                data: null, 
                className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-update" data-id="${row.id_kriteria}" data-kode="${row.kode}" data-keterangan="${row.keterangan}" data-jenis="${row.jenis}">
                            Update
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${row.id_kriteria}">
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
    sessionStorage.setItem('id', id);

    let kode = $(this).data('kode');
    let keterangan = $(this).data('keterangan');
    let jenis = $(this).data('jenis');
    sessionStorage.setItem('kode', kode);
    sessionStorage.setItem('jenis', jenis);
    sessionStorage.setItem('keterangan', keterangan);
    // Tambahkan logika update di sini
    window.location.href = '../html/updateKriteria.html';
});

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

            fetch(`http://localhost:3000/api/deleteKriteria/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        title: "Berhasil Menghapus Kriteria",
                        icon: "success"
                    });
                    setTimeout(() => {
                        window.location.href = '../html/Kriteria.html';
                    }, 1500);
                });
        }
    });
});




const tambah = document.getElementById('tambah');
tambah.addEventListener('click', () => {
    window.location.href = 'InputKriteria.html';
});


// if ($.fn.DataTable.isDataTable('#myTable')) {
//     $('#myTable').DataTable().destroy(); // Hapus instance DataTable sebelumnya
// }
