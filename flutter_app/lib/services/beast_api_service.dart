import 'dart:convert';
import 'package:http/http.dart' as http;

class BeastApiService {
  static const String handsUrl = 'https://beast-hands.fly.dev';
  static const String voiceUrl = 'https://beast-openclaw.fly.dev';

  Future<Map<String, dynamic>> triggerScout() async {
    try {
      final response = await http.post(Uri.parse('$handsUrl/scout'));
      return {
        'success': response.statusCode == 200,
        'message': jsonDecode(response.body)['message'] ?? 'Scout initiated.',
      };
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> triggerSeo(String url) async {
    try {
      final response = await http.post(
        Uri.parse('$handsUrl/seo'),
        body: jsonEncode({'url': url}),
        headers: {'Content-Type': 'application/json'},
      );
      return {
        'success': response.statusCode == 200,
        'message':
            jsonDecode(response.body)['message'] ?? 'SEO Monitor started.',
      };
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http.post(Uri.parse('$handsUrl/health'));
      return {
        'success': response.statusCode == 200,
        'message':
            jsonDecode(response.body)['message'] ?? 'Health check active.',
      };
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> sendVoice(
    String msg, {
    String channel = 'matrix',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$voiceUrl/send'),
        body: jsonEncode({'text': msg, 'channel': channel, 'priority': 'high'}),
        headers: {'Content-Type': 'application/json'},
      );
      return {
        'success': response.statusCode == 200,
        'message': 'Voice strike: ${response.statusCode}',
      };
    } catch (e) {
      return {'success': false, 'message': 'Voice error: $e'};
    }
  }
}
