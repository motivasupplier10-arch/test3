# Admin Portal Design Guidelines

## Design Approach: Fluent Design System
Selected for data-heavy, enterprise application with focus on productivity and information density. This approach prioritizes functionality, clarity, and efficient workflows over visual flourish.

## Core Design Principles
- **Information Hierarchy**: Clear visual organization of complex data
- **Operational Efficiency**: Minimize clicks and cognitive load
- **Professional Authority**: Convey trust and competence
- **Responsive Adaptability**: Seamless experience across devices

## Color Palette

### Light Mode
- **Primary**: 220 91% 35% (Professional blue)
- **Secondary**: 220 15% 25% (Charcoal gray)
- **Background**: 0 0% 98% (Off-white)
- **Surface**: 0 0% 100% (Pure white)
- **Accent**: 142 76% 36% (Success green)
- **Warning**: 38 92% 50% (Amber)
- **Error**: 0 84% 60% (Red)

### Dark Mode
- **Primary**: 220 91% 55% (Lighter blue)
- **Secondary**: 220 15% 75% (Light gray)
- **Background**: 220 15% 8% (Dark charcoal)
- **Surface**: 220 15% 12% (Elevated dark)
- **Accent**: 142 76% 46% (Brighter green)
- **Warning**: 38 92% 60% (Brighter amber)
- **Error**: 0 84% 70% (Lighter red)

## Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono (for code/data)
- **Headers**: font-semibold to font-bold
- **Body**: font-normal to font-medium
- **Data Tables**: font-mono for numerical data

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12
- **Micro spacing**: p-2, m-2 (component internals)
- **Standard spacing**: p-4, m-4 (between elements)
- **Section spacing**: p-6, m-6 (card/panel padding)
- **Layout spacing**: p-8, m-8 (major sections)
- **Page spacing**: p-12, m-12 (page margins)

## Component Library

### Navigation
- **Sidebar**: Collapsible with icons and labels
- **Breadcrumbs**: Clear hierarchical navigation
- **Tabs**: For section switching within views

### Data Display
- **Tables**: Sortable headers, row actions, pagination
- **Cards**: Metrics summaries with clear typography
- **Charts**: Clean, accessible data visualizations
- **Status Indicators**: Color-coded badges and icons

### Forms & Controls
- **Input Fields**: Clear labels, validation states
- **Dropdowns**: Searchable for large datasets
- **Buttons**: Primary, secondary, and outline variants
- **Switches**: For settings and toggles

### Feedback & Status
- **Notifications**: Toast messages for actions
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful guidance when no data
- **Error States**: Clear messaging with recovery actions

### Real-time Elements
- **Live Data Indicators**: Subtle pulsing dots for active updates
- **Connection Status**: Clear online/offline indicators
- **Refresh Controls**: Manual refresh options

## Images
**Hero Image**: None - this is a utility-focused admin interface
**Supporting Graphics**: 
- Dashboard placeholder charts/graphs
- Empty state illustrations (simple, professional)
- User avatar placeholders
- Company/client logos in client management sections

## Layout Specifications
- **Sidebar Width**: 280px expanded, 64px collapsed
- **Content Max Width**: No constraint (full remaining width)
- **Header Height**: 64px
- **Card Border Radius**: rounded-lg (8px)
- **Input Border Radius**: rounded-md (6px)

## Responsive Behavior
- **Desktop**: Full sidebar with labels
- **Tablet**: Collapsible sidebar, maintains functionality
- **Mobile**: Bottom navigation, stacked layout

This design system emphasizes clarity, efficiency, and professional credibility while maintaining modern aesthetics appropriate for a production admin portal.