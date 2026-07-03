import React, { useRef, useState } from 'react';

export default function OrganizerSettings() {
  const [activeTab, setActiveTab] = useState<'org-info' | 'finance' | 'system-config'>('org-info');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoName, setLogoName] = useState('Chưa có logo nào được chọn');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoName(file.name);
  };

  return (
    <>
      <header className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Cài đặt Ban tổ chức</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Quản lý thông tin đơn vị, tài chính và cấu hình vận hành giải đấu của bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-3">
          <div className="flex flex-col space-y-2 bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'org-info' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`} onClick={() => setActiveTab('org-info')}>
              <span className="material-symbols-outlined">corporate_fare</span>
              <span className="text-label-md">Thông tin tổ chức</span>
            </button>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'finance' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`} onClick={() => setActiveTab('finance')}>
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className="text-label-md">Quản lý tài chính</span>
            </button>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'system-config' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`} onClick={() => setActiveTab('system-config')}>
              <span className="material-symbols-outlined">settings_applications</span>
              <span className="text-label-md">Cấu hình hệ thống</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-9 space-y-gutter">
          {activeTab === 'org-info' && (
            <section className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-lg border-b border-outline-variant/20 flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-on-surface">Thông tin tổ chức</h3>
                <button className="bg-primary text-on-primary px-lg py-2 rounded-full text-label-md font-bold transition-transform active:scale-95">Lưu thông tin</button>
              </div>
              <div className="p-lg space-y-xl">
                <div className="flex items-center gap-lg">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-lg bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant overflow-hidden">
                      <span className="material-symbols-outlined text-on-surface-variant">add_a_photo</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </div>
                  <div>
                    <p className="font-title-lg text-title-lg text-on-surface">Logo đơn vị</p>
                    <p className="text-body-sm text-on-surface-variant">Tải lên logo chính thức của tổ chức (PNG, JPG)</p>
                    <p className="text-body-sm text-primary mt-1">{logoName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-tight">Tên đơn vị tổ chức</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md" placeholder="Ví dụ: Liên đoàn Cầu lông Việt Nam" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-tight">Mã số thuế</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md" placeholder="0123456789" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-tight">Số điện thoại liên hệ</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md" placeholder="+84..." type="tel" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-tight">Địa chỉ văn phòng</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md" placeholder="Số nhà, tên đường, quận/huyện..." type="text" />
                  </div>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'finance' && (
            <section className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-lg border-b border-outline-variant/20">
                <h3 className="font-title-lg text-title-lg text-on-surface">Quản lý tài chính</h3>
              </div>
              <div className="p-lg space-y-lg">
                <div className="space-y-4">
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Tài khoản nhận tiền</h4>
                  <div className="p-md border border-outline-variant/30 rounded-lg flex items-center justify-between bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">account_balance</span>
                      <div>
                        <p className="font-medium text-on-surface">Ngân hàng Techcombank</p>
                        <p className="text-body-sm text-on-surface-variant">Số tài khoản: **** 8888</p>
                      </div>
                    </div>
                    <button className="text-primary font-bold text-label-md hover:underline">Thay đổi</button>
                  </div>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'system-config' && (
            <section className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-lg border-b border-outline-variant/20">
                <h3 className="font-title-lg text-title-lg text-on-surface">Cấu hình hệ thống</h3>
              </div>
              <div className="p-lg space-y-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Phân quyền nhân viên</h4>
                    <button className="text-primary font-bold text-label-md flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">add</span> Thêm nhân viên</button>
                  </div>
                  <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">TV</div>
                      <div>
                        <p className="font-medium text-on-surface">Trần Văn A</p>
                        <p className="text-body-sm text-on-surface-variant">Quản lý giải đấu</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
