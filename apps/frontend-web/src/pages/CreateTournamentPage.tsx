import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { API_URL } from '../config';

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  // Form states
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('badminton');
  const [limit, setLimit] = useState(32);
  const [minLevel, setMinLevel] = useState('Yếu');
  const [maxLevel, setMaxLevel] = useState('Khá');
  const [locationVal, setLocationVal] = useState('Cung Thể Thao Tiên Sơn');
  const [feeVal, setFeeVal] = useState('500.000 VNĐ / người');
  const [dateStrVal, setDateStrVal] = useState('05/07/2026');
  const [descVal, setDescVal] = useState('Giải đấu quy mô phong trào dành cho các tay vợt bán chuyên và phong trào giao lưu học hỏi.');

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
        
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
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

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên giải đấu');
      return;
    }

    const savedTournaments = localStorage.getItem('courtmate_tournaments');
    const tournaments = savedTournaments ? JSON.parse(savedTournaments) : [];

    const newTournament = {
      id: Date.now(),
      type: 'tournament',
      authorName: 'CLB Chủ sự kiện',
      authorAvatar: 'https://ui-avatars.com/api/?name=Host&background=0284c7&color=fff',
      postedTime: 'Vừa xong',
      statusText: 'Đang mở',
      title: title,
      desc: descVal,
      location: locationVal,
      dateStr: dateStrVal,
      fee: feeVal,
      limit: Number(limit) || 32,
      level: minLevel === maxLevel ? minLevel : `${minLevel} - ${maxLevel}`,
      coverImage: coverImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz74r7LMJvJsv45kuE26KsJd_vfI5mPpwNDwP0CgeEj-InDN-io7VYoVbmnivYfdxQZFu689Dv0WU6Ecy2IRGWexVqKWrRD92RQl6ENHTDOyaJq8IgCX0yLcFsmuccz03tH1gsb-BL7UgeXkRf5NhKocp3RO8VELppJzKYJxaSMYsIQRKst9N4xLzmgKhOZxhbJKTBCf_83XsTwL2qIGV3toIxWG9vaLlkwVnhUMWdj6BOw-XkhEgEmw'
    };

    tournaments.unshift(newTournament);
    localStorage.setItem('courtmate_tournaments', JSON.stringify(tournaments));
    
    // Dispatch global Toast event
    window.dispatchEvent(new CustomEvent('courtmate_toast', {
      detail: { 
        message: `Đã công khai giải đấu "${title}" thành công!`, 
        type: 'success' 
      }
    }));

    navigate('/tournaments');
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
          <p className="font-body-md text-body-md text-on-surface-variant">Thiết lập thông tin sự kiện để bắt đầu nhận đăng ký trực tuyến.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-xl relative pt-1">
          <div className="overflow-hidden h-[3px] mb-4 text-xs flex rounded-full bg-surface-variant">
            <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" style={{ width: '100%' }}></div>
          </div>
          <div className="flex justify-between font-label-md text-label-md text-primary font-bold">
            <span>Thông tin giải đấu & Điều lệ nhận đăng ký</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant p-md md:p-lg">
          <form className="space-y-xl" onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Basic Info */}
            <div className="space-y-lg">
              <h2 className="font-title-lg text-title-lg text-on-background border-b border-outline-variant pb-xs">Thông tin chung</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Tên giải đấu *</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="VD: Giải Cầu Lông Đôi Nam Nữ Hải Châu 2026" 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Môn thể thao</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                    >
                      <option value="badminton">Cầu lông</option>
                      <option value="tennis">Quần vợt</option>
                      <option value="pickleball">Pickleball</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Giới hạn số lượng (vận động viên/cặp)</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="VD: 32" 
                    type="number" 
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Trình độ tối thiểu</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      value={minLevel}
                      onChange={(e) => setMinLevel(e.target.value)}
                    >
                      <option value="Yếu">Yếu</option>
                      <option value="Trung bình yếu">Trung bình yếu</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Trung bình khá">Trung bình khá</option>
                      <option value="Khá">Khá</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Trình độ tối đa</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      value={maxLevel}
                      onChange={(e) => setMaxLevel(e.target.value)}
                    >
                      <option value="Yếu">Yếu</option>
                      <option value="Trung bình yếu">Trung bình yếu</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Trung bình khá">Trung bình khá</option>
                      <option value="Khá">Khá</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Địa điểm tổ chức *</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="VD: Sân Cầu Lông Kỳ Đồng, Đà Nẵng" 
                    type="text" 
                    value={locationVal}
                    onChange={(e) => setLocationVal(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Thời gian thi đấu (Ngày bắt đầu) *</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="VD: 15/07/2026" 
                    type="text" 
                    value={dateStrVal}
                    onChange={(e) => setDateStrVal(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Lệ phí thi đấu *</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="VD: 400.000 VNĐ / người" 
                    type="text" 
                    value={feeVal}
                    onChange={(e) => setFeeVal(e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Mô tả giải đấu & Điều lệ *</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    placeholder="Nhập luật đấu, cách thức thi đấu..." 
                    value={descVal}
                    onChange={(e) => setDescVal(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Ảnh bìa giải đấu</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors cursor-pointer group relative overflow-hidden h-48">
                  
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
                  
                  <span className="material-symbols-outlined text-display-lg text-primary mb-xs z-10" style={{ fontVariationSettings: "'FILL' 0" }}>
                    {coverImageUrl ? 'done' : 'cloud_upload'}
                  </span>
                  <span className="font-title-lg text-title-lg text-on-background z-10">
                    {coverImageUrl ? 'Thay đổi ảnh bìa' : 'Tải lên ảnh bìa'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant z-10 text-center mt-xs">
                    Kéo thả hoặc nhấp để duyệt
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="flex justify-end gap-md pt-lg border-t border-outline-variant">
              <button 
                onClick={() => navigate(-1)}
                className="px-lg py-sm rounded-lg font-label-md text-label-md text-primary border border-primary hover:bg-primary-container hover:text-on-primary-container transition-colors" 
                type="button"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handlePublish}
                className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint shadow-sm hover:shadow-md transition-all flex items-center gap-xs" 
                type="button"
              >
                Công khai
                <span className="material-symbols-outlined text-sm">publish</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
