import 'package:flutter/material.dart';
import 'package:marsi_mobile/pages/acara/acara.dart';
import 'package:marsi_mobile/pages/chat.dart';
import 'package:marsi_mobile/pages/home/home.dart';
import 'package:marsi_mobile/pages/profil.dart';
import 'package:marsi_mobile/pages/situs/situs.dart';

List<Widget> screens = [
  Homescreen(),
  Acara(),
  Situs(),
  Chat(),
  Profil(),
];

int screenIndex = 0;
Widget screen = Homescreen();