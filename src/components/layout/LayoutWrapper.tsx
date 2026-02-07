import Header from './Header';
import Sidebar from './Sidebar';

/**
 * LayoutWrapper Component
 * 
 * Main layout structure for all pages
 * - Includes Header (top navigation)
 * - Includes Sidebar (contextual navigation)
 * - Main content area with scroll
 * 
 * Usage:
 * <LayoutWrapper>
 *   <YourPageContent />
 * </LayoutWrapper>
 */

interface LayoutWrapperProps {
    children: React.ReactNode;
    showSidebar?: boolean;  // Option to hide sidebar on specific pages
}

export default function LayoutWrapper({
    children,
    showSidebar = true
}: LayoutWrapperProps) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header - Always visible */}
            <Header />

            {/* Main layout with optional sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Conditional */}
                {showSidebar && <Sidebar />}

                {/* Main content area */}
                <main className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="container mx-auto p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
