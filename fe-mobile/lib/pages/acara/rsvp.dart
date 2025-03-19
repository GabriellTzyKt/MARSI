import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:iconify_flutter/icons/material_symbols.dart';

class Rsvp extends StatefulWidget {
  const Rsvp({super.key});

  @override
  State<Rsvp> createState() => _RsvpState();
}

class _RsvpState extends State<Rsvp> {
  bool showBox = false;
  int counter = 0;
  String dropDownValue = "Laki-laki";
  List<String> tambahPeserta = [];

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
          'RSVP',
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
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Nama Lengkap
            Container(
              margin: EdgeInsets.fromLTRB(24, 16, 24, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Text(
                      "Nama Lengkap",
                      style: GayaTeks.body,
                    ),
                  ),
                  TextFormField(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Warna.darkBlue, width: 2.0),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // No Telp
            Container(
              margin: EdgeInsets.fromLTRB(24, 16, 24, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Text(
                      "No. Telp",
                      style: GayaTeks.body,
                    ),
                  ),
                  TextFormField(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Warna.darkBlue, width: 2.0),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Jenis Kelamin
            Container(
              margin: EdgeInsets.fromLTRB(24, 16, 24, 0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Text(
                        "Jenis Kelamin",
                        style: GayaTeks.body,
                      ),
                    ),
                    DropdownButton<String>(
                        isExpanded: true,
                        value: dropDownValue,
                        items: [
                          DropdownMenuItem(
                            value: "Laki-laki",
                            child: Text("Laki-laki"),
                          ),
                          DropdownMenuItem(
                            value: "Perempuan",
                            child: Text("Perempuan"),
                          ),
                        ],
                        onChanged: (String? value) {
                          setState(() {
                            dropDownValue = value!;
                          });
                        }),
                  ],
                ),
              ),
            ),
            // Peserta Tambahan
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Peserta Tambahan (Opsional)",
                    style: GayaTeks.body
                        .copyWith(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  InkWell(
                    onTap: () {
                      setState(() {
                        tambahPeserta.add("a");
                      });
                    },
                    child: Container(
                      height: 30,
                      width: 110,
                      decoration: BoxDecoration(
                        color: Warna.accentYellow,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          "+ Tambah Data",
                          style: GayaTeks.body.copyWith(
                              fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
            // List Peserta Tambahan
            Column(
              children: List.generate(tambahPeserta.length, (index) {
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  // Teks "Peserta Tambahan"
                  child: ExpansionTile(
                    collapsedIconColor: Colors.white,
                    collapsedTextColor: Colors.white,
                    textColor: Colors.white,
                    iconColor: Colors.white,
                    collapsedBackgroundColor: Color.fromRGBO(110, 131, 149, 1),
                    backgroundColor: Color.fromRGBO(110, 131, 149, 1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    collapsedShape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    title: Row(
                      children: [
                        Text(
                          "Peserta Tambahan ${index + 1}",
                          style: GayaTeks.body,
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 4,
                          ),
                        ),
                        // Mengurangi Peserta Tambahan
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              tambahPeserta.removeAt(tambahPeserta.length - 1);
                            });
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Warna.accentRed,
                            ),
                            child: Iconify(
                              MaterialSymbols.delete_outline,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                        )
                      ],
                    ),
                    children: [
                      // Input Peserta Tambahan
                      Container(
                        padding: EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(
                            color: Color.fromRGBO(186, 194, 202, 1),
                            borderRadius: BorderRadius.only(
                                bottomLeft: Radius.circular(16),
                                bottomRight: Radius.circular(16))),
                        child: Column(
                          children: [
                            // Nama Lengkap
                            Container(
                              margin: EdgeInsets.fromLTRB(24, 16, 24, 0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(bottom: 8.0),
                                    child: Text(
                                      "Nama Lengkap",
                                      style: GayaTeks.body,
                                    ),
                                  ),
                                  Container(
                                    height: 30,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: TextFormField(
                                      maxLines: 1,
                                      decoration: InputDecoration(
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderSide: BorderSide(
                                              color: Warna.darkBlue,
                                              width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // No. Telp
                            Container(
                              margin: EdgeInsets.fromLTRB(24, 16, 24, 0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(bottom: 8.0),
                                    child: Text(
                                      "No. Telp",
                                      style: GayaTeks.body,
                                    ),
                                  ),
                                  Container(
                                    height: 30,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: TextFormField(
                                      maxLines: 1,
                                      decoration: InputDecoration(
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderSide: BorderSide(
                                              color: Warna.darkBlue,
                                              width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                    onExpansionChanged: (bool expanded) {
                      setState(() {
                        showBox = expanded;
                      });
                    },
                  ),
                );
              }),
            )
          ],
        ),
      ),
      bottomNavigationBar: Container(
        width: MediaQuery.of(context).size.width,
        height: 100,
        child: Center(
          child: GestureDetector(
            onTap: () {},
            child: Container(
              width: MediaQuery.of(context).size.width * 0.7,
              height: 50,
              decoration: BoxDecoration(
                color: Warna.blue4,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Center(
                child: Text(
                  "Daftar",
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
