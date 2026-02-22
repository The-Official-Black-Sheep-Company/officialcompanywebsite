import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/beast_api_service.dart';

class BeastControlScreen extends StatefulWidget {
  const BeastControlScreen({super.key});

  @override
  State<BeastControlScreen> createState() => _BeastControlScreenState();
}

class _BeastControlScreenState extends State<BeastControlScreen> {
  final BeastApiService _apiService = BeastApiService();
  final List<String> _systemLogs = [
    "System parity achieved.",
    "Beast Node active on primary cluster.",
    "Ready for deployment instructions.",
  ];

  void _addLog(String msg) {
    if (mounted) {
      setState(() {
        _systemLogs.insert(
          0,
          "[${DateTime.now().toString().split(' ')[1].substring(0, 8)}] $msg",
        );
      });
    }
  }

  Future<void> _handleStrike(
    String label,
    Future<Map<String, dynamic>> Function() action,
  ) async {
    _addLog("Initiating $label strike...");
    final result = await action();
    _addLog(result['message']);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('BEAST CONTROL'), centerTitle: true),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.center,
            radius: 1.5,
            colors: [Color(0xFF1A1A1A), Color(0xFF050505)],
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
                    onTap: () =>
                        _handleStrike('Trend Scout', _apiService.triggerScout),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.barChart,
                    label: 'SEO Monitor',
                    onTap: () async {
                      _addLog("SEO Monitoring active on primary target.");
                      final result = await _apiService.triggerSeo(
                        "https://theofficialblacksheepcompany.com",
                      );
                      _addLog(result['message']);
                    },
                  ),
                  _StrikeButton(
                    icon: LucideIcons.activity,
                    label: 'Health Check',
                    onTap: () =>
                        _handleStrike('Health Check', _apiService.checkHealth),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.qrCode,
                    label: 'Scan Product',
                    onTap: () =>
                        _handleStrike('Barcode Scan', _apiService.triggerScan),
                  ),
                  _StrikeButton(
                    icon: LucideIcons.shieldAlert,
                    label: 'Ghost Mode',
                    onTap: () {
                      _addLog("Ghost Protocol engaged.");
                      _apiService.sendVoice(
                        "🔴 GHOST PROTOCOL ENGAGED FROM MOBILE.",
                      );
                    },
                  ),
                ],
              ),

              const SizedBox(height: 30),

              const Text(
                'TACTICAL PRESENCE',
                style: TextStyle(
                  fontFamily: 'Orbitron',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _PresenceButton(
                      icon: LucideIcons.video,
                      label: 'Video Chat',
                      color: const Color(0xFF8B5CF6), // Violet
                      onTap: () => _addLog("Video link established."),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _PresenceButton(
                      icon: LucideIcons.monitor,
                      label: 'Screen Share',
                      color: const Color(0xFF06B6D4), // Cyan
                      onTap: () => _addLog("Screen sharing initiated."),
                    ),
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

class _PresenceButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _PresenceButton({
    required this.icon,
    required this.label,
    required this.color,
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
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            border: Border.all(color: color.withOpacity(0.3)),
            borderRadius: BorderRadius.circular(12),
            color: color.withOpacity(0.05),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 28),
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
