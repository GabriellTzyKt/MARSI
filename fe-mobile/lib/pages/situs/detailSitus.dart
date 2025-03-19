import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/situs/situs.dart';


class Detailsitus extends StatelessWidget {
  final int index;

  const Detailsitus({super.key, required this.index});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded),
          onPressed: () {
            Navigator.pop(context);
          },
          color: Warna.darkBlue,
        ),
        title: Text(
          'Detail Situs',
          style: GayaTeks.heading
              .copyWith(color: Warna.darkBlue, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        shadowColor: Colors.transparent,
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(0),
          child: Container(
            color: Colors.black,
            height: 1,
          ),
        ),
      ),
      body: ListView(
        children: [
          Column(
            children: [
              // Gambar Acara
              Container(
                margin: EdgeInsets.fromLTRB(24, 12, 24, 0),
                clipBehavior: Clip.antiAlias,
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Image.asset(
                  'assets/gambar/surakarta_hadiningrat.png',
                  fit: BoxFit.fitWidth,
                ),
              ),
              // Nama Situs
              Padding(
                padding: const EdgeInsets.fromLTRB(0, 12, 0, 0),
                child: Text(
                  cariSitus[index]["nama_situs"]!,
                  style: GayaTeks.heading.copyWith(
                    color: Warna.darkBlue,
                  ),
                ),
              ),
              // Alamat
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.pin_drop_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        "Alamat: ${cariSitus[index]["alamat"]!}",
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Jam Buka
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.watch_later_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        "Jam Buka: ${cariSitus[index]["jam_buka"]!}",
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Nomor Telepon
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.phone_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        cariSitus[index]["nomor_telepon"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Juru Kunci
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.person_2_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        "Juru Kunci: ${cariSitus[index]["juru_kunci"]!}",
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Keterangan Situs
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Text(
                        "Keterangan Situs",
                        style: GayaTeks.heading.copyWith(color: Warna.blue4),
                      ),
                    ),
                    Text(
                      cariSitus[index]["keterangan_acara"]!,
                      style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                    ),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
    );
  }
}
