import React, { useEffect } from 'react';

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

export default function MatchDetailsModal({ isOpen, onClose, post }: MatchDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const fbLink = post.fbLink || 'https://www.facebook.com/groups/danangbadminton/posts/37195001866764864/';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm overflow-hidden transition-opacity"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100/50 text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        
        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          
          {/* Post Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img className="w-full h-full object-cover" alt={post.authorName} src={post.authorAvatar} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#050505]">
                {post.authorName}
              </h3>
              <p className="text-[13px] text-[#65676B] flex items-center gap-1">
                {post.postedTime} • <span className="material-symbols-outlined text-[14px]">public</span>
              </p>
            </div>
          </div>

          {/* Post Text */}
          <div className="text-[15px] text-[#050505] whitespace-pre-wrap leading-relaxed">
            {post.desc}
          </div>

          {/* Info Box */}
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#00A473]">location_on</span>
              <div className="text-[15px] text-[#050505]">
                <span className="font-bold">Địa điểm: </span>
                <span>{post.location}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#E02424]">schedule</span>
              <div className="text-[15px] text-[#050505]">
                <span className="font-bold">Thời gian: </span>
                <span>{post.schedule}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#65676B]">sports_tennis</span>
              <div className="text-[15px] text-[#050505]">
                <span className="font-bold">Trình độ: </span>
                <span>{post.level || 'Yếu - TB Yếu'}</span>
              </div>
            </div>
          </div>
          
          {/* FB Link Preview */}
          <a href={fbLink} target="_blank" rel="noopener noreferrer" className="bg-[#F0F2F5] hover:bg-[#E4E6EB] transition-colors rounded-lg p-3 flex items-center gap-3 w-full border border-gray-200">
            <div className="w-8 h-8 bg-[#0866FF] text-white rounded-full flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[14px] text-[#050505]">Facebook Post</h4>
            </div>
          </a>

        </div>

      </div>
    </div>
  );
}
