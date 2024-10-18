'use client'
import { Home, User, Box, Settings, HelpCircle, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import logo from '@/images/logo/logo.png'
import Image from 'next/image'

export enum PermissionEnum {
    MONITOR_SYSTEM = 'GIÁM SÁT HỆ THỐNG',
    CONTROL_DEVICE = 'ĐIỀU KHIỂN THIẾT BỊ',
    REPORT = 'BÁO CÁO',
    MANAGE_USER = 'QUẢN LÝ USER',
    CONFIG_DEVICE = 'CẤU HÌNH THIẾT BỊ',
    VIEW_CHANGE_LOG = 'XEM NHẬT KÝ THAY ĐỔI'
}

export function Navbar({ permissions }: { permissions: PermissionEnum[] }) {
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove("token");
        router.push('/login');
    };

    // Define tabs with their name, URL, and accessibility based on roles
    // Người dùng, Thiết bị, Báo cáo, Nhật ký thay đổi
    const tabs = [
        {
            name: 'Người dùng',
            url: '/user',
            icon: <User className="h-5 w-5" />,
            // isAccessible: permissions.includes(PermissionEnum.MANAGE_USER),
            isAccessible: true
        },
        {
            name: 'Thiết bị',
            url: '/cluster',
            icon: <Box className="h-5 w-5" />,
            isAccessible: permissions.includes(PermissionEnum.CONFIG_DEVICE),
        },
        {
            name: 'Báo cáo',
            url: '/report',
            icon: <Settings className="h-5 w-5" />,
            isAccessible: permissions.includes(PermissionEnum.REPORT),
        },
        {
            name: 'Nhật ký thay đổi',
            url: '/changelog',
            icon: <HelpCircle className="h-5 w-5" />,
            isAccessible: permissions.includes(PermissionEnum.VIEW_CHANGE_LOG),
        }

    ];
    console.log(tabs)
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
                        {tabs.map((tab, index) => (
                            tab.isAccessible && (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="icon"
                                    className="w-9 h-9 rounded-full"
                                    onClick={() => router.push(tab.url)}
                                >
                                    {tab.icon}
                                    <span className="sr-only">{tab.name}</span>
                                </Button>
                            )
                        ))}

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
