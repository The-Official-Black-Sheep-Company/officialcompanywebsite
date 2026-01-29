import 'package:flutter/foundation.dart';

enum ServiceType { pet, junk, cleaning }

class WorkOrderModel extends ChangeNotifier {
  ServiceType? _selectedService;
  DateTime? _selectedDate;
  String? _selectedTime;
  List<String> _checklistItems = [];
  List<String> _completedItems = [];
  bool _isLive = false;

  // Getters
  ServiceType? get selectedService => _selectedService;
  DateTime? get selectedDate => _selectedDate;
  String? get selectedTime => _selectedTime;
  List<String> get checklistItems => _checklistItems;
  List<String> get completedItems => _completedItems;
  bool get isLive => _isLive;

  // Checklist Data
  final Map<ServiceType, List<String>> _checklistData = {
    ServiceType.pet: ['Husky', 'Pitbull', 'German Shepherd', 'Feeding', 'Walk (30m)', 'Medication'],
    ServiceType.junk: ['Mattress', 'Couch', 'Dresser', 'Appliances', 'Construction Debris', 'Yard Waste'],
    ServiceType.cleaning: ['Living Room', 'Kitchen Deep Clean', 'Bathrooms', 'Windows', 'Carpets', 'Sanitization'],
  };

  List<String> get availableChecklistItems => 
      _selectedService != null ? _checklistData[_selectedService!]! : [];

  // Setters / Actions
  void selectService(ServiceType type) {
    _selectedService = type;
    _checklistItems.clear(); // Reset checklist when switching service
    notifyListeners();
  }

  void selectDateTime(DateTime date, String time) {
    _selectedDate = date;
    _selectedTime = time;
    notifyListeners();
  }

  void toggleChecklistItem(String item) {
    if (_checklistItems.contains(item)) {
      _checklistItems.remove(item);
    } else {
      _checklistItems.add(item);
    }
    notifyListeners();
  }

  void submitOrder() {
    _isLive = true;
    _completedItems.clear();
    print("Submitting Order: $_selectedService on $_selectedDate at $_selectedTime");
    // Mock API call here
    notifyListeners();
  }

  void toggleLiveItem(String item) {
    if (_completedItems.contains(item)) {
      _completedItems.remove(item);
    } else {
      _completedItems.add(item);
    }
    notifyListeners();
  }
 
  void reset() {
    _selectedService = null;
    _selectedDate = null;
    _selectedTime = null;
    _checklistItems = [];
    _completedItems = [];
    _isLive = false;
    notifyListeners();
  }
}
