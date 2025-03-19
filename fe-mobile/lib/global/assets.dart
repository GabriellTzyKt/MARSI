import 'package:flutter/material.dart';

int screenHeight(BuildContext context) => MediaQuery.of(context).size.height.toInt();
int screenWidth(BuildContext context) => MediaQuery.of(context).size.width.toInt();

class Warna {
  static Color darkBlue = const Color.fromRGBO(11, 46, 75, 1);
  static Color blue1 = const Color.fromRGBO(0, 183, 255, 1);
  static Color blue2 = const Color.fromRGBO(99, 212, 255, 1);
  static Color blue3 = const Color.fromRGBO(137, 216, 235, 1);
  static Color blue4 = const Color.fromRGBO(0, 77, 163, 1);
  static Color accentYellow = const Color.fromRGBO(236, 199, 58, 1);
  static Color accentGreen = const Color.fromRGBO(98, 154, 52, 1);
  static Color accentRed = const Color.fromRGBO(255, 86, 93, 1);
}

class GayaTeks {
  static TextStyle heading = TextStyle(
    fontFamily: 'Lato',
    fontSize: 24,
    fontWeight: FontWeight.normal,
  );

  static TextStyle body = TextStyle(
    fontFamily: 'Lato',
    fontSize: 16,
    fontWeight: FontWeight.normal,
  );
}

class Kotak {
  static BoxDecoration dekorasi = BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(10),
    boxShadow: [Kotak.bayangan],
  );

  static BoxShadow bayangan = BoxShadow(
    color: Colors.black.withOpacity(0.2),
    blurRadius: 4,
    offset: Offset(4, 4), // Shadow position
  );
}

List<Map<String, String>> tugasPribadi = [
  {
    "nama_tugas": "Membuat Laporan Keuangan",
    "tanggal": "2025-02-05",
    "status": "Selesai"
  },
  {
    "nama_tugas": "Mengembangkan Fitur Login",
    "tanggal": "2025-02-07",
    "status": "Ditugaskan"
  },
  {
    "nama_tugas": "Menyusun Presentasi Proposal",
    "tanggal": "2025-02-03",
    "status": "Terlambat"
  },
];

List<Map<String, String>> detailAcara = [
  {
    "nama_acara": "Seminar Teknologi AI",
    "penanggung_jawab": "Budi Santoso",
    "jam_acara": "09.00 - 12.00",
    "tanggal": "07 Juli 2025",
    "jenis_acara": "Tertutup",
    "alamat_lokasi": "Auditorium Universitas Teknologi, Surabaya",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    "nama_acara": "Festival Kuliner Nusantara",
    "penanggung_jawab": "Siti Aisyah",
    "jam_acara": "17.00 - 22.00",
    "tanggal": "12 Agustus 2025",
    "jenis_acara": "Terbuka",
    "alamat_lokasi": "Lapangan Merdeka, Jakarta",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    "nama_acara": "Workshop Digital Marketing consectetur adipiscing elit",
    "penanggung_jawab": "Rudi Hartono",
    "jam_acara": "13.00 - 15.30",
    "tanggal": "25 September 2025",
    "jenis_acara": "Tertutup",
    "alamat_lokasi": "Co-Working Space Startup Hub, Bandung",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

List<Map<String, String>> detailSitus = [
  {
    "nama_situs": "Candi Borobudur",
    "alamat": "Magelang, Jawa Tengah, Indonesia",
    "jam_buka": "06.00 - 17.00",
    "nomor_telepon": "+62 293 788 266",
    "juru_kunci": "Sutopo",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    "nama_situs": "Goa Jomblang",
    "alamat": "Gunung Kidul, Yogyakarta, Indonesia",
    "jam_buka": "08.00 - 14.00",
    "nomor_telepon": "+62 274 367 122",
    "juru_kunci": "Parman",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    "nama_situs": "Benteng Vredeburg",
    "alamat": "Jl. Margo Mulyo, Yogyakarta, Indonesia",
    "jam_buka": "07.30 - 16.00",
    "nomor_telepon": "+62 274 586 934",
    "juru_kunci": "Wahyudi",
    "keterangan_acara":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

Map<String, String> detailUser = {
  "nama": "Jono",
  "tempat_lahir": "Surabaya",
  "tanggal_lahir": "15-08-1995",
  "alamat": "Jl. Merdeka No. 45, Surabaya, Indonesia",
  "jenis_kelamin": "Laki-laki",
  "wongso": "Indonesia",
  "email": "jono@example.com",
  "no_telp": "+62 812-3456-7890"
};

List<Map<String, String>> organisasi = [
  {
    "nama_organisasi": "Komunitas Developer Surabaya",
    "tanggal_bergabung": "12-03-2022",
    "kedudukan": "Anggota",
    "jumlah_anggota": "150"
  },
  {
    "nama_organisasi": "Asosiasi Startup Indonesia",
    "tanggal_bergabung": "25-07-2023",
    "kedudukan": "Koordinator",
    "jumlah_anggota": "300"
  },
  {
    "nama_organisasi": "Himpunan Mahasiswa Teknik Informatika",
    "tanggal_bergabung": "05-09-2021",
    "kedudukan": "Sekretaris",
    "jumlah_anggota": "80"
  }
];

List<Map<String, String>> komunitas = [
  {
    "nama_komunitas": "Komunitas Pecinta Alam",
    "tanggal_bergabung": "15-06-2020",
    "kedudukan": "Anggota",
    "jumlah_anggota": "120"
  },
  {
    "nama_komunitas": "Komunitas Fotografi Surabaya",
    "tanggal_bergabung": "10-02-2023",
    "kedudukan": "Ketua",
    "jumlah_anggota": "75"
  },
  {
    "nama_komunitas": "Komunitas Pengembang Flutter",
    "tanggal_bergabung": "20-09-2022",
    "kedudukan": "Moderator",
    "jumlah_anggota": "200"
  }
]
;

List<Map<String, String>> riwayatAcara = [
  {
    "nama_acara": "Seminar Teknologi Masa Depan",
    "lokasi_acara": "Auditorium Universitas Teknologi, Jakarta",
    "tanggal_acara": "10-03-2024",
    "diadakan_oleh": "Kementerian Riset dan Teknologi"
  },
  {
    "nama_acara": "Festival Budaya Nusantara",
    "lokasi_acara": "Lapangan Merdeka, Bandung",
    "tanggal_acara": "25-06-2023",
    "diadakan_oleh": "Dinas Pariwisata Jawa Barat"
  },
  {
    "nama_acara": "Workshop Pengembangan Startup",
    "lokasi_acara": "Co-Working Space Startup Hub, Surabaya",
    "tanggal_acara": "15-09-2023",
    "diadakan_oleh": "Asosiasi Startup Indonesia"
  }
]
;