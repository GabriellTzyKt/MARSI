import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/situs/detailSitus.dart';

class Situs extends StatefulWidget {
  const Situs({super.key});

  @override
  State<Situs> createState() => _SitusState();
}

class _SitusState extends State<Situs> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 20),
        child: SearchBar(
          hintText: "Cari Situs",
        ),
      ),
      Expanded(
        child: ListView.builder(
            itemCount: detailSitus.length,
            itemBuilder: (context, index) {
              return Container(
                decoration: Kotak.dekorasi,
                margin: EdgeInsets.fromLTRB(24, 0, 24, 24),
                height: 250,
                child: Column(
                  children: [
                    Flexible(
                      child: Container(
                        clipBehavior: Clip.antiAlias,
                        height: 150,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(10),
                            topRight: Radius.circular(10),
                          ),
                        ),
                        child: Image.asset(
                          'assets/gambar/surakarta_hadiningrat.png',
                          fit: BoxFit.fitWidth,
                        ),
                      ),
                    ),
                    // Nama Acara
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              detailSitus[index]["nama_situs"]!,
                              style: GayaTeks.heading.copyWith(
                                color: Warna.darkBlue,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Lokasi dan Tombol Detail
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 12, 0, 0),
                      child: Row(
                        children: [
                          // Lokasi
                          Icon(
                            Icons.pin_drop_rounded,
                            color: Warna.darkBlue,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                              child: Text(detailSitus[index]["alamat"]!,
                                  style: GayaTeks.body.copyWith(
                                      fontSize: 12,
                                      // fontWeight: FontWeight.bold,
                                      color: Warna.darkBlue))),
                          // Tombol Detail
                          GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => 
                                  Detailsitus(index: index),
                                ),
                              );
                            },
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 12.0),
                              child: Container(
                                width: 100,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: Warna.blue4,
                                  borderRadius: BorderRadius.circular(26),
                                ),
                                child: Center(
                                  child: Text(
                                    "Detail",
                                    style: GayaTeks.body.copyWith(
                                        color: Colors.white, fontSize: 14),
                                  ),
                                ),
                              ),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              );
            }),
      ),
    ]));
  }
}
