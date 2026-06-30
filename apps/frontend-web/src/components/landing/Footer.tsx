import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer id="about" className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-xxl gap-lg w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-sm">
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">CourtMate</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
            © 2024 CourtMate. Bản quyền thuộc về CourtMate. Nền tảng kết nối thể thao Đà Nẵng.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-xl">
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>Điều khoản sử dụng</Link>
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>Chính sách bảo mật</Link>
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>Liên hệ</Link>
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>Trung tâm trợ giúp</Link>
        </nav>
        <div className="flex gap-md">
          <Link className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>
            <span className="material-symbols-outlined">public</span>
          </Link>
          <Link className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all" to="#" onClick={(e) => { e.preventDefault(); alert('Tính năng đang phát triển'); }}>
            <span className="material-symbols-outlined">smart_display</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
