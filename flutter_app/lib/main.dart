import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'models/work_order_model.dart';
import 'screens/service_selection_screen.dart';
import 'screens/calendar_screen.dart';
import 'screens/details_screen.dart';
import 'screens/live_job_screen.dart';
import 'screens/beast_control_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Reserved for: await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => WorkOrderModel())],
      child: const WorkOrderApp(),
    ),
  );
}

class WorkOrderApp extends StatelessWidget {
  const WorkOrderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Work Order App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF050505),
        primaryColor: const Color(0xFFF97316),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFF97316), // Orange
          secondary: Color(0xFF8B5CF6), // Violet
          surface: Color(0xFF141414),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0A0A0A),
          elevation: 0,
          titleTextStyle: TextStyle(
            fontFamily: 'Orbitron',
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFFF97316),
          ),
        ),
        textTheme: const TextTheme(
          bodyMedium: TextStyle(
            fontFamily: 'Rajdhani',
            color: Color(0xFFD4D4D4),
          ),
          titleLarge: TextStyle(
            fontFamily: 'Orbitron',
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const ServiceSelectionScreen(),
        '/calendar': (context) => const CalendarScreen(),
        '/details': (context) => const DetailsScreen(),
        '/live': (context) => const LiveJobScreen(),
        '/beast': (context) => const BeastControlScreen(),
      },
    );
  }
}
