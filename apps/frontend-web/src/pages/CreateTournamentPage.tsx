import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Preview locally
      const localUrl = URL.createObjectURL(file);
      setCoverImageUrl(localUrl);

      // We will upload to the backend endpoint here
      try {
        showLoading('Đang tải ảnh lên máy chủ...');
        const formData = new FormData();
        formData.append('image', file);
        
        // This makes a call to the NestJS backend
        const res = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
          // Assume backend returns Cloudinary URL in data.url
          if (data.url) {
            setCoverImageUrl(data.url);
          }
        } else {
          console.error('Lỗi tải ảnh lên backend');
        }
      } catch (err) {
        console.error('Lỗi kết nối backend', err);
      } finally {
        hideLoading();
      }
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-sm bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-md">
          <button 
            onClick={() => navigate(-1)} 
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-sm rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="font-headline-md text-headline-md font-bold text-primary">CourtMate</div>
        </div>
        <div>
          <button onClick={() => navigate(-1)} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Hủy bỏ
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-sm">Tạo giải đấu mới</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Thiết lập thông tin sự kiện để bắt đầu nhận đăng ký.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-xl relative pt-1">
          <div className="overflow-hidden h-[3px] mb-4 text-xs flex rounded-full bg-surface-variant">
            <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" style={{ width: '25%' }}></div>
          </div>
          <div className="flex justify-between font-label-md text-label-md text-on-surface-variant">
            <span className="text-primary font-bold">1. Thông tin cơ bản</span>
            <span className="hidden sm:inline">2. Địa điểm & Thời gian</span>
            <span className="hidden md:inline">3. Điều lệ & Giải thưởng</span>
            <span className="hidden lg:inline">4. Xác nhận</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant p-md md:p-lg">
          <form className="space-y-xl" onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Basic Info */}
            <div className="space-y-lg">
              <h2 className="font-title-lg text-title-lg text-on-background border-b border-outline-variant pb-xs">Thông tin chung</h2>
              
              <div className="p-md bg-inverse-on-surface border border-surface-container-high rounded-lg flex flex-col md:flex-row md:items-center gap-md">
                <div className="flex items-center gap-sm md:w-1/3">
                  <span className="material-symbols-outlined text-primary">link</span>
                  <label className="font-label-md text-label-md text-on-surface-variant">Nhập nhanh từ link Facebook</label>
                </div>
                <div className="flex flex-1 gap-sm">
                  <input className="flex-1 bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Dán link bài viết Facebook để tự động điền thông tin" type="text" />
                  <button className="px-md py-sm rounded-lg font-label-md text-label-md bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors whitespace-nowrap" type="button">Điền tự động</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Tên giải đấu</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="VD: Giải mùa hè 2024" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Môn thể thao</label>
                  <div className="relative">
                    <select className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer" defaultValue="">
                      <option disabled value="">Chọn môn thể thao</option>
                      <option value="badminton">Cầu lông</option>
                      <option value="tennis">Quần vợt</option>
                      <option value="pickleball">Pickleball</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Giới hạn số lượng</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="VD: 32" type="number" />
                </div>
              </div>
              
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Ảnh bìa giải đấu</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors cursor-pointer group relative overflow-hidden h-64">
                  
                  {coverImageUrl ? (
                    <img src={coverImageUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" />
                  ) : (
                    <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATfQJV664zYlMMY8-LtznoviYKINeKhe1xZVELh-yiOSGqZA9D8xBJwx0C-UMJMcFflvkw4pXWYqG0iXNMqlTvBV6u_vnj3o5MkXryaRw_Qgv0ZMzgqAzZilbeDE1n3AiVNvkWOP9lh2QhP_wUFqCLGnQm5ZhqN6SUqU6OOtpSw5wP6xdq09Jd0VAjtsquisbtoqAsYgXyS6iohvJ4UUH1NIn9wzu7Hr1VuC6MwZPaK5EbvOHYANl3gw')" }}></div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={handleImageUpload}
                  />
                  
                  <span className="material-symbols-outlined text-display-lg text-primary mb-sm z-10" style={{ fontVariationSettings: "'FILL' 0" }}>
                    {coverImageUrl ? 'done' : 'cloud_upload'}
                  </span>
                  <span className="font-title-lg text-title-lg text-on-background z-10">
                    {coverImageUrl ? 'Thay đổi ảnh bìa' : 'Tải lên ảnh bìa'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant z-10 text-center mt-xs">
                    Kéo thả hoặc nhấp để duyệt<br/>Kích thước đề xuất: 1200x400px (JPG, PNG)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="flex justify-end gap-md pt-lg border-t border-outline-variant">
              <button className="px-lg py-sm rounded-lg font-label-md text-label-md text-primary border border-primary hover:bg-primary-container hover:text-on-primary-container transition-colors" type="button">
                Lưu nháp
              </button>
              <button className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint shadow-sm hover:shadow-md transition-all flex items-center gap-xs" type="button">
                Tiếp theo
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview block to demonstrate final step */}
        <div className="mt-xl flex flex-col items-center opacity-50 pointer-events-none">
          <button className="px-xl py-md rounded-lg font-title-lg text-title-lg bg-secondary text-on-secondary shadow-md transition-all flex items-center gap-sm" type="button">
            <span className="material-symbols-outlined">publish</span>
            Công khai
          </button>
          <p className="mt-2 text-center font-body-sm text-body-sm text-on-surface-variant">(Nút hành động bước cuối)</p>
        </div>
      </main>
    </div>
  );
}
