import 'package:flutter/material.dart';
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:iconify_flutter/icons/mdi.dart';
import 'package:iconify_flutter/icons/material_symbols.dart';
import 'package:marsi_mobile/global/assets.dart';
import 'package:marsi_mobile/global/widget.dart';
import 'package:marsi_mobile/pages/acara/acara.dart';
import 'package:marsi_mobile/pages/chat.dart';
import 'package:marsi_mobile/pages/home/home.dart';
import 'package:marsi_mobile/pages/login/login.dart';
import 'package:marsi_mobile/pages/profile/profil.dart';
import 'package:marsi_mobile/pages/situs/situs.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() {
  initializeDateFormatting().then((_) => runApp(const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: false),
      debugShowCheckedModeBanner: false,
      home: Login(),
    );
  }
}

class Main extends StatefulWidget {
  const Main({super.key});

  @override
  State<Main> createState() => _MainState();
}

class _MainState extends State<Main> {
  int currentIndex = 0;
  List<Widget> screens = [
    Homescreen(),
    Acara(),
    Situs(),
    Chat(),
    Profil(),
  ];

  Widget _buildNavItem(String icon, int index) {
    bool isSelected = currentIndex == index;

    return GestureDetector(
      onTap: () {
        setState(() {
          currentIndex = index;
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
              child: Iconify(
                icon,
                color: isSelected ? Warna.blue4 : Colors.white,
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopBar(),
      body: screens[currentIndex],
      bottomNavigationBar: Container(
        height: 60,
        color: Warna.blue4,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildNavItem(MaterialSymbols.home_outline_rounded, 0),
            _buildNavItem(Mdi.calendar_outline, 1),
            _buildNavItem(MaterialSymbols.castle_outline, 2),
            _buildNavItem(Mdi.message_outline, 3),
            _buildNavItem(Mdi.user_circle_outline, 4),
          ],
        ),
      ),
    );
  }
}
