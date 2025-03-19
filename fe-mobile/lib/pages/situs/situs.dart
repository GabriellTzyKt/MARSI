import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/situs/detailSitus.dart';

class Situs extends StatefulWidget {
  const Situs({super.key});

  @override
  State<Situs> createState() => _SitusState();
}

List<Map<String, String>> cariSitus = [];

class _SitusState extends State<Situs> {
  @override
  void initState() {
    cariSitus = detailSitus;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(children: [
      ListView(children: [
        Column(
          children: List.generate(cariSitus.length, (index) {
            return Container(
              decoration: Kotak.dekorasi,
              margin: index == 0
                  ? EdgeInsets.fromLTRB(24, 84, 24, 12)
                  : EdgeInsets.fromLTRB(24, 12, 24, 12),
              height: 250,
              child: Column(
                children: [
                  // Gambar
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
                            cariSitus[index]["nama_situs"]!,
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
                            child: Text(cariSitus[index]["alamat"]!,
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
                                builder: (context) => Detailsitus(index: index),
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
                filterSitus(value);
              },
              hintText: "Cari Situs",
            ),
          ),
        ),
      ),
    ]));
  }

  void filterSitus(String value) {
    List<Map<String, String>> hasil = [];
    if (value.isEmpty) {
      hasil = detailSitus;
    }else {
      hasil = detailSitus.where((element) => element["nama_situs"]!.toLowerCase().contains(value.toLowerCase())).toList();
    }
    setState(() {
      cariSitus = hasil;
    });
  }
}
