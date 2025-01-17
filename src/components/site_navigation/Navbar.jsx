import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu } from 'lucide-react';
import Modal from './Modal';
import AuthForm from '../AuthForm';
import { useAuth } from '../../context/AuthContext';
import SearchBar from './SearchBar';


export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <nav className="bg-black p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link className={`text-white text-2xl font-bold transition-all duration-300 ${isSearchOpen ? 'hidden' : 'block'}`} to="/">
                        SPINNING MOTION
                    </Link>
                    
                    <div className="flex-grow flex items-center justify-end space-x-6">
                    {isSearchOpen && (
                            <div className="flex-grow flex items-center">
                                <SearchBar onClose={() => setIsSearchOpen(false)} />
                            </div>
                        )}
                        
                        <button 
                            className="text-white hover:text-yellow-400 focus:outline-none"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            {isSearchOpen ? <X size={24} /> : <Search size={24} />}
                        </button>
                        
                        <Link className="text-white hover:text-red-600 hidden md:block" to="/basket">
                            <ShoppingBag size={24} />
                        </Link>
                        {user ? (
                            <div className="relative">
                                <button 
                                    className="text-white hover:text-blue-600 hidden md:block focus:outline-none"
                                    onClick={toggleDropdown}
                                >
                                    <User size={24} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                className="text-white hover:text-blue-600 hidden md:block"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                <User size={24} />
                            </button>
                        )}
                    </div>

                    <div className="md:hidden ml-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 flex flex-col items-center">
                        <Link className="block text-white py-2 hover:text-red-600" to="/basket">
                            <ShoppingBag size={24} />
                            <span className="ml-2">Basket</span>
                        </Link>
                        {user ? (
                            <>
                                <Link className="block text-white py-2 hover:text-blue-600" to="/profile">
                                    <User size={24} />
                                    <span className="ml-2">Profile</span>
                                </Link>
                                <button onClick={handleLogout} className="block text-white py-2 hover:text-blue-600">
                                    <span className="ml-2">Logout</span>
                                </button>
                            </>
                        ) : (
                            <button 
                                className="block text-white py-2 hover:text-blue-600"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                <User size={24} />
                                <span className="ml-2">Login</span>
                            </button>
                        )}
                    </div>
                )}
            </nav>
            
            <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
            <AuthForm onClose={() => setIsAuthModalOpen(false)} />
            </Modal>
        </>
    );
}

    

   