import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/acara/rsvp.dart';

class Detailacara extends StatelessWidget {
  final int index;

  const Detailacara({super.key, required this.index});

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
          'Detail Acara',
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
                  'assets/gambar/kirab.png',
                  fit: BoxFit.fitWidth,
                ),
              ),
              // Nama Acara
              Padding(
                padding: const EdgeInsets.fromLTRB(0, 12, 0, 0),
                child: Text(
                  detailAcara[index]["nama_acara"]!,
                  style: GayaTeks.heading.copyWith(
                    color: Warna.darkBlue,
                  ),
                ),
              ),
              // Penanggung Jawab
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
                        "Penanggung Jawab: " +
                            detailAcara[index]["penanggung_jawab"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Jam Acara
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
                        "Jam Acara: " + detailAcara[index]["jam_acara"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Tanggal
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.calendar_month_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        detailAcara[index]["tanggal"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Jenis Acara
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: Icon(
                        Icons.groups_rounded,
                        size: 32,
                        color: Warna.blue4,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        detailAcara[index]["jenis_acara"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
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
                        detailAcara[index]["alamat_lokasi"]!,
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ),
                  ],
                ),
              ),
              // Keterangan Acara
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Text(
                        "Keterangan Acara",
                        style: GayaTeks.heading.copyWith(color: Warna.blue4),
                      ),
                    ),
                    Text(
                      detailAcara[index]["keterangan_acara"]!,
                      style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                    ),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
      bottomNavigationBar: Container(
        width: MediaQuery.of(context).size.width,
        height: 100,
        child: Center(
          child: GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Rsvp(),
                ),
              );
            },
            child: Container(
              width: MediaQuery.of(context).size.width * 0.7,
              height: 50,
              decoration: BoxDecoration(
                color: Warna.blue4,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Center(
                child: Text(
                  "RSVP",
                  style: GayaTeks.body.copyWith(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
