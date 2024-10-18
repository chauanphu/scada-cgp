'use client'
import { Home, User, Box, Settings, HelpCircle, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import logo from '@/images/logo/logo.png'
import Image from 'next/image'

export function Navbar({ isAdmin }: { isAdmin: boolean }) {
    const router = useRouter();

    const navigateToUser = () => {
        router.push('/user');
    };

    const navigateToCluster = () => {
        router.push('/cluster');
    };

    const handleLogout = () => {
        Cookies.remove("token");
        router.push('/login');
    };

    return (
        <div className="fixed bg-white left-0 right-0 z-50 flex justify-center align-middle w-full">
            <nav className="w-full">
                <div className="flex h-14 items-center px-6">
                    {/* Logo on the left */}
                    <div className="flex-none w-16">
                        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full shadow-md" />
                    </div>

                    {/* Space between the logo and the buttons */}
                    <div className="flex-grow" />

                    {/* Button group aligned to the right */}
                    <div className="flex items-center space-x-1">
                        {isAdmin && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-9 h-9 rounded-full"
                                    onClick={navigateToUser}
                                >
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-9 h-9 rounded-full"
                                    onClick={navigateToCluster}
                                >
                                    <Box className="h-5 w-5" />
                                    <span className="sr-only">Cluster</span>
                                </Button>
                            </>
                        )}
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-full text-red-700 hover:text-red-900"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
