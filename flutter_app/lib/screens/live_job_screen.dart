import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/work_order_model.dart';
import 'package:intl/intl.dart';

class LiveJobScreen extends StatelessWidget {
  const LiveJobScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final model = context.watch<WorkOrderModel>();
    final completedCount = model.completedItems.length;
    final totalCount = model.checklistItems.length;
    final progress = totalCount > 0 ? completedCount / totalCount : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('LIVE JOB'),
        leading: IconButton(
          icon: const Icon(LucideIcons.home),
          onPressed: () {
            model.reset();
            Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF141414),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF333333)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.check, color: Colors.green),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Order Confirmed',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        Text(
                          model.selectedDate != null 
                              ? 'Scheduled for ${DateFormat('MMM d').format(model.selectedDate!)} at ${model.selectedTime}'
                              : 'Scheduled',
                          style: TextStyle(color: Colors.grey[500], fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Progress
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'JOB PROGRESS',
                  style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
                Text(
                  '${(progress * 100).toInt()}%',
                  style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: const Color(0xFF333333),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFF97316)),
                minHeight: 8,
              ),
            ),
            
            const SizedBox(height: 24),
            const Text(
              'TASKS',
              style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: ListView.builder(
                itemCount: model.checklistItems.length,
                itemBuilder: (context, index) {
                  final item = model.checklistItems[index];
                  final isCompleted = model.completedItems.contains(item);
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: GestureDetector(
                      onTap: () => model.toggleLiveItem(item),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isCompleted ? Colors.green.withOpacity(0.1) : const Color(0xFF111111),
                          border: Border.all(color: isCompleted ? Colors.green : const Color(0xFF333333)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: isCompleted ? Colors.green : null,
                                border: Border.all(color: isCompleted ? Colors.green : Colors.grey),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: isCompleted ? const Icon(LucideIcons.check, size: 14, color: Colors.white) : null,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              item,
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                decoration: isCompleted ? TextDecoration.lineThrough : null,
                                color: isCompleted ? Colors.grey : Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            
            Center(
              child: TextButton(
                onPressed: () {
                   model.reset();
                   Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
                },
                child: const Text('Start New Order', style: TextStyle(color: Colors.grey)),
              ),
            )
          ],
        ),
      ),
    );
  }
}
