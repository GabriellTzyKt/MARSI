import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/acara/detailAcara.dart';

class Acara extends StatefulWidget {
  const Acara({super.key});

  @override
  State<Acara> createState() => _AcaraState();
}

List<Map<String, String>> cariAcara = [];

class _AcaraState extends State<Acara> {
  @override
  void initState() {
    cariAcara = detailAcara;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(children: [
      ListView(children: [
        Column(
            children: List.generate(cariAcara.length, (index) {
          return Container(
            decoration: Kotak.dekorasi,
            margin: index == 0
                ? EdgeInsets.fromLTRB(24, 84, 24, 12)
                : EdgeInsets.fromLTRB(24, 12, 24, 12),
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
                      'assets/gambar/kirab.png',
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
                          cariAcara[index]["nama_acara"]!,
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
                  padding: const EdgeInsets.fromLTRB(12, 12, 0, 12),
                  child: Row(
                    children: [
                      // Lokasi
                      Icon(
                        Icons.pin_drop_rounded,
                        color: Warna.darkBlue,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                          child: Text(cariAcara[index]["alamat_lokasi"]!,
                              style: GayaTeks.body.copyWith(
                                  fontSize: 12, color: Warna.darkBlue))),
                      // Tombol Detail
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => Detailacara(index: index),
                            ),
                          );
                        },
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12.0),
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
        })),
      ]),
      // Search Bar
      Padding(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
        child: Align(
          alignment: Alignment.topCenter,
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.75,
            child: SearchBar(
              onChanged: (value) {
                filterAcara(value);
              },
              hintText: "Cari Acara",
            ),
          ),
        ),
      ),
    ]));
  }

  void filterAcara(String value) {
    List<Map<String, String>> hasil = [];
    if (value.isEmpty) {
      hasil = detailAcara;
    }else {
      hasil = detailAcara.where((element) => element["nama_acara"]!.toLowerCase().contains(value.toLowerCase())).toList();
    }
    setState(() {
      cariAcara = hasil;
    });
  }
}
