/**
 * Format status values for display
 * in_progress -> In Progress, not_started -> Not Started, etc.
 */
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format issue type for display
 * bug -> Bug, improvement -> Improvement
 */
export const formatType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Format date to readable string
 * 2025-12-30T00:00:00.000000Z -> 30 Dec 2025
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format date with time
 * 2025-12-30T10:30:00.000000Z -> 30 Dec 2025, 10:30
 */
export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Get color for status badge
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-orange-100 text-orange-800';
    case 'not_started':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get color for type badge
 */
export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'bug':
      return 'bg-red-100 text-red-800';
    case 'improvement':
      return 'bg-purple-100 text-purple-800';
    case 'feature':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get color for priority badge
 */
export const getPriorityColor = (priority: number): string => {
  if (priority <= 1) return 'bg-green-100 text-green-800';
  if (priority <= 2) return 'bg-blue-100 text-blue-800';
  if (priority <= 3) return 'bg-yellow-100 text-yellow-800';
  if (priority <= 4) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority: number): string => {
  switch (priority) {
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    case 4:
      return 'Urgent';
    case 5:
      return 'Critical';
    default:
      return 'Unknown';
  }
};
