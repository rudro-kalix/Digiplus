import React from 'react';
import { X, GraduationCap, Building2, CreditCard, User } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="text-blue-500" />
            আমার সম্পর্কে
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Profile Picture Side */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-xl shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800 relative group">
                  <img 
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvmp1ZcfA5npEtjjzS_k976gyZ7bcpptTNjmgqo0JTT8y_tmk2s_HxsC3u25crT5OW2ZaulKP3xF4U5jND_iPO4iZcbX3j_iSZxuY8EZloovlaKVr_TVx760SXLZnHVyjft0JjX0y0tAEQE56u57aLFtVRqdvI0XlER8vVM8x8CfjeomSCLtk2HcWMZnJh/s1280/photo_2025-12-09_23-43-17.jpg" 
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.src = "https://ui-avatars.com/api/?name=Julkar+Nayen&background=0f172a&color=38bdf8&size=200";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">Md. Julkar Nayen</h3>
                <p className="text-blue-400 text-sm">Software Engineering Student</p>
              </div>
            </div>

            {/* Info Side */}
            <div className="flex-1 space-y-6 w-full">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4 hover:border-slate-600 transition-colors">
                <div className="flex items-start gap-3">
                  <User className="text-blue-500 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Full Name</p>
                    <p className="text-white font-medium">Md. Julkar Nayen Bin Hossain</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="text-purple-500 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">University</p>
                    <p className="text-white font-medium">Daffodil International University</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="text-green-500 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Department</p>
                    <p className="text-white font-medium">B.Sc. in Software Engineering</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-yellow-500 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Student ID</p>
                    <p className="text-white font-medium font-mono tracking-wider">252-35-584</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Image Section */}
          <div className="mt-8">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-400" />
              University ID Card
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 hover:border-slate-600 transition-all">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5qb91LaCHArbWQpnvoXChYWYTMGSnJa6ER1yZeBGFTDMs7Et-Nhy_U6r6wMF-mX-Yzs9wQ-ynPuUMXyxidr1v0VPZXY6V4VLxQJd-xFD5UZhLm8_iKi8RUpS0W4NBEnjAWoj_KliKjeXTtXVyG1II404AGB8nby4GJGdkgVy5kXvNofLxOo-OlvYO_wqB/s1080/Screenshot_20251209-234114.png" 
                alt="University ID Card"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};