import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu } from 'lucide-react';
import Modal from './Modal';
import AuthForm from './AuthForm';

export default function Navbar({ user, setUser }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search submitted:", searchInputRef.current.value);
        // search submit logic will be here
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
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
                        <form 
                            onSubmit={handleSearchSubmit} 
                            className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'flex-grow' : 'w-0 overflow-hidden'}`}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search our store"
                                className={`bg-transparent text-white px-4 py-2 w-full focus:outline-none placeholder-gray-400 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <button type="submit" className="text-white px-4 py-2 focus:outline-none">
                                <Search size={20} />
                            </button>
                        </form>
                        
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
                <AuthForm setUser={setUser} onClose={() => setIsAuthModalOpen(false)} />
            </Modal>
        </>
    );
}

    

   