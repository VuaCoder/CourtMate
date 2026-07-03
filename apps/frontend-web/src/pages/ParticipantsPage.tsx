import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type ParticipantStatus = "approved" | "pending" | "rejected";

const INITIAL_PARTICIPANTS = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an.nguyen@email.com",
    tournament: "Giải Cầu Lông Đà Nẵng Open 2026",
    category: "Đơn Nam",
    level: "Khá",
    status: "approved" as ParticipantStatus,
    date: "12 Th9 2024",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "0912345678",
    email: "binh.tran@email.com",
    tournament: "Giải Cầu Lông Đà Nẵng Open 2026",
    category: "Đôi Nữ",
    level: "Trung bình",
    status: "pending" as ParticipantStatus,
    date: "13 Th9 2024",
  },
  {
    id: 3,
    name: "Lê Hoàng Tâm",
    phone: "0923456789",
    email: "tam.le@email.com",
    tournament: "Giải Cầu Lông Đà Nẵng Open 2026",
    category: "Đôi Nam",
    level: "Yếu",
    status: "rejected" as ParticipantStatus,
    date: "10 Th9 2024",
  },
  {
    id: 4,
    name: "Phạm Ngọc Mai",
    phone: "0934567890",
    email: "mai.pham@email.com",
    tournament: "Giải Cầu Lông Đôi Nam Nữ Thanh Khê",
    category: "Đôi Nam Nữ",
    level: "Trung bình",
    status: "approved" as ParticipantStatus,
    date: "14 Th9 2024",
  },
  {
    id: 5,
    name: "Vũ Quốc Bảo",
    phone: "0945678901",
    email: "bao.vu@email.com",
    tournament: "Giải Cầu Lông Đôi Nam Nữ Thanh Khê",
    category: "Đôi Nam Nữ",
    level: "Khá",
    status: "pending" as ParticipantStatus,
    date: "15 Th9 2024",
  },
];

const tabs: Array<{
  value: "all" | ParticipantStatus;
  label: string;
  className: string;
}> = [
  {
    value: "all",
    label: "Tất cả",
    className: "bg-surface-variant text-on-surface font-bold",
  },
  {
    value: "pending",
    label: "Chờ duyệt",
    className: "bg-tertiary-container text-on-tertiary-container font-bold",
  },
  {
    value: "approved",
    label: "Đã duyệt",
    className: "bg-[#e8f5e9] text-[#2e7d32] font-bold",
  },
  {
    value: "rejected",
    label: "Từ chối",
    className: "bg-error-container text-error font-bold",
  },
];

export default function ParticipantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus =
    (searchParams.get("status") as "all" | ParticipantStatus | null) || "all";
  const [activeTab, setActiveTab] = useState<"all" | ParticipantStatus>(
    initialStatus,
  );
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const [participants, setParticipants] = useState<any[]>(() => {
    const saved = localStorage.getItem("courtmate_registrations");
    if (saved) {
      return JSON.parse(saved);
    } else {
      localStorage.setItem("courtmate_registrations", JSON.stringify(INITIAL_PARTICIPANTS));
      return INITIAL_PARTICIPANTS;
    }
  });

  const { totalCount, approvedCount, pendingCount, rejectedCount } = useMemo(() => {
    const total = participants.length;
    const approved = participants.filter((p) => p.status === "approved").length;
    const pending = participants.filter((p) => p.status === "pending").length;
    const rejected = participants.filter((p) => p.status === "rejected").length;
    return { totalCount: total, approvedCount: approved, pendingCount: pending, rejectedCount: rejected };
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesTab = activeTab === "all" ? true : p.status === activeTab;
      const search = query.trim().toLowerCase();
      const matchesQuery = !search
        ? true
        : [p.name, p.phone, p.email, p.tournament, p.category]
            .join(" ")
            .toLowerCase()
            .includes(search);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, query, participants]);

  const setTab = (tab: "all" | ParticipantStatus) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === "all") next.delete("status");
    else next.set("status", tab);
    setSearchParams(next);
  };

  const onSearchChange = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    setSearchParams(next);
  };

  const handleUpdateStatus = (id: number, status: ParticipantStatus) => {
    const updated = participants.map((p) => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    setParticipants(updated);
    localStorage.setItem("courtmate_registrations", JSON.stringify(updated));
  };

  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (p: any) => {
    setSelectedParticipant(p);
    setIsDetailsOpen(true);
  };


  return (
    <>
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-xs">
          Vận động viên
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Quản lý danh sách đăng ký và trạng thái duyệt hồ sơ của các vận động
          viên.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Tổng cộng
          </span>
          <span className="font-headline-md font-bold text-on-surface">
            {totalCount}
          </span>
        </div>
        <div className="bg-[#e8f5e9] p-md rounded-xl border border-[#c8e6c9] flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-[#2e7d32] uppercase tracking-wider mb-1">
            Đã duyệt
          </span>
          <span className="font-headline-md font-bold text-[#1b5e20]">
            {approvedCount}
          </span>
        </div>
        <div className="bg-tertiary-container/30 p-md rounded-xl border border-tertiary-container flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-tertiary uppercase tracking-wider mb-1">
            Chờ duyệt
          </span>
          <span className="font-headline-md font-bold text-tertiary">
            {pendingCount}
          </span>
        </div>
        <div className="bg-error-container/30 p-md rounded-xl border border-error-container flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-error uppercase tracking-wider mb-1">
            Từ chối
          </span>
          <span className="font-headline-md font-bold text-error">
            {rejectedCount}
          </span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/40 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40">
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === tab.value ? tab.className : "text-on-surface-variant hover:bg-surface-variant/50"}`}
                onClick={() => setTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm tên, SĐT..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant focus:border-primary outline-none"
              />
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant transition-colors font-label-md shadow-sm"
              title="Xuất CSV"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container/50">
              <tr className="border-b border-outline-variant/40 text-on-surface-variant font-label-md uppercase tracking-wider text-xs">
                <th className="py-3 px-5 font-semibold w-12">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Vận động viên</th>
                <th className="py-3 px-4 font-semibold">Liên hệ</th>
                <th className="py-3 px-4 font-semibold">Giải đấu & Nội dung</th>
                <th className="py-3 px-4 font-semibold">Ngày ĐK</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface bg-surface-container-lowest">
              {filteredParticipants.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors group"
                >
                  <td className="py-4 px-5">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-on-background">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>{" "}
                        {p.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          mail
                        </span>{" "}
                        {p.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-on-surface">
                      {p.tournament}
                    </p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-surface-container text-on-surface-variant text-[11px] uppercase font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant">
                    {p.date}
                  </td>
                  <td className="py-4 px-4">
                    {p.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                        <span className="material-symbols-outlined text-[12px]">
                          check_circle
                        </span>{" "}
                        Đã duyệt
                      </span>
                    )}
                    {p.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-tertiary-container/50 text-tertiary border border-tertiary/20">
                        <span className="material-symbols-outlined text-[12px]">
                          schedule
                        </span>{" "}
                        Chờ duyệt
                      </span>
                    )}
                    {p.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-error-container/50 text-error border border-error/20">
                        <span className="material-symbols-outlined text-[12px]">
                          cancel
                        </span>{" "}
                        Từ chối
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(p.id, "approved")}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9] hover:scale-105 active:scale-95 transition-all shadow-sm"
                            title="Duyệt"
                          >
                            <span className="material-symbols-outlined text-[18px] font-bold">
                              done
                            </span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.id, "rejected")}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ffebee] text-[#c62828] hover:bg-[#ffcdd2] hover:scale-105 active:scale-95 transition-all shadow-sm"
                            title="Từ chối"
                          >
                            <span className="material-symbols-outlined text-[18px] font-bold">
                              close
                            </span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetails(p)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant hover:scale-105 active:scale-95 transition-all"
                        title="Xem chi tiết"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </button>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant hover:scale-105 active:scale-95 transition-all"
                        title="Thêm thao tác"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/40 bg-white/40 flex justify-between items-center text-sm text-on-surface-variant">
          <div>
            Hiển thị {filteredParticipants.length} trên tổng{" "}
            {participants.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold">
              1
            </button>
            <button
              className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {isDetailsOpen && selectedParticipant && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="relative w-full max-w-[500px] bg-background border border-outline-variant/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-md md:p-lg border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
                <h3 className="font-headline-sm text-[18px] leading-[28px] font-bold text-on-background">Chi tiết Vận động viên</h3>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-md md:p-lg space-y-md">
              <div className="flex items-center gap-md pb-md border-b border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[20px] shrink-0">
                  {selectedParticipant.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-lg text-[16px] leading-[24px] font-bold text-on-background truncate">{selectedParticipant.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    selectedParticipant.status === "approved"
                      ? "bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]"
                      : selectedParticipant.status === "pending"
                      ? "bg-tertiary-container/30 text-tertiary border border-tertiary/20"
                      : "bg-error-container/30 text-error border border-error/20"
                  }`}>
                    {selectedParticipant.status === "approved" ? "Đã duyệt" : selectedParticipant.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-sm text-sm text-on-surface-variant font-body-sm">
                <div className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-lowest border border-outline-variant/25">
                  <span className="material-symbols-outlined text-[20px] text-primary">call</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">Số điện thoại</p>
                    <p className="font-semibold text-on-surface mt-0.5">{selectedParticipant.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-lowest border border-outline-variant/25">
                  <span className="material-symbols-outlined text-[20px] text-primary">mail</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">Email</p>
                    <p className="font-semibold text-on-surface mt-0.5">{selectedParticipant.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-lowest border border-outline-variant/25">
                  <span className="material-symbols-outlined text-[20px] text-primary">emoji_events</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">Giải đấu tham gia</p>
                    <p className="font-semibold text-on-surface mt-0.5">{selectedParticipant.tournament}</p>
                  </div>
                </div>

                <div className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-lowest border border-outline-variant/25">
                  <span className="material-symbols-outlined text-[20px] text-primary">sports_tennis</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">Nội dung & Trình độ</p>
                    <p className="font-semibold text-on-surface mt-0.5">
                      {selectedParticipant.category} • <span className="text-secondary font-bold">{selectedParticipant.level || "Khá"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-lowest border border-outline-variant/25">
                  <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">Ngày đăng ký</p>
                    <p className="font-semibold text-on-surface mt-0.5">{selectedParticipant.date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-md bg-surface-container-lowest border-t border-outline-variant/15 flex justify-end gap-sm">
              {selectedParticipant.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedParticipant.id, "rejected");
                      setIsDetailsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg font-label-md text-sm border border-error/30 text-error hover:bg-error/10 transition-colors"
                  >
                    Từ chối đơn
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedParticipant.id, "approved");
                      setIsDetailsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg font-label-md text-sm bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
                  >
                    Duyệt đơn
                  </button>
                </>
              )}
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 rounded-lg font-label-md text-sm border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
