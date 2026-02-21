import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class BeastControlScreen extends StatefulWidget {
  const BeastControlScreen({super.key});

  @override
  State<BeastControlScreen> createState() => _BeastControlScreenState();
}

class _BeastControlScreenState extends State<BeastControlScreen> {
  final List<String> _systemLogs = [
    "System parity achieved.",
    "Beast Node active on primary cluster.",
    "Ready for deployment instructions.",
  ];

  void _addLog(String msg) {
    setState(() {
      _systemLogs.insert(
        0,
        "[${DateTime.now().toString().split(' ')[1].substring(0, 8)}] $msg",
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('BEAST CONTROL'), centerTitle: true),
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.center,
            radius: 1.5,
            colors: [const Color(0xFF1A1A1A), const Color(0xFF050505)],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // System Status Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF141414),
                  border: Border.all(
                    color: const Color(0xFFF97316).withOpacity(0.5),
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFF97316).withOpacity(0.1),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF97316).withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.zap,
                        color: Color(0xFFF97316),
                        size: 32,
                      ),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'THE BEAST',
                            style: TextStyle(
                              fontFamily: 'Orbitron',
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: 2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Colors.emeraldAccent,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'ACTIVE PARITY: 100%',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.emeraldAccent,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              const Text(
                'STRATEGIC STRIKES',
                style: TextStyle(
                  fontFamily: 'Orbitron',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),

              // Strike Grid
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.5,
                children: [
                  _StrikeButton(
                    icon: LucideIcons.search,
                    label: 'Trend Scout',
                    onTap: () => _addLog("Trend Scout strike initiated."),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.barChart,
                    label: 'SEO Monitor',
                    onTap: () => _addLog("SEO Monitoring active."),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.terminal,
                    label: 'System Status',
                    onTap: () => _addLog("Global system check performed."),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.shieldAlert,
                    label: 'Ghost Mode',
                    onTap: () => _addLog("Ghost Protocol engaged."),
                  ),
                ],
              ),

              const SizedBox(height: 30),

              const Text(
                'SYSTEM LOGS',
                style: TextStyle(
                  fontFamily: 'Orbitron',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),

              // Logs Area
              Expanded(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    border: Border.all(color: Colors.white10),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListView.builder(
                    itemCount: _systemLogs.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Text(
                          _systemLogs[index],
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: Color(0xFFD4D4D4),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StrikeButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _StrikeButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.white10),
            borderRadius: BorderRadius.circular(12),
            color: Colors.white.withOpacity(0.03),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: const Color(0xFFF97316), size: 28),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
