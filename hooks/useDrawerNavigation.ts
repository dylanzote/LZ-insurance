import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

/**
 * Hook to reliably access and toggle the drawer navigation
 * Works across all nested navigators (Stack -> Drawer -> Tabs/Stack -> Screen)
 */
export const useDrawerNavigation = () => {
  const navigation = useNavigation();
  const drawerNavRef = useRef<any>(null);

  useEffect(() => {
    // Find the drawer navigator on mount
    const findDrawer = () => {
      try {
        // Method 1: Try direct parent
        let drawer = navigation.getParent('drawer');
        if (drawer) {
          drawerNavRef.current = drawer;
          return;
        }

        // Method 2: Walk up the navigation tree
        let currentNav: any = navigation;
        let maxDepth = 10;
        let depth = 0;

        while (currentNav && depth < maxDepth) {
          try {
            const state = currentNav.getState?.();
            if (state?.type === 'drawer') {
              drawerNavRef.current = currentNav;
              return;
            }

            // Try getParent with 'drawer' type
            const parentDrawer = currentNav.getParent?.('drawer');
            if (parentDrawer) {
              drawerNavRef.current = parentDrawer;
              return;
            }

            // Move to parent
            currentNav = currentNav.getParent?.();
            depth++;
          } catch (e) {
            currentNav = currentNav?.getParent?.();
            depth++;
          }
        }
      } catch (error) {
        // Silently fail
      }
    };

    findDrawer();
  }, [navigation]);

  const toggleDrawer = () => {
    try {
      // Use cached drawer nav if available
      if (drawerNavRef.current) {
        drawerNavRef.current.dispatch(DrawerActions.toggleDrawer());
        return;
      }

      // Otherwise, try to find it again
      let drawer = navigation.getParent('drawer');
      if (drawer) {
        drawer.dispatch(DrawerActions.toggleDrawer());
        drawerNavRef.current = drawer;
        return;
      }

      // Walk up the tree
      let currentNav: any = navigation;
      for (let i = 0; i < 10; i++) {
        try {
          const state = currentNav?.getState?.();
          if (state?.type === 'drawer') {
            currentNav.dispatch(DrawerActions.toggleDrawer());
            drawerNavRef.current = currentNav;
            return;
          }
          currentNav = currentNav?.getParent?.();
        } catch (e) {
          currentNav = currentNav?.getParent?.();
        }
      }

      // Last resort: direct dispatch
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (error) {
      if (__DEV__) {
        console.warn('Could not toggle drawer:', error);
      }
    }
  };

  return { toggleDrawer };
};

