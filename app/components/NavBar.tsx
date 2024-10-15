'use client'
import { Search, Home, User, Box, Settings, HelpCircle, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import logo from '@/images/logo/logo.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export function Navbar({ searchTerm, setSearchTerm, isAdmin }: { searchTerm: string, setSearchTerm: (term: string) => void, isAdmin: boolean }) {

    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };


    const navigateToUser = () => {
        router.push('/user');
    };

    const navigateToCluster = () => {
        router.push('/cluster');
    };

    const handleLogout = () => {
        // Clear token from localStorage or sessionStorage
        localStorage.removeItem('auth_token');
        // Redirect to login page or home
        router.push('/login');
    };

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
            <nav className="w-11/12 md:w-3/4 lg:w-[30%] bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 rounded-full shadow-lg">
                <div className="container flex h-14 items-center justify-between px-4">
                    <div className="flex w-[7%]">
                        <Image src={logo} alt="Logo" width={100} height={100} className="rounded-full shadow-md w-[100%]" />
                    </div>
                    <form onSubmit={handleSearch} className="flex-1 mx-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-10 h-9 w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
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
                        
                        {/* Logout Button */}
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
