import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Root } from './layout/Root'
import { Home } from './pages/home/Home'
import { Features } from './pages/features/Features'
import { HabitLocator } from './pages/habit-locator/HabitLocator'

const rootRoute = createRootRoute({
  component: Root,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: Features,
})

const habitLocatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/habit-locator',
  component: HabitLocator,
})

const routeTree = rootRoute.addChildren([indexRoute, featuresRoute, habitLocatorRoute])

export const router = createRouter({ routeTree }) 