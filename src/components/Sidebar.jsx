import React, { useState } from "react"
import {
  LayoutDashboard,
  Calculator,
  DollarSign,
  Users,
  BarChart2,
  Menu,
  Landmark,
  LogOut,
  X,
} from "lucide-react"
import { Button } from "./ui/button"

export default function Sidebar({ activePage }) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { key: "overview", label: "Tổng quan", icon: BarChart2 },
    { key: "dailyCalc", label: "Tính toán hàng ngày", icon: Calculator },
    { key: "manageEmployees", label: "Quản lý nhân viên", icon: Users },
    { key: "manageBank", label: "Quản lý mã ngân hàng", icon: Landmark },
  ]

  const handleClick = (page) => {
    window.location.hash = page
    setIsOpen(false) // đóng menu khi click trên mobile
  }
 const handleLogout = () => {
    // Xóa token
    localStorage.removeItem("token")
    window.location.href = "/"
  }
  return (
    <>
      {/* Nút menu cho mobile */}
      <div className="lg:hidden p-4 border-b">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar chính */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-100 border-r p-4 space-y-4 transform transition-transform duration-300 ease-in-out z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h2 className="text-base font-bold mb-4 ">Quản Lý</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                activePage === item.key
                  ? "bg-primary text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
           <Button variant="outline" className="mt-4 w-full text-red-500" onClick={handleLogout}>Đăng xuất</Button>
      </aside>

      {/* Overlay khi mở trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
           

    </>
  )
}
