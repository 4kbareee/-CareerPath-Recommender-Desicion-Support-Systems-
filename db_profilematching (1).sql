-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2025 at 07:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_profilematching`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_alternatif`
--

CREATE TABLE `tb_alternatif` (
  `id_alternatif` int(11) NOT NULL,
  `kode` varchar(20) NOT NULL,
  `posisi_pekerjaan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_alternatif`
--

INSERT INTO `tb_alternatif` (`id_alternatif`, `kode`, `posisi_pekerjaan`) VALUES
(49, 'A1', 'IT Support'),
(50, 'A2', 'Programmer'),
(51, 'A3', 'Administrator Jaringan'),
(52, 'A4', 'IoT Technician'),
(53, 'A5', 'Cybersecurity');

-- --------------------------------------------------------

--
-- Table structure for table `tb_bobot_cf_sf`
--

CREATE TABLE `tb_bobot_cf_sf` (
  `id_bobot_cf_sf` int(11) NOT NULL,
  `bobot` float NOT NULL,
  `keterangan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_bobot_cf_sf`
--

INSERT INTO `tb_bobot_cf_sf` (`id_bobot_cf_sf`, `bobot`, `keterangan`) VALUES
(11, 0.6, 'Core Factor'),
(12, 0.4, 'Secondary Factor');

-- --------------------------------------------------------

--
-- Table structure for table `tb_hasilrekomendasi`
--

CREATE TABLE `tb_hasilrekomendasi` (
  `id_hasilRekomendasi` int(11) NOT NULL,
  `jurusan` varchar(50) NOT NULL,
  `kelas` varchar(50) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `nilai` float NOT NULL,
  `rekomendasi` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_hasilrekomendasi`
--

INSERT INTO `tb_hasilrekomendasi` (`id_hasilRekomendasi`, `jurusan`, `kelas`, `nama`, `nilai`, `rekomendasi`) VALUES
(5, 'Teknik Komputer dan Jaringan', 'XII TKJ 2', 'Akbar Fauzan Warahidayat', 24.16, 'IT Support'),
(6, 'Teknik Komputer dan Jaringan', 'XII TKJ 1', 'Lolaura Batrisiya', 21.38, 'IT Support'),
(7, 'Teknik Komputer dan Jaringan', 'XII TKJ 2', 'Kurnia Hidayat', 22.56, 'IoT Technician'),
(8, 'Teknik Komputer dan Jaringan', 'TKJ 1', 'Cia Rafaela', 21.17, 'IT Support'),
(9, 'Teknik Komputer Jaringan', 'XII TKJ 2', 'Walid Khairul', 22.73, 'Administrator Jaringan'),
(11, 'Teknik Komputer Jaringan', 'XII TKJ 2', 'Nabila', 22.73, 'Administrator Jaringan'),
(12, 'Teknik Komputer dan Jaringan', 'XII TKJ 1', 'Agus Supriadi', 22.73, 'Administrator Jaringan'),
(15, 'Teknik Komputer dan Jaringan', 'XII TKJ 2', 'Rayhan Syahdafi', 23.44, 'IT Support'),
(16, 'Teknik Komputer dan Jaringan', 'XII TKJ 2', 'kautsar', 21.98, 'IT Support'),
(17, 'Teknik Komputer dan Jaringan', 'TKJ 2', 'Niyo', 23.86, 'Cybersecurity'),
(18, 'Teknik Komputer dan Jaringan', 'TKJ 1', 'Adi Supriadi', 21.89, 'IT Support'),
(19, 'Teknik Komputer dan Jaringan', 'XII TKJ 2', 'Rayhan', 23.44, 'Administrator Jaringan'),
(20, 'a', 'a', 'a', 15.34, 'Programmer');

-- --------------------------------------------------------

--
-- Table structure for table `tb_kriteria`
--

CREATE TABLE `tb_kriteria` (
  `id_kriteria` int(11) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `keterangan` varchar(250) NOT NULL,
  `jenis` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_kriteria`
--

INSERT INTO `tb_kriteria` (`id_kriteria`, `kode`, `keterangan`, `jenis`) VALUES
(12, 'C1', 'Pemahaman Hardware', 'CF'),
(13, 'C2', 'Pemahaman Software', 'CF'),
(14, 'C3', 'Pemahaman Sistem Operasi', 'CF'),
(15, 'C4', 'Kemampuan Praktik Konfigurasi Jaringan', 'CF'),
(16, 'C5', 'Kemampuan Praktik Keamanan Jaringan', 'CF'),
(17, 'C6', 'Kemampuan Praktik IoT', 'CF'),
(18, 'C7', 'Kemampuan Troubleshooting', 'CF'),
(19, 'C8', 'Keterampilan Desain Jaringan', 'CF'),
(20, 'C9', 'Kemampuan Berfikir Kritis dan Logis', 'SF'),
(23, 'C10', 'Kemampuan Teamwork / Kerjasama Tim', 'SF'),
(24, 'C11', 'Kemampuan Komunikasi', 'SF');

-- --------------------------------------------------------

--
-- Table structure for table `tb_login`
--

CREATE TABLE `tb_login` (
  `id_login` int(11) NOT NULL,
  `nama` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_login`
--

INSERT INTO `tb_login` (`id_login`, `nama`, `email`, `password`) VALUES
(1, 'admin', 'admin@gmail.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),
(2, 'dummy', 'dummy@gmail.com', 'b5a2c96250612366ea272ffac6d9744aaf4b45aacd96aa7cfcb931ee3b558259'),
(3, 'Akbar Fauzan Warahidayat', 'akbar.lolaura@gmail.com', '3a6350d0c2694d03f9673a74e6edeec085694a3b7ae217b85d4a682eba471399'),
(4, 'Lolaura', 'lolaura@gmail.com', 'd0f47d87d68075be981ad37368ef4070e06755f6ccb85081ac7411858a91f24c'),
(5, 'Ilham Priyadi', 'ilham@gmail.com', 'b31984046c568f1fac1e6b56298a78cc11b608920db7e6d60bb22bf57cac34cb'),
(6, 'Yudha Chandra Winata', 'yuda@gmail.com', '9cf8fcc5ff5c07fa98e350c8f07a525ef7e45ef1b16b23c3145484b2d025e467'),
(7, 'Reni', 'reni@gmail.com', 'f7a17e72a1ac928993755383fc6f8890f6d4d514a5dd97c77fbdf92bbe4003fc'),
(8, 'dummy', 'dummy@gmail.com', 'b5a2c96250612366ea272ffac6d9744aaf4b45aacd96aa7cfcb931ee3b558259');

-- --------------------------------------------------------

--
-- Table structure for table `tb_nilai-profil-ideal`
--

CREATE TABLE `tb_nilai-profil-ideal` (
  `id_nilai_profil_ideal` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `id_kriteria` int(11) NOT NULL,
  `nilai_profil_ideal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_nilai-profil-ideal`
--

INSERT INTO `tb_nilai-profil-ideal` (`id_nilai_profil_ideal`, `id_alternatif`, `id_kriteria`, `nilai_profil_ideal`) VALUES
(331, 49, 12, 4),
(332, 49, 13, 4),
(333, 49, 14, 4),
(334, 49, 15, 3),
(335, 49, 16, 3),
(336, 49, 17, 2),
(337, 49, 18, 5),
(338, 49, 19, 2),
(339, 49, 20, 4),
(340, 49, 23, 4),
(341, 49, 24, 5),
(342, 50, 12, 2),
(343, 50, 13, 5),
(344, 50, 14, 4),
(345, 50, 15, 2),
(346, 50, 16, 2),
(347, 50, 17, 1),
(348, 50, 18, 4),
(349, 50, 19, 1),
(350, 50, 20, 5),
(351, 50, 23, 4),
(352, 50, 24, 4),
(353, 51, 12, 4),
(354, 51, 13, 3),
(355, 51, 14, 4),
(356, 51, 15, 5),
(357, 51, 16, 5),
(358, 51, 17, 3),
(359, 51, 18, 4),
(360, 51, 19, 4),
(361, 51, 20, 4),
(362, 51, 23, 3),
(363, 51, 24, 3),
(364, 52, 12, 5),
(365, 52, 13, 4),
(366, 52, 14, 4),
(367, 52, 15, 4),
(368, 52, 16, 3),
(369, 52, 17, 5),
(370, 52, 18, 4),
(371, 52, 19, 2),
(372, 52, 20, 4),
(373, 52, 23, 3),
(374, 52, 24, 3),
(375, 53, 12, 4),
(376, 53, 13, 4),
(377, 53, 14, 5),
(378, 53, 15, 4),
(379, 53, 16, 5),
(380, 53, 17, 2),
(381, 53, 18, 4),
(382, 53, 19, 3),
(383, 53, 20, 5),
(384, 53, 23, 3),
(385, 53, 24, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_alternatif`
--
ALTER TABLE `tb_alternatif`
  ADD PRIMARY KEY (`id_alternatif`);

--
-- Indexes for table `tb_bobot_cf_sf`
--
ALTER TABLE `tb_bobot_cf_sf`
  ADD PRIMARY KEY (`id_bobot_cf_sf`);

--
-- Indexes for table `tb_hasilrekomendasi`
--
ALTER TABLE `tb_hasilrekomendasi`
  ADD PRIMARY KEY (`id_hasilRekomendasi`);

--
-- Indexes for table `tb_kriteria`
--
ALTER TABLE `tb_kriteria`
  ADD PRIMARY KEY (`id_kriteria`);

--
-- Indexes for table `tb_login`
--
ALTER TABLE `tb_login`
  ADD PRIMARY KEY (`id_login`);

--
-- Indexes for table `tb_nilai-profil-ideal`
--
ALTER TABLE `tb_nilai-profil-ideal`
  ADD PRIMARY KEY (`id_nilai_profil_ideal`),
  ADD KEY `id_kriteria` (`id_kriteria`),
  ADD KEY `id_nama_profil_ideal` (`id_alternatif`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_alternatif`
--
ALTER TABLE `tb_alternatif`
  MODIFY `id_alternatif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `tb_bobot_cf_sf`
--
ALTER TABLE `tb_bobot_cf_sf`
  MODIFY `id_bobot_cf_sf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tb_hasilrekomendasi`
--
ALTER TABLE `tb_hasilrekomendasi`
  MODIFY `id_hasilRekomendasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tb_kriteria`
--
ALTER TABLE `tb_kriteria`
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tb_login`
--
ALTER TABLE `tb_login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tb_nilai-profil-ideal`
--
ALTER TABLE `tb_nilai-profil-ideal`
  MODIFY `id_nilai_profil_ideal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=397;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_nilai-profil-ideal`
--
ALTER TABLE `tb_nilai-profil-ideal`
  ADD CONSTRAINT `tb_nilai-profil-ideal_ibfk_3` FOREIGN KEY (`id_kriteria`) REFERENCES `tb_kriteria` (`id_kriteria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_nilai-profil-ideal_ibfk_4` FOREIGN KEY (`id_alternatif`) REFERENCES `tb_alternatif` (`id_alternatif`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
