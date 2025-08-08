import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Layout({ children }) {
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const authority = decodedToken.authorities[0];
                setUserRole(authority);
            } catch (error) {
                console.error("Invalid or expired token:", error);
                handleLogout();
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-6">
                            <Link href="/dashboard" legacyBehavior>
                                <a className="font-bold text-xl text-gray-800">Ticketing System</a>
                            </Link>
                            {userRole === 'ADMIN' && (
                                <>
                                    <Link href="/admin/users" legacyBehavior>
                                        <a className="text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">User Management</a>
                                    </Link>
                                    <Link href="/admin/tickets" legacyBehavior>
                                        <a className="text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">Ticket Management</a>
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
