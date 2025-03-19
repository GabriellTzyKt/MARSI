import 'package:flutter/material.dart';
import 'package:marsi_mobile/global/assets.dart';

class Chat extends StatefulWidget {
  const Chat({super.key});

  @override
  State<Chat> createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: DefaultTabController(
        length: 2,
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.only(top: 16),
            ),
            TabBar(
              labelColor: Warna.darkBlue,
              indicatorColor: Warna.darkBlue,
              unselectedLabelColor: Colors.grey,
              tabs: [
                Tab(
                  text: 'Forum',
                ),
                Tab(
                  text: 'Grup',
                ),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  Container(
                    child: Center(
                      child: Text('Forum'),
                    ),
                  ),
                  Container(
                    child: Center(
                      child: Text('Grup'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
