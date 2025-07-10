// Sidebar Hook
// Convenient hook for sidebar functionality

import { useSidebar as useSidebarStore } from '@/stores/sidebar.store';

export const useSidebar = () => {
  return useSidebarStore();
};

export default useSidebar;