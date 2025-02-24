import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/home/popDialog.dart';

class Homescreen extends StatefulWidget {
  const Homescreen({super.key});

  @override
  State<Homescreen> createState() => HomescreenState();
}

class HomescreenState extends State<Homescreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          // Kalender
          Container(
            margin: EdgeInsets.fromLTRB(15, 15, 15, 15),
            width: 200,
            height: 200,
            decoration: Kotak.dekorasi,
            child: Center(child: Text("Ini Kalender")),
          ),
          const SizedBox(height: 20),
          // Check in
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 0, 0),
            child: Text(
              "Check In",
              style: GayaTeks.heading
                  .copyWith(color: Warna.blue4, fontWeight: FontWeight.bold),
            ),
          ),
          Container(
            margin: EdgeInsets.fromLTRB(15, 15, 15, 15),
            width: double.infinity,
            height: 200,
            decoration: Kotak.dekorasi,
            child: Column(
              children: [
                Row(
                  children: [
                    // Gambar
                    Container(
                      margin: EdgeInsets.all(16),
                      width: 150,
                      height: 100,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black, width: 1.3),
                        borderRadius: BorderRadius.circular(10),
                        image: DecorationImage(
                          image: AssetImage(
                              'assets/gambar/surakarta_hadiningrat.png'),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    // Kolom text
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Text(
                            "Situs paling dekat dengan anda",
                            style: GayaTeks.body.copyWith(
                                color: Warna.darkBlue,
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Icon(Icons.location_on, color: Warna.darkBlue),
                              Expanded(
                                  child: Text(
                                "Keraton Surakarta Hadiningrat",
                                style: GayaTeks.body.copyWith(
                                    color: Warna.darkBlue,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold),
                              ))
                            ],
                          )
                        ],
                      ),
                    )
                  ],
                ),
                // Tombol Check In
                InkWell(
                  onTap: () {
                    checkIn(context);
                  },
                  child: Container(
                    width: MediaQuery.of(context).size.width - 60,
                    height: 30,
                    decoration: BoxDecoration(
                      color: Warna.blue4,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        "Check-in",
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Tugas Pribadi
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 0, 0),
            child: Text(
              "Tugas Pribadi",
              style: GayaTeks.heading
                  .copyWith(color: Warna.blue4, fontWeight: FontWeight.bold),
            ),
          ),
          Container(
              margin: EdgeInsets.fromLTRB(15, 15, 15, 15),
              width: double.infinity,
              height: 200,
              decoration: Kotak.dekorasi,
              child: ListView.builder(
                itemCount: tugasPribadi.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Column(
                      children: [
                        // Tugas, tanggal, status
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Nama tugas
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 20, 0, 20),
                              child: Text(
                                tugasPribadi[index]["nama_tugas"]!,
                                style: GayaTeks.body,
                              ),
                            ),
                            // Tanggal dan status
                            Padding(
                              padding: const EdgeInsets.fromLTRB(0, 20, 16, 20),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  // Tanggal
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Icon(
                                        Icons.calendar_month_outlined,
                                        color: Warna.darkBlue,
                                      ),
                                      Text(tugasPribadi[index]["tanggal"]!,
                                          style: GayaTeks.body
                                              .copyWith(fontSize: 8)),
                                    ],
                                  ),
                                  // Status
                                  Container(
                                    margin: EdgeInsets.only(top: 4),
                                    width: 52,
                                    height: 18,
                                    decoration: BoxDecoration(
                                      color: tugasPribadi[index]["status"] ==
                                              'Selesai'
                                          ? Warna.accentGreen
                                          : tugasPribadi[index]["status"] ==
                                                  'Ditugaskan'
                                              ? Warna.accentYellow
                                              : Warna.accentRed,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Center(
                                      child:
                                          Text(tugasPribadi[index]["status"]!,
                                              style: GayaTeks.body.copyWith(
                                                color: Colors.white,
                                                fontSize: 8,
                                                fontWeight: FontWeight.bold,
                                              )),
                                    ),
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                        // Tombol
                        InkWell(
                          onTap: () {
                            laporanTugas(context);
                          },
                          child: Container(
                            width: MediaQuery.of(context).size.width - 60,
                            height: 30,
                            decoration: BoxDecoration(
                              color: Warna.blue4,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Center(
                              child: Text(
                                "Buat Laporan",
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              )),
          const SizedBox(height: 20),
          // Tugas Acara
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 0, 0),
            child: Text(
              "Tugas Acara",
              style: GayaTeks.heading
                  .copyWith(color: Warna.blue4, fontWeight: FontWeight.bold),
            ),
          ),
          Container(
              margin: EdgeInsets.fromLTRB(15, 15, 15, 15),
              width: double.infinity,
              height: 200,
              decoration: Kotak.dekorasi,
              child: ListView.builder(
                itemCount: tugasPribadi.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Column(
                      children: [
                        // Tugas, tanggal, status
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Nama tugas
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 20, 0, 20),
                              child: Text(
                                tugasPribadi[index]["nama_tugas"]!,
                                style: GayaTeks.body,
                              ),
                            ),
                            // Tanggal dan status
                            Padding(
                              padding: const EdgeInsets.fromLTRB(0, 20, 16, 20),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  // Tanggal
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Icon(
                                        Icons.calendar_month_outlined,
                                        color: Warna.darkBlue,
                                      ),
                                      Text(tugasPribadi[index]["tanggal"]!,
                                          style: GayaTeks.body
                                              .copyWith(fontSize: 8)),
                                    ],
                                  ),
                                  // Status
                                  Container(
                                    margin: EdgeInsets.only(top: 4),
                                    width: 52,
                                    height: 18,
                                    decoration: BoxDecoration(
                                      color: tugasPribadi[index]["status"] ==
                                              'Selesai'
                                          ? Warna.accentGreen
                                          : tugasPribadi[index]["status"] ==
                                                  'Ditugaskan'
                                              ? Warna.accentYellow
                                              : Warna.accentRed,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Center(
                                      child:
                                          Text(tugasPribadi[index]["status"]!,
                                              style: GayaTeks.body.copyWith(
                                                color: Colors.white,
                                                fontSize: 8,
                                                fontWeight: FontWeight.bold,
                                              )),
                                    ),
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                        // Tombol
                        InkWell(
                          onTap: () {
                            laporanTugas(context);
                          },
                          child: Container(
                            width: MediaQuery.of(context).size.width - 60,
                            height: 30,
                            decoration: BoxDecoration(
                              color: Warna.blue4,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Center(
                              child: Text(
                                "Buat Laporan",
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              )),
        ],
      ),
    );
  }
}
