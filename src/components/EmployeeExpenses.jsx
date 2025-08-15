import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"

export default function EmployeeExpenses() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Chi Tiêu Nhân Viên</h1>
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <Input placeholder="Tìm chi tiêu..." />
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" /> Thêm Chi Tiêu
        </Button>
      </div>
      <div className="border rounded-lg p-4 text-gray-500">
        (Danh sách chi tiêu sẽ hiển thị ở đây)
      </div>
    </>
  )
}
