import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginCont {
  static String? token;
  Future<bool> login({
    required String username,
    required String password,
  }) async {
    try {
      var response = await http.post(
        Uri.parse("url buat login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "password": password,
        }),
      );
      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}