import React, { useState } from 'react';

export default function OrganizerSettings() {
  const [activeTab, setActiveTab] = useState<'org-info' | 'finance' | 'system-config'>('org-info');

  return (
    <>
      <header className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Cài đặt Ban tổ chức</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Quản lý thông tin đơn vị, tài chính và cấu hình vận hành giải đấu của bạn.</p>
      </header>
      
      {/* Bento Layout for Settings Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Tab Navigation (Desktop context) */}
        <div className="md:col-span-3">
          <div className="flex flex-col space-y-2 bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'org-info' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`}
              onClick={() => setActiveTab('org-info')}
            >
              <span className="material-symbols-outlined">corporate_fare</span>
              <span className="text-label-md">Thông tin tổ chức</span>
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'finance' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`}
              onClick={() => setActiveTab('finance')}
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className="text-label-md">Quản lý tài chính</span>
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === 'system-config' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 font-medium'}`}
              onClick={() => setActiveTab('system-config')}
            >
              <span className="material-symbols-outlined">settings_applications</span>
              <span className="text-label-md">Cấu hình hệ thống</span>
            </button>
          </div>
        </div>
        
        {/* Settings Content Panels */}
        <div className="md:col-span-9 space-y-gutter">
          {/* Profile Tab */}
          {activeTab === 'org-info' && (
            <section className="animate-in fade-in duration-500">
              <div className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="p-lg border-b border-outline-variant/20 flex items-center justify-between">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Thông tin tổ chức</h3>
                  <button className="bg-primary text-on-primary px-lg py-2 rounded-full text-label-md font-bold transition-transform active:scale-95">Lưu thông tin</button>
                </div>
                <div className="p-lg space-y-xl">
                  <div className="flex items-center gap-lg">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-lg bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-on-surface-variant">add_a_photo</span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-title-lg text-title-lg text-on-surface">Logo đơn vị</p>
                      <p className="text-body-sm text-on-surface-variant">Tải lên logo chính thức của tổ chức (PNG, JPG)</p>
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
              </div>
            </section>
          )}
          
          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <section className="animate-in fade-in duration-500">
              <div className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
                  <div className="space-y-4">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Lịch sử đối soát doanh thu</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-body-sm">
                        <thead className="border-b border-outline-variant/20">
                          <tr className="text-on-surface-variant">
                            <th className="py-3 px-2">Kỳ đối soát</th>
                            <th className="py-3 px-2">Giải đấu</th>
                            <th className="py-3 px-2">Doanh thu</th>
                            <th className="py-3 px-2">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          <tr className="hover:bg-surface-container-low">
                            <td className="py-3 px-2">15/10/2023</td>
                            <td className="py-3 px-2">Open Cup 2023</td>
                            <td className="py-3 px-2 font-bold">15.000.000đ</td>
                            <td className="py-3 px-2 text-primary">Đã thanh toán</td>
                          </tr>
                          <tr className="hover:bg-surface-container-low">
                            <td className="py-3 px-2">01/10/2023</td>
                            <td className="py-3 px-2">Junior League</td>
                            <td className="py-3 px-2 font-bold">8.500.000đ</td>
                            <td className="py-3 px-2 text-primary">Đã thanh toán</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* Security Tab */}
          {activeTab === 'system-config' && (
            <section className="animate-in fade-in duration-500">
              <div className="settings-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="p-lg border-b border-outline-variant/20">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Cấu hình hệ thống</h3>
                </div>
                <div className="p-lg space-y-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Phân quyền nhân viên</h4>
                      <button className="text-primary font-bold text-label-md flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">add</span> Thêm nhân viên</button>
                    </div>
                    <div className="space-y-2">
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
                  <div className="space-y-4">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Cài đặt Email tự động</h4>
                    <div className="space-y-md">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-primary">mail</span>
                          <div>
                            <p className="font-medium text-on-surface">Xác nhận đăng ký</p>
                            <p className="text-body-sm text-on-surface-variant">Gửi khi VĐV đăng ký giải thành công.</p>
                          </div>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input defaultChecked className="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 top-0 border-outline-variant" id="email-confirm" type="checkbox" />
                          <label className="switch-label block overflow-hidden h-6 rounded-full bg-surface-container cursor-pointer transition-all duration-300" htmlFor="email-confirm"></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-primary">schedule</span>
                          <div>
                            <p className="font-medium text-on-surface">Nhắc lịch thi đấu</p>
                            <p className="text-body-sm text-on-surface-variant">Gửi trước 24h khi trận đấu bắt đầu.</p>
                          </div>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input defaultChecked className="switch-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 top-0 border-outline-variant" id="email-remind" type="checkbox" />
                          <label className="switch-label block overflow-hidden h-6 rounded-full bg-surface-container cursor-pointer transition-all duration-300" htmlFor="email-remind"></label>
                        </div>
                      </div>
                    </div>
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
