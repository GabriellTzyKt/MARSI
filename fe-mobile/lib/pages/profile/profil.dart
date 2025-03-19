import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:iconify_flutter/icons/material_symbols.dart';
import 'package:marsi_mobile/global/widget.dart';
import 'package:marsi_mobile/pages/profile/setting.dart';

class Profil extends StatefulWidget {
  const Profil({super.key});

  @override
  State<Profil> createState() => _ProfilState();
}

class _ProfilState extends State<Profil> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Setting
          GestureDetector(
            onTap: () {
              Navigator.push(
                  context, MaterialPageRoute(builder: (context) => Setting()));
            },
            child: Padding(
              padding: const EdgeInsets.fromLTRB(0, 8, 8, 0),
              child: Align(
                alignment: Alignment.topRight,
                child: Iconify(
                  MaterialSymbols.settings,
                  size: 32,
                  color: Warna.darkBlue,
                ),
              ),
            ),
          ),
          // Profil
          Padding(
            padding: const EdgeInsets.fromLTRB(40.0, 0, 0, 8.0),
            child: Row(
              children: [
                // Foto Profil
                Container(
                  width: 60,
                  height: 60,
                  clipBehavior: Clip.antiAlias,
                  margin: EdgeInsets.only(right: 16),
                  decoration: BoxDecoration(
                    color: Colors.amber,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey,
                        blurRadius: 3,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Image.asset(
                    "assets/gambar/aca.png",
                    fit: BoxFit.cover,
                  ),
                ),
                // Nama
                Text(
                  detailUser["nama"]!,
                  style: GayaTeks.heading.copyWith(color: Warna.darkBlue),
                ),
              ],
            ),
          ),
          Expanded(
            child: DefaultTabController(
              length: 3,
              initialIndex: 0,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TabBar(
                          isScrollable: false,
                          labelColor: Warna.darkBlue,
                          indicatorColor: Warna.darkBlue,
                          unselectedLabelColor: Colors.grey,
                          tabs: [
                            Tab(
                              text: "Biodata",
                            ),
                            Tab(
                              text: "Komunitas",
                            ),
                            Tab(
                              text: "Riwayat Acara",
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Biodata
                        SingleChildScrollView(
                          child: Column(
                            children: [
                              // QR/Bar code
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16.0),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    // Qr Code
                                    Container(
                                      width: 150,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Warna.accentYellow,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                right: 2.0),
                                            child: Iconify(
                                                MaterialSymbols.qr_code,
                                                color: Warna.darkBlue),
                                          ),
                                          Text(
                                            "QR Code",
                                            style: GayaTeks.body.copyWith(
                                              color: Warna.darkBlue,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // Bar Code
                                    Container(
                                      width: 150,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Warna.accentYellow,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                right: 2.0),
                                            child: Iconify(
                                              MaterialSymbols.barcode,
                                              color: Warna.darkBlue,
                                            ),
                                          ),
                                          Text(
                                            "Barcode",
                                            style: GayaTeks.body.copyWith(
                                                color: Warna.darkBlue),
                                          ),
                                        ],
                                      ),
                                    )
                                  ],
                                ),
                              ),
                              // Garis Pemisah
                              Divider(
                                thickness: 2,
                                height: 0,
                              ),
                              // Data Diri
                              Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Nama Lengkap
                                  LahanTeks.lahanBerjudul(context,
                                      "Nama Lengkap", detailUser, "nama"),
                                  // Tempat Tanggal Lahir
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8.0),
                                    child: Text(
                                      "Tempat Tanggal Lahir",
                                      style: GayaTeks.body,
                                    ),
                                  ),
                                  Container(
                                    width:
                                        MediaQuery.of(context).size.width * 0.8,
                                    height: 40,
                                    decoration: BoxDecoration(
                                        border: Border.all(
                                          color: Colors.black,
                                        ),
                                        borderRadius:
                                            BorderRadius.circular(12)),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 8.0),
                                      child: Align(
                                        alignment: Alignment.centerLeft,
                                        child: Text(
                                          "${detailUser["tempat_lahir"]}, ${detailUser["tanggal_lahir"]}",
                                          style: GayaTeks.body,
                                        ),
                                      ),
                                    ),
                                  ),
                                  // Alamat
                                  LahanTeks.lahanBerjudul(context, "Alamat",
                                      detailUser, "alamat"),
                                  // Jenis Kelamin
                                  LahanTeks.lahanBerjudul(context, "Jenis Kelamin",
                                      detailUser, "jenis_kelamin"),
                                  // Wongso
                                  LahanTeks.lahanBerjudul(context, "Wongso",
                                      detailUser, "wongso"),
                                  // Email
                                  LahanTeks.lahanBerjudul(context, "Email",
                                      detailUser, "email"),
                                  // No Telp
                                  LahanTeks.lahanBerjudul(context, "No Telp",
                                      detailUser, "no_telp"),
                                  Padding(padding: EdgeInsets.only(bottom: 16)),
                                ],
                              )
                            ],
                          ),
                        ),
                        SingleChildScrollView(
                          child: Column(
                            children: [
                              // Organisasi
                              // Kotak Besar Organisasi
                              const SizedBox(height: 16),
                              Container(
                                width: MediaQuery.of(context).size.width * 0.9,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Colors.black,
                                    width: 1.5,
                                  ),
                                ),
                                child: Column(
                                  children: [
                                    // Text "Organisasi"
                                    Align(
                                      alignment: Alignment.topLeft,
                                      child: Padding(
                                        padding: const EdgeInsets.fromLTRB(
                                            12, 16, 0, 0),
                                        child: Text(
                                          "Organisasi",
                                          style: GayaTeks.body.copyWith(
                                              color: Warna.darkBlue,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),
                                    // List Organisasi
                                    ListView.builder(
                                      shrinkWrap: true,
                                      physics: NeverScrollableScrollPhysics(),
                                      itemCount: organisasi.length,
                                      itemBuilder: (context, index) {
                                        return Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: ExpansionTile(
                                            // Nama Organisasi + Panah
                                            title: Text(
                                              organisasi[index]
                                                  ["nama_organisasi"]!,
                                              style: GayaTeks.body,
                                            ),
                                            collapsedIconColor: Colors.white,
                                            collapsedTextColor: Colors.white,
                                            textColor: Colors.white,
                                            iconColor: Colors.white,
                                            collapsedBackgroundColor:
                                                Color.fromRGBO(
                                                    110, 131, 149, 1),
                                            backgroundColor: Color.fromRGBO(
                                                110, 131, 149, 1),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                            ),
                                            collapsedShape:
                                                RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                            ),
                                            children: [
                                              // Deskripsi Organisasi
                                              Container(
                                                width: double.infinity,
                                                height: 100,
                                                decoration: BoxDecoration(
                                                  color: Color.fromRGBO(
                                                      186, 194, 202, 1),
                                                  borderRadius:
                                                      BorderRadius.only(
                                                    bottomLeft:
                                                        Radius.circular(16),
                                                    bottomRight:
                                                        Radius.circular(16),
                                                  ),
                                                ),
                                                child: Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                          left: 16.0),
                                                  child: Column(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        "Tanggal Bergabung: ${organisasi[index]["tanggal_bergabung"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                      Text(
                                                        "Sebagai: ${organisasi[index]["kedudukan"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                      Text(
                                                        "Jumlah Anggota: ${organisasi[index]["jumlah_anggota"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              Padding(padding: EdgeInsets.only(bottom: 16)),
                              // Komunitas
                              // Kotak Besar Komunitas
                              Container(
                                width: MediaQuery.of(context).size.width * 0.9,
                                decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: Colors.black,
                                      width: 1.5,
                                    )),
                                child: Column(
                                  children: [
                                    // Text "Komunitas"
                                    Align(
                                      alignment: Alignment.topLeft,
                                      child: Padding(
                                        padding: const EdgeInsets.fromLTRB(
                                            12, 16, 0, 0),
                                        child: Text(
                                          "Komunitas",
                                          style: GayaTeks.body.copyWith(
                                              color: Warna.darkBlue,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),
                                    // List Komunitas
                                    ListView.builder(
                                      shrinkWrap: true,
                                      physics: NeverScrollableScrollPhysics(),
                                      itemCount: organisasi.length,
                                      itemBuilder: (context, index) {
                                        return Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: ExpansionTile(
                                            // Nama Komunitas + Panah
                                            title: Text(
                                              komunitas[index]
                                                  ["nama_komunitas"]!,
                                              style: GayaTeks.body,
                                            ),
                                            collapsedIconColor: Colors.white,
                                            collapsedTextColor: Colors.white,
                                            textColor: Colors.white,
                                            iconColor: Colors.white,
                                            collapsedBackgroundColor:
                                                Color.fromRGBO(
                                                    110, 131, 149, 1),
                                            backgroundColor: Color.fromRGBO(
                                                110, 131, 149, 1),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                            ),
                                            collapsedShape:
                                                RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                            ),
                                            children: [
                                              // Deskripsi Komunitas
                                              Container(
                                                width: double.infinity,
                                                height: 100,
                                                decoration: BoxDecoration(
                                                    color: Color.fromRGBO(
                                                        186, 194, 202, 1),
                                                    borderRadius:
                                                        BorderRadius.only(
                                                      bottomLeft:
                                                          Radius.circular(16),
                                                      bottomRight:
                                                          Radius.circular(16),
                                                    )),
                                                child: Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                          left: 8.0),
                                                  child: Column(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        "Tanggal Bergabung: ${komunitas[index]["tanggal_bergabung"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                      Text(
                                                        "Sebagai: ${komunitas[index]["kedudukan"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                      Text(
                                                        "Jumlah Anggota: ${komunitas[index]["jumlah_anggota"]!}",
                                                        style: GayaTeks.body
                                                            .copyWith(
                                                                color: Warna
                                                                    .darkBlue,
                                                                fontSize: 14),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    )
                                  ],
                                ),
                              ),
                              Padding(padding: EdgeInsets.only(bottom: 16))
                            ],
                          ),
                        ),
                        // Riwayat Acara
                        ListView.builder(
                          shrinkWrap: true,
                          itemCount: riwayatAcara.length,
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: ExpansionTile(
                                // Nama Acara + Panah
                                title: Text(
                                  riwayatAcara[index]["nama_acara"]!,
                                  style: GayaTeks.body,
                                ),
                                collapsedIconColor: Colors.white,
                                collapsedTextColor: Colors.white,
                                textColor: Colors.white,
                                iconColor: Colors.white,
                                collapsedBackgroundColor:
                                    Color.fromRGBO(110, 131, 149, 1),
                                backgroundColor:
                                    Color.fromRGBO(110, 131, 149, 1),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                collapsedShape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                children: [
                                  // Deskripsi Acara
                                  Container(
                                    width: double.infinity,
                                    height: 100,
                                    decoration: BoxDecoration(
                                        color: Color.fromRGBO(186, 194, 202, 1),
                                        borderRadius: BorderRadius.only(
                                          bottomLeft: Radius.circular(16),
                                          bottomRight: Radius.circular(16),
                                        )),
                                    child: Padding(
                                      padding:
                                          const EdgeInsets.only(left: 16.0),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            "Diadakan di: ${riwayatAcara[index]["lokasi_acara"]!}",
                                            style: GayaTeks.body.copyWith(
                                                color: Warna.darkBlue,
                                                fontSize: 14),
                                          ),
                                          Text(
                                            "Tanggal: ${riwayatAcara[index]["tanggal_acara"]!}",
                                            style: GayaTeks.body.copyWith(
                                                color: Warna.darkBlue,
                                                fontSize: 14),
                                          ),
                                          Text(
                                            "Oleh: ${riwayatAcara[index]["diadakan_oleh"]!}",
                                            style: GayaTeks.body.copyWith(
                                                color: Warna.darkBlue,
                                                fontSize: 14),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
