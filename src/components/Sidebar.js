import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaCrown, FaTools, FaLifeRing, FaCalculator, FaVideo, FaGraduationCap, FaCalendarAlt, FaFileAlt, FaStickyNote, FaComments, FaBullhorn, FaCode, FaCog } from 'react-icons/fa';


// Navigazione base per tutti gli utenti
const baseNavigation = [
  { name: 'Dashboard', href: '/', icon: <FaHome className="text-[var(--accent-primary)]" /> },
];

// Navigazione avanzata per utenti `vip` e `admin`
const vipAdminNavigation = (userPlan) => [
  {
    name: 'MasterClass',
    icon: <FaCrown className="text-[var(--accent-primary)]" />, // Corona icon
    subMenu: [
      { 
        name: 'Webinar', 
        href: '/webinars', 
        icon: <FaVideo className="text-[var(--accent-primary)]" /> // Video icon for Webinar 
      },
      ...(userPlan === 'vip' || userPlan === 'admin'
        ? [{ 
            name: 'Harmonya Academy', 
            href: '/elearning', 
            icon: <FaGraduationCap className="text-[var(--accent-primary)]" /> // Graduation cap icon for Academy
          }]
        : []),
    ],
  },
  {
    name: 'Tools',
    icon: <FaTools className="text-[var(--accent-primary)]" />, // Tools icon
    subMenu: [
      { 
        name: 'Calendar', 
        href: '/calendar', 
        icon: <FaCalendarAlt className="text-[var(--accent-primary)]" /> // Calendar icon
      },
      ...(userPlan === 'vip' || userPlan === 'admin'
        ? [
            { 
              name: 'Documents', 
              href: '/documents', 
              icon: <FaFileAlt className="text-[var(--accent-primary)]" /> // Documents icon
            },
            { 
              name: 'Notes', 
              href: '/notes', 
              icon: <FaStickyNote className="text-[var(--accent-primary)]" /> // Notes icon
            },
          ]
        : []),
    ],
  },
  ...(userPlan === 'vip' || userPlan === 'admin'
    ? [
      {
        name: 'Simulatori',
        icon: <FaCalculator className="text-[var(--accent-primary)]" />, // Calculator icon for simulation
        subMenu: [
          { 
            name: 'Simulatore VIP e FREE', 
            href: '#', 
            icon: <FaCalculator className="text-[var(--accent-primary)]" /> // Another Calculator icon for simulation
          },
          { 
            name: 'Simulatore Manager', 
            href: '#', 
            icon: <FaCalculator className="text-[var(--accent-primary)]" /> // Same for Manager
          },
        ],
      },
      {
        name: 'Supporto',
        icon: <FaLifeRing className="text-[var(--accent-primary)]" />, // Life Ring icon for support
        subMenu: [
          { 
            name: 'Forum', 
            href: '/forum', 
            icon: <FaComments className="text-[var(--accent-primary)]" /> // Comments icon for Forum
          },
          { 
            name: 'Live Chat', 
            href: '#', 
            icon: <FaComments className="text-[var(--accent-primary)]" /> // Same icon for Live Chat
          },
        ],
        },
      ]
    : []),
];

// Navigazione amministrativa aggiuntiva
const adminNavigation = [
  { 
    name: 'Marketing', 
    href: '/marketing', 
    icon: <FaBullhorn className="text-[var(--accent-primary)]" /> // Icona di megafono per il marketing
  },
  { 
    name: 'Sviluppo', 
    href: '/development', 
    icon: <FaCode className="text-[var(--accent-primary)]" /> // Icona di codice per lo sviluppo
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <FaCog className="text-[var(--accent-primary)]" /> // Icona di ingranaggio per le impostazioni
  }
];

export default function Sidebar({ open, setOpen }) {
  const router = useRouter();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userPlan = user?.plan;
  const allowedNavigation = [
    ...baseNavigation,
    ...(userPlan ? vipAdminNavigation(userPlan) : []),
    ...(userPlan === 'admin' ? adminNavigation : []),
  ];

  const isCurrentPath = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#1D4D2B] bg-opacity-75 z-20 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#0C0C0C] shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-center h-16 bg-[#0C1A0E]">
          <Link href="/">
            <Image
              src="/NETWORKINGPLATFORM.png"
              alt="Harmonia Logo"
              width={200}
              height={120}
              objectFit="contain"
            />
          </Link>
        </div>
        <nav className="mt-5">
          {allowedNavigation.map((item) => (
            <div key={item.name}>
              <div
                className={`flex items-center px-4 py-2 text-[#A1A0A0] hover:bg-[#0C1A0E] hover:text-[#F0EDE5] cursor-pointer ${
                  isCurrentPath(item.href) ? 'bg-[#0C1A0E] text-[#F0EDE5]' : ''
                }`}
                onClick={() => (item.subMenu ? toggleMenu(item.name) : router.push(item.href))}
              >
                <div className="h-6 w-6 mr-3">
                  {item.icon}
                </div>
                {item.name}
              </div>
              {item.subMenu && openMenus[item.name] && (
                <div className="pl-6">
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`block px-4 py-2 text-[#A1A0A0] hover:bg-[#0C1A0E] hover:text-[#F0EDE5] ${
                        isCurrentPath(subItem.href) ? 'bg-[#0C1A0E] text-[#F0EDE5]' : ''
                      }`}
                    >
                      <div className="inline h-5 w-5 mr-2">
                        {subItem.icon}
                      </div>
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-[var(--neutral-grey)] hover:bg-[#0C1A0E] hover:text-[#F0EDE5]"
          >
            <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
