import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';

void checkIn(BuildContext context) => showDialog(
    context: context,
    builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(32.0))),
          contentPadding: EdgeInsets.only(top: 10.0),
          // Judul "Check In"
          title: Row(
            children: [
              GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: Icon(Icons.arrow_back_ios)),
              Text(
                " Check In",
                style: GayaTeks.body.copyWith(
                    color: Warna.blue4,
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
            ],
          ),
          // Kotak konten
          content: Container(
            width: MediaQuery.of(context).size.width - 100,
            height: MediaQuery.of(context).size.height * 0.38,
            child: Column(
              children: [
                // Input "Tujuan Kedatangan"
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Tujuan Kedatangan',
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
                ),
                const SizedBox(height: 16),
                // Input "Keterangan Kedatangan"
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: TextFormField(
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'Keterangan Kedatangan',
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
                ),
              ],
            ),
          ),
          actions: [
            // Tombol "Submit"
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: InkWell(
                onTap: () {
                  Navigator.pop(context);
                },
                child: Container(
                  height: 30,
                  width: double.infinity - 100,
                  decoration: BoxDecoration(
                    color: Warna.blue4,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: Text(
                      "Submit",
                      style: GayaTeks.body.copyWith(color: Colors.white),
                    ),
                  ),
                ),
              ),
            )
          ],
        ));

void laporanTugas(BuildContext context) => showDialog(
    context: context,
    builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(32.0))),
          contentPadding: EdgeInsets.only(top: 10.0),
          // Judul "Laporan"
          title: Row(
            children: [
              GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: Icon(Icons.arrow_back_ios)),
              Text(
                " Laporan",
                style: GayaTeks.body.copyWith(
                    color: Warna.blue4,
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
            ],
          ),
          // Kotak konten
          content: Container(
            width: 300,
            height: 280,
            child: Column(
              children: [
                // Input "Keterangan"
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: TextFormField(
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'Keterangan',
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
                ),
                // Input "Bukti Foto"
                Padding(
                  padding:
                      const EdgeInsets.symmetric(vertical: 8.0, horizontal: 24),
                  child: Row(
                    children: [
                      Text('Bukti Foto'),
                    ],
                  ),
                ),
                // Tombol "Upload File"
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: InkWell(
                    child: Container(
                      height: 30,
                      width: double.infinity - 100,
                      decoration: BoxDecoration(
                        color: Warna.accentYellow,
                        borderRadius: BorderRadius.circular(26),
                      ),
                      child: Center(
                        child: Text(
                          "Upload File",
                          style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                        ),
                      ),
                    ),
                  ),
                ),
                // Tombol "Laporkan"
                GestureDetector(
                  onTap: () {
                  
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: InkWell(
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: Container(
                        height: 30,
                        width: double.infinity - 120,
                        decoration: BoxDecoration(
                          color: Warna.blue4,
                          borderRadius: BorderRadius.circular(26),
                        ),
                        child: Center(
                          child: Text(
                            "Laporkan",
                            style: GayaTeks.body.copyWith(color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                
              ],
            ),
          ),
        ));
