import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/pages/login/changePassword.dart';

class Verification extends StatefulWidget {
  const Verification({super.key});

  @override
  State<Verification> createState() => _VerificationState();
}

class _VerificationState extends State<Verification> {
  int waktu = 5;

  Timer? _timer;

  void countDown() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (waktu == 0) {
        timer.cancel();
      } else {
        if (mounted) {
          setState(() {
            waktu--;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    countDown();
  }

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
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: 32),
                      ),
                      // 6 Kotak Input
                      Form(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              height: 68,
                              width: 48,
                              child: TextFormField(
                                style: Theme.of(context).textTheme.titleLarge,
                                onChanged: (value) {
                                  if (value.length == 1) {
                                    FocusScope.of(context).nextFocus();
                                  }
                                },
                                keyboardType: TextInputType.number,
                                textAlign: TextAlign.center,
                                inputFormatters: [
                                  LengthLimitingTextInputFormatter(1),
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Kirim Ulang Code
                      Padding(
                          padding: const EdgeInsets.symmetric(vertical: 32.0),
                          child: waktu > 0
                              ? Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      "Kirim ulang code dalam ",
                                      style: GayaTeks.body
                                          .copyWith(color: Colors.black),
                                      textAlign: TextAlign.justify,
                                    ),
                                    Text(
                                      "$waktu",
                                      style: GayaTeks.body.copyWith(
                                          color: Colors.blue,
                                          decoration: TextDecoration.underline),
                                    )
                                  ],
                                )
                              : GestureDetector(
                                  onTap: () {
                                    waktu = 6;
                                  },
                                  child: SizedBox(
                                    height: 30,
                                    child: Text(
                                      "Klik untuk kirim ulang",
                                      style: GayaTeks.body.copyWith(
                                          color: Colors.blue,
                                          decoration: TextDecoration.underline),
                                    ),
                                  ),
                                )),
                      SizedBox(
                          height: MediaQuery.of(context).size.height * 0.03),
                      // Tombol Konfirmasi
                      InkWell(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Changepassword()));
                        },
                        child: Container(
                          margin: EdgeInsets.only(top: 24, left: 40, right: 40),
                          height: 50,
                          decoration: BoxDecoration(
                            color: Color.fromRGBO(236, 199, 58, 1),
                            borderRadius: BorderRadius.circular(36),
                          ),
                          child: Center(
                            child: Text(
                              'Konfirmasi',
                              style:
                                  GayaTeks.body.copyWith(color: Warna.darkBlue),
                            ),
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
