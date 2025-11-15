import React from "react";
import Link from "next/link";

export const BackToSite = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="nav-group">
      <Link 
        href={appUrl} 
        target="_blank" // เปิดแท็บใหม่ (ถ้าต้องการเปิดหน้าเดิมให้ลบคำสั่งนี้ออก)
        className="nav-link"
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px 15px', 
            color: 'var(--theme-elevation-500)', 
            textDecoration: 'none',
            fontWeight: 'bold'
        }}
      >
        {/* ไอคอนลูกศรย้อนกลับ (Optional) */}
        <span style={{ marginRight: '10px' }}>⬅️</span>
        Back to Website
      </Link>
    </div>
  );
};