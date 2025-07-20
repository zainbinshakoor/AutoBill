import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { imageService } from '../services/imageService';
import { validateAmount, validateDescription, validateRequired } from '../utils/validation';
import { COLORS, FONTS, SPACING, EXPENSE_CATEGORIES } from '../utils/constants';
import { CameraScreenProps, ExpenseFormData, ExpenseCategory, Expense } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation, route }) => {
  const { uploadExpenseImage, addExpense, updateExpense, loading } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    description: '',
    amount: '',
    category: 'Others',
    merchant: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // If editing existing expense
  useEffect(() => {
    if (route.params?.expense) {
      const expense = route.params.expense;
      setIsEditing(true);
      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'Others',
        merchant: expense.merchant || '',
        date: expense.date || new Date().toISOString().split('T')[0],
      });
      if (expense.imageUrl) {
        setSelectedImage(expense.imageUrl);
      }
    }
  }, [route.params]);

  const handleImageSelection = async (): Promise<void> => {
    try {
      const imageData = await imageService.showImagePicker();
      
      // Validate image
      imageService.validateImage(imageData);
      
      setSelectedImage(imageData.uri);
      
      // Extract data from image
      await extractDataFromImage(imageData.uri);
    } catch (error: any) {
      if (error.message !== 'User cancelled') {
        Alert.alert('Error', error.message);
      }
    }
  };

  const extractDataFromImage = async (imageUri: string): Promise<void> => {
    setIsProcessing(true);
    try {
      const result = await uploadExpenseImage(imageUri);
      
      if (result.success && result.extractedData) {
        setExtractedData(result.extractedData);
        
        // Pre-fill form with extracted data
        setFormData(prev => ({
          ...prev,
          title: result.extractedData?.title || prev.title,
          description: result.extractedData?.description || prev.description,
          amount: result.extractedData?.amount?.toString() || prev.amount,
          merchant: result.extractedData?.merchant || prev.merchant,
          category: result.extractedData?.category || prev.category,
          date: result.extractedData?.date || prev.date,
        }));
        
        Alert.alert(
          'Success!', 
          'Expense data extracted from image. Please review and confirm the details.'
        );
      } else {
        Alert.alert('Processing Failed', result.error || 'Could not extract data from image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    
    const titleError = validateRequired(formData.title, 'Title');
    if (titleError) newErrors.title = titleError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;
    
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;
    
    const categoryError = validateRequired(formData.category, 'Category');
    if (categoryError) newErrors.category = categoryError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveExpense = async (): Promise<void> => {
    if (!validateForm()) return;
    
    const expenseData = {
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category as ExpenseCategory,
      merchant: formData.merchant,
      date: formData.date,
      imageUrl: selectedImage || undefined,
      extractedData: extractedData,
    };
    
    try {
      let result;
      if (isEditing && route.params?.expense) {
        result = await updateExpense(route.params.expense.id, expenseData);
      } else {
        result = await addExpense(expenseData);
      }
      
      if (result.success) {
        Alert.alert(
          'Success', 
          isEditing ? 'Expense updated successfully!' : 'Expense added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to save expense');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleCategorySelect = (category: ExpenseCategory): void => {
    handleInputChange('category', category);
    setShowCategoryPicker(false);
  };

  const renderCategoryPicker = () => (
    <View style={styles.categoryPicker}>
      <Text style={styles.categoryPickerTitle}>Select Category</Text>
      <ScrollView style={styles.categoryList}>
        {EXPENSE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              formData.category === category && styles.selectedCategoryItem,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryText,
                formData.category === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        title="Cancel"
        variant="outline"
        onPress={() => setShowCategoryPicker(false)}
        style={styles.cancelButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.processingText}>Processing image...</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={handleImageSelection}
              >
                <Icon name="edit" size={20} color={COLORS.primary} />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={handleImageSelection}
            >
              <Icon name="camera-alt" size={48} color={COLORS.gray} />
              <Text style={styles.imagePlaceholderText}>
                Tap to capture or select receipt image
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Expense Details</Text>
          
          <Input
            label="Title"
            placeholder="Enter expense title"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            error={errors.title}
            required
          />

          <Input
            label="Description"
            placeholder="Enter expense description"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          <Input
            label="Amount"
            placeholder="0.00"
            value={formData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            keyboardType="numeric"
            error={errors.amount}
            leftIcon={<Text style={styles.currencySymbol}>$</Text>}
            required
          />

          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.categoryLabel}>Category *</Text>
            <View style={styles.categoryValue}>
              <Text style={styles.categoryText}>{formData.category}</Text>
              <Icon name="keyboard-arrow-down" size={24} color={COLORS.gray} />
            </View>
          </TouchableOpacity>

          <Input
            label="Merchant (Optional)"
            placeholder="Store or merchant name"
            value={formData.merchant}
            onChangeText={(value) => handleInputChange('merchant', value)}
          />

          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(value) => handleInputChange('date', value)}
            keyboardType="numeric"
          />

          {extractedData && (
            <View style={styles.extractedDataInfo}>
              <Icon name="smart-toy" size={16} color={COLORS.primary} />
              <Text style={styles.extractedDataText}>
                Data extracted from image and pre-filled
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title={isEditing ? "Update Expense" : "Save Expense"}
            onPress={handleSaveExpense}
            loading={loading}
            style={styles.saveButton}
          />
          
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderCategoryPicker()}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  imageSection: {
    marginVertical: SPACING.lg,
  } as ViewStyle,
  imageContainer: {
    position: 'relative',
  } as ViewStyle,
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  } as ImageStyle,
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  } as ViewStyle,
  processingText: {
    color: COLORS.white,
    marginTop: SPACING.sm,
    fontSize: FONTS.medium,
  } as TextStyle,
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
  } as ViewStyle,
  changeImageText: {
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontSize: FONTS.medium,
    fontWeight: '500',
  } as TextStyle,
  imagePlaceholder: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  imagePlaceholderText: {
    color: COLORS.gray,
    fontSize: FONTS.medium,
    marginTop: SPACING.md,
    textAlign: 'center',
  } as TextStyle,
  formSection: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  } as TextStyle,
  currencySymbol: {
    fontSize: FONTS.medium,
    color: COLORS.gray,
  } as TextStyle,
  categorySelector: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  categoryLabel: {
    fontSize: FONTS.medium,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  } as TextStyle,
  categoryValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  } as ViewStyle,
  categoryText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  } as TextStyle,
  extractedDataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  } as ViewStyle,
  extractedDataText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  } as TextStyle,
  actionSection: {
    paddingBottom: SPACING.xl,
  } as ViewStyle,
  saveButton: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  cancelButton: {
    marginTop: SPACING.sm,
  } as ViewStyle,
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    width: '90%',
    maxHeight: '70%',
  } as ViewStyle,
  categoryPicker: {
    maxHeight: 400,
  } as ViewStyle,
  categoryPickerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  } as TextStyle,
  categoryList: {
    maxHeight: 300,
  } as ViewStyle,
  categoryItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  } as ViewStyle,
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: '600',
  } as TextStyle,
});

export default CameraScreen;