import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import { HomeScreenProps, Expense } from '../types';
import ExpenseCard from '../components/ExpenseCard';
import Button from '../components/Button';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { 
    user, 
    expenses, 
    loading, 
    refreshExpenses, 
    deleteExpense, 
    getTotalExpenses,
    logout 
  } = useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async (): Promise<void> => {
    await refreshExpenses();
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refreshExpenses();
    setRefreshing(false);
  };

  const handleAddExpense = (): void => {
    navigation.navigate('Camera');
  };

  const handleExpensePress = (expense: Expense): void => {
    // Navigate to expense detail screen (you can implement this later)
    Alert.alert('Expense Details', `Title: ${expense.title}\nAmount: $${expense.amount}\nCategory: ${expense.category}`);
  };

  const handleEditExpense = (expense: Expense): void => {
    // Navigate to edit expense screen
    navigation.navigate('Camera', { expense });
  };

  const handleDeleteExpense = async (expenseId: string): Promise<void> => {
    const result = await deleteExpense(expenseId);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to delete expense');
    }
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  const getCurrentMonthExpenses = (): Expense[] => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  };

  const renderExpenseCard = ({ item }: { item: Expense }) => (
    <ExpenseCard
      expense={item}
      onPress={() => handleExpensePress(item)}
      onEdit={handleEditExpense}
      onDelete={handleDeleteExpense}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="receipt-long" size={80} color={COLORS.lightGray} />
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your expenses by adding your first receipt
      </Text>
      <Button
        title="Add Your First Expense"
        onPress={handleAddExpense}
        style={styles.emptyButton}
      />
    </View>
  );

  const renderHeader = () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    const currentMonthTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);

    return (
      <View style={styles.header}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryAmount}>
                ${getTotalExpenses().toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>This Month</Text>
              <Text style={styles.summaryCount}>
                ${currentMonthTotal.toFixed(2)}
              </Text>
              <Text style={styles.summarySubtext}>
                {currentMonthExpenses.length} {currentMonthExpenses.length === 1 ? 'expense' : 'expenses'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryActionButton}
            onPress={handleAddExpense}
          >
            <Icon name="camera-alt" size={24} color={COLORS.white} />
            <Text style={styles.primaryActionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        {expenses.length > 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderExpenseCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={expenses.length === 0 ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  listContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.lg,
  } as ViewStyle,
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  } as ViewStyle,
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.md,
  } as ViewStyle,
  greeting: {
    fontSize: FONTS.medium,
    color: COLORS.textLight,
  } as TextStyle,
  userName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
  } as TextStyle,
  logoutButton: {
    padding: SPACING.sm,
  } as ViewStyle,
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  summaryItem: {
    flex: 1,
  } as ViewStyle,
  summaryLabel: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  } as TextStyle,
  summaryAmount: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  } as TextStyle,
  summaryCount: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
  } as TextStyle,
  summarySubtext: {
    fontSize: FONTS.small,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  } as TextStyle,
  actionButtons: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  primaryActionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,
  primaryActionText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  } as TextStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
  } as TextStyle,
  seeAllText: {
    fontSize: FONTS.medium,
    color: COLORS.primary,
    fontWeight: '500',
  } as TextStyle,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  } as ViewStyle,
  emptyTitle: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  } as TextStyle,
  emptySubtitle: {
    fontSize: FONTS.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  } as TextStyle,
  emptyButton: {
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,
});

export default HomeScreen;