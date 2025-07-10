'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home,
  BookOpen,
  Brain,
  Trophy,
  User,
  Settings,
  LogOut,
  Heart
} from 'lucide-react';
import { theme } from '@/lib/styles';

const Nav = styled(motion.nav)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${({ $scrolled }) => 
    $scrolled ? 'rgba(10, 14, 39, 0.95)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: 1px solid ${({ $scrolled }) => 
    $scrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-decoration: none;
  
  .gradient {
    background: ${theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ $active }) => $active ? '100%' : '0'};
    height: 2px;
    background: ${theme.colors.gradient.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.gradient.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.98);
  backdrop-filter: blur(20px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/modules', label: 'Modules', icon: BookOpen },
    { href: '/practice', label: 'Practice', icon: Brain },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];
  
  return (
    <>
      <Nav
        $scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container>
          <Logo href="/">
            <Heart size={32} />
            <span className="gradient">OB Review</span>
          </Logo>
          
          <DesktopMenu>
            {navItems.map((item) => (
              <NavLink 
                key={item.href}
                href={item.href}
                $active={pathname === item.href}
              >
                {item.label}
              </NavLink>
            ))}
            
            <UserSection>
              <UserAvatar onClick={() => setShowUserDropdown(!showUserDropdown)}>
                JD
                <AnimatePresence>
                  {showUserDropdown && (
                    <UserDropdown
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownItem href="/profile">
                        <User />
                        Profile
                      </DropdownItem>
                      <DropdownItem href="/settings">
                        <Settings />
                        Settings
                      </DropdownItem>
                      <DropdownItem href="/logout">
                        <LogOut />
                        Logout
                      </DropdownItem>
                    </UserDropdown>
                  )}
                </AnimatePresence>
              </UserAvatar>
            </UserSection>
          </DesktopMenu>
          
          <MobileMenuButton onClick={() => setShowMobileMenu(true)}>
            <Menu size={24} />
          </MobileMenuButton>
        </Container>
      </Nav>
      
      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <MobileMenuHeader>
              <Logo href="/">
                <Heart size={32} />
                <span className="gradient">OB Review</span>
              </Logo>
              <button 
                onClick={() => setShowMobileMenu(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </MobileMenuHeader>
            
            <MobileMenuLinks>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <MobileNavLink 
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon />
                    {item.label}
                  </MobileNavLink>
                );
              })}
            </MobileMenuLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
}
