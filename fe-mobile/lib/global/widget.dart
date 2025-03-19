import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:iconify_flutter/icons/material_symbols.dart';

class TopBar extends StatelessWidget implements PreferredSize {
  const TopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      Container(
        width: double.infinity,
        color: Warna.blue4,
        child: Image.asset(
          'assets/gambar/bg.png',
          fit: BoxFit.cover,
        ),
      ),
      Container(
          width: double.infinity,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              // Gambar
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 30, 10, 10),
                child: Image.asset(
                  'assets/logo/keraton_surakarta.png',
                  width: 80,
                  height: 80,
                ),
              ),
              // Text dan Nama
              Container(
                margin: EdgeInsets.only(top: 40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Sugeng Rawuh",
                      style: GayaTeks.heading.copyWith(
                          color: Warna.accentYellow,
                          fontWeight: FontWeight.bold,
                          fontSize: 22),
                    ),
                    Text(
                      detailUser['nama']!,
                      style: GayaTeks.body.copyWith(
                          color: Warna.accentYellow,
                          fontWeight: FontWeight.bold,
                          fontSize: 14),
                    )
                  ],
                ),
              ),
              // Notifikasi
              Spacer(),
              Padding(
                padding: EdgeInsets.fromLTRB(0, 36, 20, 0),
                child: Iconify(
                  MaterialSymbols.notifications_outline,
                  color: Warna.accentYellow,
                  size: 32,
                ),
              ),
            ],
          )),
    ]);
  }

  @override
  Size get preferredSize => const Size.fromHeight(80);

  @override
  Widget get child => throw UnimplementedError();
}

class Footer extends StatefulWidget {
  const Footer({super.key});

  @override
  State<Footer> createState() => _FooterState();
}

class _FooterState extends State<Footer> {
  bool selected = true;
  int _currIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      color: Warna.blue4,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(Icons.home, 0),
          _buildNavItem(Icons.calendar_month_outlined, 1),
          _buildNavItem(Icons.qr_code_scanner_outlined, 2),
          _buildNavItem(Icons.notifications_none_outlined, 3),
          _buildNavItem(Icons.person_2_outlined, 4),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, int index) {
    bool isSelected = _currIndex == index;

    return GestureDetector(
      onTap: () {
        setState(() {
          _currIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: Duration(milliseconds: 300),
        padding: EdgeInsets.all(6),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isSelected ? Warna.accentYellow : Colors.transparent,
        ),
        child: TweenAnimationBuilder(
          duration: Duration(milliseconds: 300),
          tween: Tween<double>(begin: 1.0, end: isSelected ? 1.2 : 1.0),
          builder: (context, double scale, child) {
            return Transform.scale(
              scale: scale,
              child: Icon(
                icon,
                color: isSelected ? Warna.blue4 : Colors.white,
              ),
            );
          },
        ),
      ),
    );
  }
}

class LahanTeks {
  static Widget lahanBerjudul(BuildContext context, String judul, Map<String, String> map, String api) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Text(
            judul,
            style: GayaTeks.body,
          ),
        ),
        Container(
          width: screenWidth(context) * 0.8,
          height: 40,
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                map[api]!,
                style: GayaTeks.body,
              ),
            ),
          ),
        ),
      ],
    );
  }

  static Widget input(String teks) {
    return Text(
      teks,
      style: GayaTeks.body.copyWith(
        color: Warna.darkBlue,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  static Widget teksteks(String teks) {
    return Text(
      teks,
      style: GayaTeks.body.copyWith(
        color: Warna.darkBlue,
      ),
    );
  }
}
