import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/work_order_model.dart';

class ServiceSelectionScreen extends StatelessWidget {
  const ServiceSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WORK ORDER'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Text(
                'V1.0.0',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: Colors.grey[600],
                ),
              ),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Service',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              'Choose the type of work you need assistance with.',
              style: TextStyle(color: Colors.grey[500]),
            ),
            const SizedBox(height: 30),
            Expanded(
              child: ListView(
                children: [
                  _ServiceCard(
                    icon: LucideIcons.dog,
                    title: 'Pet Services',
                    subtitle: 'Walking, Sitting, Grooming',
                    color: Colors.orange,
                    onTap: () {
                      context.read<WorkOrderModel>().selectService(ServiceType.pet);
                      Navigator.pushNamed(context, '/calendar');
                    },
                  ),
                  const SizedBox(height: 16),
                  _ServiceCard(
                    icon: LucideIcons.trash2,
                    title: 'Junk Removal',
                    subtitle: 'Hauling, Moving, Disposal',
                    color: Colors.blue,
                    onTap: () {
                      context.read<WorkOrderModel>().selectService(ServiceType.junk);
                      Navigator.pushNamed(context, '/calendar');
                    },
                  ),
                  const SizedBox(height: 16),
                  _ServiceCard(
                    icon: LucideIcons.sparkles,
                    title: 'Cleaning Services',
                    subtitle: 'Residential & Commercial',
                    color: Colors.green,
                    onTap: () {
                      context.read<WorkOrderModel>().selectService(ServiceType.cleaning);
                      Navigator.pushNamed(context, '/calendar');
                    },
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

class _ServiceCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ServiceCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF141414).withOpacity(0.6),
          border: Border.all(color: const Color(0xFF333333)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[400],
                    ),
                  ),
                ],
              ),
            ),
            Icon(LucideIcons.chevronRight, color: Colors.grey[600]),
          ],
        ),
      ),
    );
  }
}
