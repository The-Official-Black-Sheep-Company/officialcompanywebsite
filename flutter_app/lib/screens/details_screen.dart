import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../models/work_order_model.dart';

class DetailsScreen extends StatefulWidget {
  const DetailsScreen({super.key});

  @override
  State<DetailsScreen> createState() => _DetailsScreenState();
}

class _DetailsScreenState extends State<DetailsScreen> {
  final ImagePicker _picker = ImagePicker();
  List<XFile> _images = [];

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        setState(() {
          _images.add(image);
        });
      }
    } catch (e) {
      // Handle error or permission denial
      print('Error picking image: $e');
    }
  }
  
  // Note: For real apps, you'd want to request permissions.
  // We're keeping it simple for this implementation.

  @override
  Widget build(BuildContext context) {
    final model = context.watch<WorkOrderModel>();
    final items = model.availableChecklistItems;

    return Scaffold(
      appBar: AppBar(title: const Text('DETAILS')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Job Details',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              'Upload photos and specify items.',
              style: TextStyle(color: Colors.grey[500]),
            ),
            const SizedBox(height: 20),

            // Photo Upload Area
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 120,
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFF444444), style: BorderStyle.solid), // Dashed border needs custom painter, simple solid for now
                  borderRadius: BorderRadius.circular(12),
                  color: const Color(0xFF111111),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(LucideIcons.camera, size: 32, color: Colors.grey),
                    const SizedBox(height: 8),
                    Text('Tap to upload photo', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Image Preview (Horizontal Scroll)
            if (_images.isNotEmpty)
              SizedBox(
                height: 80,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _images.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.file(
                          File(_images[index].path),
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                        ),
                      ),
                    );
                  },
                ),
              ),

            const SizedBox(height: 24),
            Text('CHECKLIST', style: TextStyle(color: Colors.grey[400], fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
            const SizedBox(height: 12),
            
            Expanded(
              child: ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  final isChecked = model.checklistItems.contains(item);
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: GestureDetector(
                      onTap: () => model.toggleChecklistItem(item),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isChecked ? const Color(0xFFF97316).withOpacity(0.1) : Colors.transparent,
                          border: Border.all(color: isChecked ? const Color(0xFFF97316) : const Color(0xFF333333)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: isChecked ? const Color(0xFFF97316) : null,
                                border: Border.all(color: isChecked ? const Color(0xFFF97316) : Colors.grey),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: isChecked ? const Icon(LucideIcons.check, size: 14, color: Colors.white) : null,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              item,
                              style: const TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  model.submitOrder();
                  Navigator.pushNamedAndRemoveUntil(context, '/live', (route) => false);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF97316),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('SUBMIT WORK ORDER', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
