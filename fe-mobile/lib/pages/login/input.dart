import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/login/verification.dart';

class Input extends StatelessWidget {
  const Input({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Stack(
          children: [
            // bg motif
            Container(
              width: double.infinity,
              height: MediaQuery.of(context).size.height * 0.75,
              color: Warna.blue4,
              child: Image.asset(
                'assets/gambar/bg.png',
                fit: BoxFit.fitWidth,
              ),
            ),
            Column(
              children: [
                // Logo
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 42),
                  child: Image.asset(
                    'assets/logo/keraton_surakarta.png',
                    width: 100,
                    height: 100,
                  ),
                ),
                // Form Login
                Container(
                  height: MediaQuery.of(context).size.height * 0.75,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(45),
                        topRight: Radius.circular(45)),
                  ),
                  child: Column(
                    children: [
                      // Judul
                      Container(
                        margin: EdgeInsets.only(
                            top: 38, bottom: 16, left: 68, right: 68),
                        child: Text('Maha Menteri Keraton Surakarta',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'Lato',
                            )),
                      ),
                      // Teks Instruksi
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 32.0),
                        child: Text(
                          "Masukkan email/nomor telepon anda yang terdaftar!",
                          style: GayaTeks.body.copyWith(
                              fontSize: 13,
                              color: Colors.black.withOpacity(0.7)),
                          textAlign: TextAlign.justify,
                        ),
                      ),
                      // Email/No Telepon
                      Container(
                        margin: EdgeInsets.only(left: 40, right: 40),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Email/No Telepon',
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
                      SizedBox(
                          height: MediaQuery.of(context).size.height * 0.03),
                      // tombol login
                      InkWell(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => Verification()));
                        },
                        child: Container(
                          margin: EdgeInsets.only(top: 24, left: 40, right: 40),
                          height: 50,
                          decoration: BoxDecoration(
                            color: Color.fromRGBO(236, 199, 58, 1),
                            borderRadius: BorderRadius.circular(36),
                          ),
                          child: Center(
                            child: Text('Kirim', style: GayaTeks.body.copyWith(color: Warna.darkBlue),),
                          ),
                        ),
                      ),
                      // Batal
                      Padding(
                        padding: const EdgeInsets.only(top: 16.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () {
                                Navigator.pop(context);
                              },
                              child: Text(
                                "Batal",
                                style: GayaTeks.body.copyWith(
                                  color: Colors.blue,
                                  decoration: TextDecoration.underline,
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
            )
          ],
        ),
      ),
    );
  }
}
