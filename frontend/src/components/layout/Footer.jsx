import React from 'react';
import { Github, Globe, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-8 px-6 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <div className="brand text-xl font-extrabold tracking-tighter text-blue-600 flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">WB</div> WORK Balance
                    </div>
                    <p className="text-gray-400 text-sm font-medium italic">
                        The ultimate employee leave management system.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <a href="https://github.com/sanmaaya" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="mailto:contact@workbalance.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail size={20} />
                    </a>
                </div>

                <div className="text-right">
                    <p className="text-gray-500 text-sm font-bold">Developed with ❤️ by Sanmaya</p>
                    <p className="text-gray-400 text-xs mt-1">© {currentYear} WORK Balance. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
