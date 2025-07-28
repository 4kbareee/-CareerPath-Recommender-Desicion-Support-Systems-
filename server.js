const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const conn = mysql.createConnection({
    user:'root',
    password:'',
    database:'db_profilematching',
});

conn.connect((error) =>{
    if(error){
        console.log('koneksi ke database gagal'+ error);
    }
    else{
        console.log('koneksi berhasil');
    };
});

// endpoint lupa password
app.post('/api/lupaPassword', async (req, res) => {
    const { email, passwordLama, passwordBaru } = req.body;

    try {
        // Hash password lama
        const msgUint8 = new TextEncoder().encode(passwordLama);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashPasswordLama = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Hash password baru
        const msgUint8Baru = new TextEncoder().encode(passwordBaru);
        const hashBufferBaru = await crypto.subtle.digest('SHA-256', msgUint8Baru);
        const hashArrayBaru = Array.from(new Uint8Array(hashBufferBaru));
        const hashPasswordBaru = hashArrayBaru.map(b => b.toString(16).padStart(2, '0')).join('');

        // Jalankan query update
        conn.query(
            'UPDATE tb_login SET password = ? WHERE email = ? AND password = ?',
            [hashPasswordBaru, email, hashPasswordLama],
            (error, results) => {
                if (error) {
                    console.log('Gagal mengubah password: ' + error);
                    res.status(500).json({ message: 'Gagal mengubah password' });
                } else if (results.affectedRows === 0) {
                    res.status(400).json({ message: 'Email atau password lama salah' });
                } else {
                    res.status(200).json({ message: 'Password berhasil diubah' });
                }
            }
        );
    } catch (err) {
        console.error('Hashing error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});
// endpoint lupa password end

// endpoint insert registrasi user
app.post('/api/registrasiUser',(req, res) =>{
    const dataRegistrasiUser = req.body;

    conn.query('INSERT INTO tb_login SET ?', dataRegistrasiUser, (error, results) =>{
        if(error){
            console.log('data gagal di insert'+ error);
            res.status(500).json({message: 'data registrasi user gagal ditambahkan'});
        }
        else{
            console.log('data berhasil di insert'+ results);
            res.status(200).json({message: 'data registrasi user berhasil'});
        }
    });
});
// endpoint insert registrasi user end


// endpoint login user
app.post('/api/loginUser', async (req, res) =>{
    const {username, password} = req.body;

     // Hash password
     const msgUint8 = new TextEncoder().encode(password); // Mengubah string menjadi array byte
     const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // Hash password menggunakan SHA-256
     const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer ke byte array
     const hashPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert byte array ke string hex
     console.log(hashPassword); // Print hash password
     // hash password end

    conn.query('SELECT * FROM tb_login WHERE nama = ? AND password = ?', [username, hashPassword], (error, results) =>{
        
        if (error) {
            console.log('Login gagal: ' + error);
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }else if (results.length === 0) {
            // Username tidak ditemukan
            res.status(401).json({ message: 'Login gagal, pastikan Username dan Password benar' });
        } else{
            console.log('Login berhasil' + results);
            res.status(200).json({ message: 'Login berhasil' });
        };
    });
})
// endpoint login user end

// MENU KRITERIA
// endpoint insert Kriteria
app.post('/api/insertKriteria', (req, res) => {
    const { kode, keterangan, jenis } = req.body;

    const cekQuery = `
        SELECT * FROM tb_kriteria 
        WHERE kode = ? AND keterangan = ? AND jenis = ?
    `;

    conn.query(cekQuery, [kode, keterangan, jenis], (cekError, cekResults) => {
        if (cekError) {
            console.log('Terjadi kesalahan saat pengecekan: ' + cekError);
            return res.status(500).json({ message: 'Terjadi kesalahan saat pengecekan data' });
        }

        if (cekResults.length > 0) {
            return res.status(400).json({ message: 'Data kriteria sudah ada di database' });
        }

        const dataKriteria = { kode, keterangan, jenis };
        conn.query('INSERT INTO tb_kriteria SET ?', dataKriteria, (insertError, insertResults) => {
            if (insertError) {
                console.log('Data gagal di-insert: ' + insertError);
                return res.status(500).json({ message: 'Data kriteria gagal ditambahkan' });
            }

            console.log('Data berhasil di-insert: ' + insertResults);
            res.status(200).json({ message: 'Data kriteria berhasil ditambahkan' });
        });
    });
});

// endpoint insert Kriteria end

// endpoint read Kriteria 
app.get('/api/readKriteria', (req, res) =>{
    conn.query('SELECT * FROM tb_kriteria', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data kriteria gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint read Kriteria end

// endpoint update Kriteria
app.put('/api/updateKriteria/:id', (req, res) =>{
    const id = req.params.id;
    const dataKriteria = req.body;
        const kodeBaru = dataKriteria.kode; // Pastikan ini ada di form input kamu

    if (!kodeBaru) {
        return res.status(400).json({ message: 'Kode kriteria harus diisi' });
    }

    // Cek apakah kode sudah dipakai oleh entri lain
    const cekQuery = 'SELECT * FROM tb_kriteria WHERE kode = ? AND id_kriteria != ?';
    conn.query(cekQuery, [kodeBaru, id], (err, results) => {
        if (err) {
            console.error('Error saat cek duplikat:', err);
            return res.status(500).json({ message: 'Gagal cek duplikat data' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Kode kriteria sudah digunakan oleh entri lain' });
        }
        
        conn.query('UPDATE tb_kriteria SET ? WHERE id_kriteria = ?', [dataKriteria, id], (error, results) =>{
            if(error){
                console.log('data gagal di update'+ error);
                res.status(500).json({message: 'data kriteria gagal diupdate'});
            }
            else{
                console.log('data berhasil di update'+ results);
                res.status(200).json({message: 'data kriteria berhasil diupdate'});
            }
        });
    });
})
// endpoint update Kriteria end

// endpoint delete Kriteria
app.delete('/api/deleteKriteria/:id', (req, res) =>{
    const id = req.params.id;

    conn.query('DELETE FROM tb_kriteria WHERE id_kriteria = ?', id, (error, results) =>{
        if(error){
            console.log('data gagal di delete'+ error);
            res.status(500).json({message: 'data kriteria gagal dihapus'});
        }
        else{
            console.log('data berhasil di delete'+ results);
            res.status(200).json({message: 'data kriteria berhasil dihapus'});
        }
    });
})
// endpoint delete Kriteria end
// MENU KRITERIA END


// MENU ALTERNATIF PROFIL IDEAL
// endpoint read posisi pekerjaan
app.get('/api/readPosisiPekerjaan', (req, res) =>{
    conn.query('SELECT * FROM tb_alternatif', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data posisi pekerjaan gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint read posisi pekerjaan end
// endpoint insert posisi pekerjaan
app.post('/api/insertPosisiPekerjaan', (req, res) =>{
    const dataPosisiPekerjaan = req.body;

    // Cek dulu apakah kode sudah ada di database
    conn.query('SELECT * FROM tb_alternatif WHERE kode = ?', [dataPosisiPekerjaan.kode], (err, results) => {
        if (err) {
            console.error('Error saat cek data:', err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat pengecekan data' });
        }

        if (results.length > 0) {
            // Data dengan kode ini sudah ada, jangan insert lagi
            return res.status(409).json({ message: 'Kode posisi pekerjaan sudah ada, tidak boleh duplikat' });
        }

        // Kalau belum ada, insert data baru
        conn.query('INSERT INTO tb_alternatif SET ?', dataPosisiPekerjaan, (error, insertResult) => {
            if (error) {
                console.error('Gagal insert data:', error);
                return res.status(500).json({ message: 'Gagal menambahkan posisi pekerjaan' });
            }

            console.log('Berhasil insert data:', insertResult);
            res.status(200).json({ message: 'Posisi pekerjaan berhasil ditambahkan' });
        });
    });
});
// endpoint insert posisi pekerjaan end
// endpoint update posisi pekerjaan
app.put('/api/updatePosisiPekerjaan/:id', (req, res) =>{
    const id = req.params.id;
    const dataPosisiPekerjaan = req.body;


    conn.query('SELECT * FROM tb_alternatif WHERE kode = ?', [dataPosisiPekerjaan.kode], (err, results) => {
        if (err) {
            console.error('Error saat cek data:', err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat pengecekan data' });
        }

        if (results.length > 0) {
            // Data dengan kode ini sudah ada, jangan insert lagi
            return res.status(409).json({ message: 'Kode posisi pekerjaan sudah ada, tidak boleh duplikat' });
        }

        
        conn.query('UPDATE tb_alternatif SET ? WHERE id_alternatif = ?', [dataPosisiPekerjaan, id], (error, results) =>{
            if(error){
                console.log('data gagal di update'+ error);
                res.status(500).json({message: 'data posisi pekerjaan gagal diupdate'});
            }
            else{
                console.log('data berhasil di update'+ results);
                res.status(200).json({message: 'data posisi pekerjaan berhasil diupdate'});
            }
        });
    });
})
// endpoint update posisi pekerjaan end
// endpoint delete posisi pekerjaan
app.delete('/api/deletePosisiPekerjaan/:id', (req, res) =>{
    const id = req.params.id;

    conn.query('DELETE FROM tb_alternatif WHERE id_alternatif = ?', id, (error, results) =>{
        if(error){
            console.log('data gagal di delete'+ error);
            res.status(500).json({message: 'data posisi pekerjaan gagal dihapus'});
        }
        else{
            console.log('data berhasil di delete'+ results);
            res.status(200).json({message: 'data posisi pekerjaan berhasil dihapus'});
        }
    });
});
// endpoint delete posisi pekerjaan end

// endpoint read nilai profil ideal
app.get('/api/readNilaiProfilIdeal', (req, res) =>{
    conn.query("SELECT `tb_nilai-profil-ideal`.`id_nilai_profil_ideal`, `tb_alternatif`.`posisi_pekerjaan`, `tb_kriteria`.`kode`, `tb_nilai-profil-ideal`.`nilai_profil_ideal` FROM `tb_nilai-profil-ideal` INNER JOIN `tb_alternatif` ON `tb_nilai-profil-ideal`.`id_alternatif` = `tb_alternatif`.`id_alternatif` INNER JOIN `tb_kriteria` ON `tb_nilai-profil-ideal`.`id_kriteria` = `tb_kriteria`.`id_kriteria`", (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data alternatif profil ideal gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint read nilai profil ideal end
// endpoint insert nilai profil ideal
app.post('/api/insertNilaiProfilIdeal', (req, res) => {
    const dataNilaiProfilIdeal = req.body; // Ini array of objects dari frontend

    if (!Array.isArray(dataNilaiProfilIdeal) || dataNilaiProfilIdeal.length === 0) {
        return res.status(400).json({ message: 'Data tidak valid atau kosong' });
    };

    // Format data menjadi array of arrays untuk bulk insert
    const values = dataNilaiProfilIdeal.map(item => [item.id_alternatif, item.id_kriteria, item.nilai_profil_ideal]);

    conn.query("INSERT INTO `tb_nilai-profil-ideal` (`id_alternatif`, `id_kriteria`, `nilai_profil_ideal`) VALUES ?", [values], (error, results) => {
        if (error) {
            console.error('Data gagal diinsert:', error);
            return res.status(500).json({ message: 'Data nilai profil ideal gagal ditambahkan' });
        }

        console.log('Data berhasil diinsert:', results);
        res.status(200).json({ message: 'Data nilai profil ideal berhasil ditambahkan' });
    });
});

// endpoint insert nilai profil ideal end
// endpoint update nilai profil ideal
app.put('/api/updateNilaiProfilIdeal/:id', (req, res) =>{
    const id = req.params.id;
    const dataNilaiProfilIdeal = req.body;

    conn.query('UPDATE `tb_nilai-profil-ideal` SET ? WHERE id_nilai_profil_ideal = ?', [dataNilaiProfilIdeal, id], (error, results) =>{
        if(error){
            console.log('data gagal di update'+ error);
            res.status(500).json({message: 'data nilai profil ideal gagal diupdate'});
        }
        else{
            console.log('data berhasil di update'+ results);
            res.status(200).json({message: 'data nilai profil ideal berhasil diupdate'});
        }
    });
})
// endpoint update nilai profil ideal end
// endpoint delete nilai profil ideal
app.delete('/api/deleteNilaiProfilIdeal/:id', (req, res) =>{
    const id = req.params.id;

    conn.query('DELETE FROM `tb_nilai-profil-ideal` WHERE id_nilai_profil_ideal = ?', id, (error, results) =>{
        if(error){
            console.log('data gagal di delete'+ error);
            res.status(500).json({message: 'data nilai profil ideal gagal dihapus'});
        }
        else{
            console.log('data berhasil di delete'+ results);
            res.status(200).json({message: 'data nilai profil ideal berhasil dihapus'});
        }
    });
});
// endpoint delete nilai profil ideal end
// MENU ALTERNATIF PROFIL IDEAL END


// MENU PERHITUNGAN REKOMENDASI
// endpoint insert simpan hasil rekomendasi
app.post('/api/insertHasilRekomendasi',(req, res) =>{
    const dataHasilPerhitungan = req.body;

    console.log(dataHasilPerhitungan); // Log data yang diterima dari frontend
    
    conn.query('INSERT INTO tb_hasilrekomendasi SET ?', dataHasilPerhitungan, (error, results) =>{
        if(error){
            console.log('data gagal di insert'+ error);
            res.status(500).json({message: 'data hasil perhitungan gagal ditambahkan'});
        }
        else{
            console.log('data berhasil di insert'+ results);
            res.status(200).json({message: 'data hasil perhitungan berhasil ditambahkan'});
        }
    });
});
// endpoint insert simpan hasil rekomendasi end
// MENU PERHITUNGAN REKOMENDASI END

// MENU BOBOT CF SF
// endpoint insert bobot cf sf
app.post('/api/insertBobotCFSF', (req, res) =>{
    const dataBobotCFSF = req.body;


    conn.query('INSERT INTO tb_bobot_cf_sf SET ?', dataBobotCFSF, (error, results) =>{
        if(error){
            console.log('data gagal di insert'+ error);
            res.status(500).json({message: 'data bobot cf sf gagal ditambahkan'});
        }
        else{
            console.log('data berhasil di insert'+ results);
            res.status(200).json({message: 'data bobot cf sf berhasil ditambahkan'});
        }
    });
});
// endpoint insert bobot cf sf end

// endpoint read bobot cf sf
app.get('/api/readBobotCFSF', (req, res) =>{
    conn.query('SELECT * FROM tb_bobot_cf_sf', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data bobot cf sf gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint read bobot cf sf end

// endpoint update bobot cf sf
app.put('/api/updateBobotCFSF/:id', (req, res) =>{
    const id = req.params.id;
    const dataBobotCFSF = req.body;

    conn.query('UPDATE tb_bobot_cf_sf SET ? WHERE id_bobot_cf_sf = ?', [dataBobotCFSF, id], (error, results) =>{
        if(error){
            console.log('data gagal di update'+ error);
            res.status(500).json({message: 'data bobot cf sf gagal diupdate'});
        }
        else{
            console.log('data berhasil di update'+ results);
            res.status(200).json({message: 'data bobot cf sf berhasil diupdate'});
        }
    });
});
// endpoint update bobot cf sf end

// endpoint delete bobot cf sf
app.delete('/api/deleteBobotCFSF/:id', (req, res) =>{
    const id = req.params.id;

    conn.query('DELETE FROM tb_bobot_cf_sf WHERE id_bobot_cf_sf = ?', id, (error, results) =>{
        if(error){
            console.log('data gagal di delete'+ error);
            res.status(500).json({message: 'data bobot cf sf gagal dihapus'});
        }
        else{
            console.log('data berhasil di delete'+ results);
            res.status(200).json({message: 'data bobot cf sf berhasil dihapus'});
        }
    });
});
// endpoint delete bobot cf sf end
// MENU BOBOT CF SF END



// MENU DASHBOARD
// endpoint tampil jumlah kriteria
app.get('/api/jumlahKriteria', (req, res) =>{
    
    conn.query('SELECT COUNT(*) as jumlah_kriteria FROM tb_kriteria', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data jumlah kriteria gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint tampil jumlah kriteria end

// endpoint jumlah rekomendasi
app.get('/api/jumlahRekomendasi', (req, res) =>{
    
    conn.query('SELECT COUNT(*) as jumlah_rekomendasi FROM tb_hasilrekomendasi', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data jumlah rekomendasi gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint jumlah rekomendasi end

// endpoint get bobot cf
app.get('/api/getBobotCF', (req, res) =>{
    
    conn.query('SELECT bobot FROM tb_bobot_cf_sf WHERE keterangan = "Core Factor"', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data bobot cf gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint get bobot cf end

// endpoint get bobot sf
app.get('/api/getBobotSF', (req, res) =>{
    
    conn.query('SELECT bobot FROM tb_bobot_cf_sf WHERE keterangan = "Secondary Factor"', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data bobot cf gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint get bobot sf end

// endpoint tampil jumlah alternatif posisi pekerjaan
app.get('/api/jumlahAlternatif', (req, res) =>{
    
    conn.query('SELECT COUNT(*) as jumlah_posisi_pekerjaan FROM tb_alternatif', (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data jumlah posisi pekerjaan gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint tampil jumlah alternatif posisi pekerjaan end
// MENU DASHBOARD END

// MENU DATA REKOMENDASI
// endpoint read data rekomendasi
app.get('/api/readDataRekomendasi', (req, res) =>{
    conn.query("SELECT * from tb_hasilrekomendasi", (error, results) =>{
        if(error){
            console.log('data gagal di ambil'+ error);
            res.status(500).json({message: 'data rekomendasi gagal diambil'});
        }
        else{
            console.log('data berhasil di ambil'+ results);
            res.status(200).json(results);
        }
    });
});
// endpoint read data rekomendasi end

// endpoint delete data rekomendasi
app.delete('/api/deleteDataRekomendasi/:id', (req, res) =>{
    const id = req.params.id;

    conn.query('DELETE FROM tb_hasilrekomendasi WHERE id_hasilRekomendasi = ?', id, (error, results) =>{
        if(error){
            console.log('data gagal di delete'+ error);
            res.status(500).json({message: 'data rekomendasi gagal dihapus'});
        }
        else{
            console.log('data berhasil di delete'+ results);
            res.status(200).json({message: 'data rekomendasi berhasil dihapus'});
        }
    });
});
// endpoint delete data rekomendasi end
// MENU DATA REKOMENDASI END


app.listen(port, () =>{
    console.log(`server berjalan di http://localhost:${port}`);
})