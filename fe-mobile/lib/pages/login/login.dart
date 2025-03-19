import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/main.dart';
import 'package:marsi_mobile/pages/login/input.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool isHidden = true;

  void toggleVisibility() {
    setState(() {
      isHidden = !isHidden;
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
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
                            top: 38, bottom: 64, left: 68, right: 68),
                        child: Text('Maha Menteri Keraton Surakarta',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'Lato',
                            )),
                      ),
                      // Username
                      Container(
                        margin: EdgeInsets.only(left: 40, right: 40),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Username',
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
                      SizedBox(height: screenHeight * 0.03),
                      // Password
                      Container(
                        margin: EdgeInsets.only(left: 40, right: 40),
                        child: TextFormField(
                          obscureText: isHidden,
                          decoration: InputDecoration(
                            suffixIcon: IconButton(
                                onPressed: toggleVisibility,
                                icon: Icon(isHidden
                                    ? Icons.visibility_off
                                    : Icons.visibility)),
                            labelText: 'Password',
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
                      // tombol login
                      InkWell(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) => Main()));
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
                              'Masuk',
                              style:
                                  GayaTeks.body.copyWith(color: Warna.darkBlue),
                            ),
                          ),
                        ),
                      ),
                      // text "bikin akun"
                      Padding(
                        padding: const EdgeInsets.only(top: 16.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Lupa password? ', style: GayaTeks.body),
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => Input(),
                                  ),
                                );
                              },
                              child: Text(
                                "Klik di sini",
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
