import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import { ExpenseCardProps, ExpenseCategory } from '../types';

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onPress, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const handleDelete = (): void => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(expense.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const formatAmount = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const getCategoryIcon = (category: ExpenseCategory): string => {
    const iconMap: Record<ExpenseCategory, string> = {
      'Food & Dining': 'restaurant',
      'Transportation': 'directions-car',
      'Shopping': 'shopping-cart',
      'Entertainment': 'movie',
      'Bills & Utilities': 'receipt',
      'Healthcare': 'local-hospital',
      'Travel': 'flight',
      'Education': 'school',
      'Personal Care': 'face',
      'Others': 'category',
    };
    return iconMap[category] || 'category';
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colorMap: Record<ExpenseCategory, string> = {
      'Food & Dining': '#f59e0b',
      'Transportation': '#3b82f6',
      'Shopping': '#ec4899',
      'Entertainment': '#8b5cf6',
      'Bills & Utilities': '#ef4444',
      'Healthcare': '#10b981',
      'Travel': '#06b6d4',
      'Education': '#6366f1',
      'Personal Care': '#f97316',
      'Others': '#6b7280',
    };
    return colorMap[category] || '#6b7280';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(expense)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: getCategoryColor(expense.category) + '20' }
            ]}
          >
            <Icon
              name={getCategoryIcon(expense.category)}
              size={24}
              color={getCategoryColor(expense.category)}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {expense.title || expense.description || 'No Description'}
            </Text>
            <Text style={styles.category}>{expense.category}</Text>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
          <Text style={styles.date}>{formatDate(expense.date || expense.createdAt)}</Text>
        </View>
      </View>

      {expense.description && expense.title !== expense.description && (
        <Text style={styles.description} numberOfLines={2}>
          {expense.description}
        </Text>
      )}

      {expense.merchant && (
        <View style={styles.merchantContainer}>
          <Icon name="store" size={16} color={COLORS.gray} />
          <Text style={styles.merchant}>{expense.merchant}</Text>
        </View>
      )}

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit?.(expense)}
          >
            <Icon name="edit" size={16} color={COLORS.primary} />
            <Text style={[styles.actionText, styles.editText]}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="delete" size={16} color={COLORS.error} />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  } as ViewStyle,
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  } as ViewStyle,
  titleContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  } as TextStyle,
  category: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
  } as TextStyle,
  amountContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  amount: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  } as TextStyle,
  date: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
  } as TextStyle,
  description: {
    fontSize: FONTS.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  } as TextStyle,
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  merchant: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  } as TextStyle,
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.sm,
  } as ViewStyle,
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 6,
    marginLeft: SPACING.sm,
  } as ViewStyle,
  editButton: {
    backgroundColor: COLORS.primary + '15',
  } as ViewStyle,
  deleteButton: {
    backgroundColor: COLORS.error + '15',
  } as ViewStyle,
  actionText: {
    fontSize: FONTS.small,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  } as TextStyle,
  editText: {
    color: COLORS.primary,
  } as TextStyle,
  deleteText: {
    color: COLORS.error,
  } as TextStyle,
});

export default ExpenseCard; 