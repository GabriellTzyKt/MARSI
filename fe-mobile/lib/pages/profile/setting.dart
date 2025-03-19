import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:iconify_flutter/icons/material_symbols.dart';
import 'package:iconify_flutter/icons/mdi.dart';
import 'package:marsi_mobile/pages/profile/editProfil.dart';
import '../login/login.dart';

class Setting extends StatelessWidget {
  const Setting({super.key});

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
          'Pengaturan',
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Ubah profil
            Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Text(
                "Akun",
                style: GayaTeks.body.copyWith(
                    color: Warna.darkBlue, fontWeight: FontWeight.bold),
              ),
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => Editprofil()));
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Icon Dan Tekt
                  Row(
                    children: [
                      Iconify(
                        Mdi.person_edit,
                        color: Warna.darkBlue,
                        size: 28,
                      ),
                      Padding(padding: EdgeInsets.symmetric(horizontal: 8)),
                      Text(
                        "Ubah Profil",
                        style: GayaTeks.body.copyWith(color: Warna.darkBlue),
                      ),
                    ],
                  ),
                  // Panah kanan
                  Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: Warna.darkBlue,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: GestureDetector(
        onTap: () {
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => Login()));
        },
        child: Container(
          margin: EdgeInsets.all(24),
          width: MediaQuery.of(context).size.width * 0.8,
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(26),
            color: Warna.accentRed,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Iconify(MaterialSymbols.logout, color: Colors.white, size: 24),
              Text(
                "Logout",
                style: GayaTeks.body.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
