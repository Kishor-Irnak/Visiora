import { API_BASE } from "./common";

export const fetchDashboardMetrics = async () => {
  // We can aggregate from the fetches above or use count endpoints
  // For simplicity, we'll return a structure that the dashboard expects
  // fetching counts is more efficient for just numbers
  try {
    // Fetch dashboard metrics from our backend
    const userId = localStorage.getItem('userId') || 1; // Default to user ID 1 for demo purposes
    const response = await fetch(`${API_BASE}/dashboard-metrics?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard metrics');
    }
    
    const data = await response.json();
    
    // Return the metrics from our backend
    return {
      totalOrders: data.metrics?.totalOrders || 0,
      totalProducts: data.metrics?.totalProducts || 0,
      totalSales: data.metrics?.totalSales || 0,
      ordersToFulfill: data.metrics?.ordersToFulfill || 0,
      paymentsToCapture: data.metrics?.paymentsToCapture || 0,
      sessions: data.metrics?.sessions || '0',
      conversionRate: data.metrics?.conversionRate || '0%',
      sparkline: data.sparkline || [],
    };
  } catch (e) {
    console.error(e);
    return { totalOrders: 0, totalProducts: 0 };
  }
};
