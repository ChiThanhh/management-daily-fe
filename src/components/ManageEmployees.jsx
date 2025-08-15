import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, MoreVertical } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  createEmployee,
  getAllEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employeeService"
import { addExpense } from "@/services/employeePriceService"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useLoading } from "@/contexts/LoadingContext"

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: "", phone: "" })
  const [isEdit, setIsEdit] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
      const { setLoading } = useLoading();

  // Dialog nhập lương
  const [salaryOpen, setSalaryOpen] = useState(false)
  const [salaryData, setSalaryData] = useState({ employee_id: null, amount: "" })

  const fetchEmployees = async () => {
    try {
        setLoading(true);
      const response = await getAllEmployee()
      setEmployees(response.employees)
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách.")
    } finally {
      setLoading(false);
    }
  }

  const handleSaveEmployee = async () => {
    if (!formData.name) return toast.warning("Vui lòng nhập tên nhân viên.")
    try {
      setLoading(true);
      if (isEdit) {
        await updateEmployee(formData.id, {
          name: formData.name,
          phone: formData.phone,
        })
        toast.success("Cập nhật nhân viên thành công!")
      } else {
        await createEmployee({
          name: formData.name,
          phone: formData.phone,
        })
        toast.success("Thêm nhân viên thành công!")
      }
      setFormData({ id: null, name: "", phone: "" })
      setOpen(false)
      fetchEmployees()
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteEmployee(deleteId)
      toast.success("Xoá nhân viên thành công!")
      setConfirmOpen(false)
      fetchEmployees()
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xoá.")
    } finally {
      setLoading(false);
    }
  }

  const handleOpenSalaryDialog = (emp) => {
    setSalaryData({
      employee_id: emp.id,
      amount: "",
    })
    setSalaryOpen(true)
  }

  const handleSaveSalary = async () => {
    if (!salaryData.amount || isNaN(salaryData.amount)) {
      return toast.warning("Vui lòng nhập số tiền hợp lệ.")
    }
    try {
      setLoading(true);
      await addExpense({
        employee_id: salaryData.employee_id,
        date: new Date().toISOString().split("T")[0],
        amount: Number(salaryData.amount),
      })
      toast.success("Thêm lương thành công!")
      setSalaryOpen(false)
      setSalaryData({ employee_id: null, amount: "" })
      fetchEmployees()
    } catch (err) {
      toast.error("Lỗi khi thêm lương.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <>
      <h1 className="text-xl font-bold mb-6">Quản Lý Nhân Viên</h1>

      {/* Tìm kiếm & Thêm nhân viên */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-500" />
          <Input placeholder="Tìm nhân viên..." className="flex-1" />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="whitespace-nowrap"
              onClick={() => {
                setIsEdit(false)
                setFormData({ id: null, name: "", phone: "" })
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Thêm Nhân Viên
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Cập Nhật" : "Thêm Mới"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <Input
                placeholder="Tên nhân viên"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEmployee}>
                {isEdit ? "Cập Nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bảng nhân viên */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Lương</th>
              <th className="px-4 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">
                  {emp.employee_expenses[0]?.amount != null
                    ? Number(emp.employee_expenses[0].amount).toLocaleString("vi-VN") + " ₫"
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  {/* Desktop buttons */}
                  <div className="hidden sm:flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                      onClick={() => handleOpenSalaryDialog(emp)}
                    >
                      Lương
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEdit(true)
                        setFormData({ id: emp.id, name: emp.name, phone: emp.phone })
                        setOpen(true)
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(emp.id)}
                    >
                      Xóa
                    </Button>
                  </div>

                  {/* Mobile dropdown */}
                  <div className="sm:hidden flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenSalaryDialog(emp)}>
                          Lương
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setIsEdit(true)
                            setFormData({ id: emp.id, name: emp.name, phone: emp.phone })
                            setOpen(true)
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(emp.id)}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog nhập lương */}
      <Dialog open={salaryOpen} onOpenChange={setSalaryOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Thêm Lương Nhân Viên</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="Số tiền"
              type="text"
              value={salaryData.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\./g, "")
                if (!isNaN(rawValue)) {
                  setSalaryData((prev) => ({
                    ...prev,
                    amount: rawValue,
                  }))
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSalaryOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSaveSalary}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xoá */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn xoá?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Hành động này không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
