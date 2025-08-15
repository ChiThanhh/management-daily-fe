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
  createBank,
  getAllBank,
  updateBank,
  deleteBank,
} from "@/services/bankService"
import { upsertBankPrice } from "@/services/bankPriceService"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useLoading } from "@/contexts/LoadingContext"

export default function ManageBank() {
  const { setLoading } = useLoading();

  const [banks, setBanks] = useState([])
  const [open, setOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, code: "", name: "" })
  const [isEdit, setIsEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const today = new Date().toISOString().split("T")[0]
  const [priceData, setPriceData] = useState({
    date: today,
    price: "",
    name: formData.name,
  })

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await getAllBank()
      setBanks(response.data || [])
    } catch {
      toast.error("Đã xảy ra lỗi khi tải danh sách ngân hàng.")
    } finally {
      setLoading(false);
    }
  }

  const handleSaveBank = async () => {
    if (!formData.code || !formData.name)
      return toast.warning("Vui lòng nhập đầy đủ thông tin.")

    try {
      setLoading(true);
      if (isEdit) {
        await updateBank(formData.id, {
          code: formData.code,
          name: formData.name,
        })
        toast.success("Cập nhật ngân hàng thành công!")
      } else {
        await createBank({
          code: formData.code,
          name: formData.name,
        })
        toast.success("Thêm ngân hàng thành công!")
      }
      setFormData({ id: null, code: "", name: "" })
      setOpen(false)
      fetchBanks()
    } catch {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (bank) => {
    setFormData({ id: bank.id, code: bank.code, name: bank.name })
    setIsEdit(true)
    setOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteBank(deleteId)
      toast.success("Xoá ngân hàng thành công!")
      setConfirmOpen(false)
      fetchBanks()
    } catch {
      toast.error("Đã xảy ra lỗi khi xoá.")
    } finally {
      setLoading(false);
    }
  }

  const handleChangePriceClick = (bank) => {
    const today = new Date().toISOString().split("T")[0]
    setPriceData({
      bank_id: bank.id,
      date: today,
      price: bank.price || "",
    })
    setPriceOpen(true)
  }

  const handleSavePrice = async () => {
    if (!priceData.price) return toast.warning("Vui lòng nhập giá.")

    try {
      setLoading(true);
      await upsertBankPrice(priceData)
      toast.success("Cập nhật giá thành công!")
      setPriceOpen(false)
      fetchBanks()
    } catch {
      toast.error("Không thể cập nhật giá.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBanks()
  }, [])

  return (
    <>
      <h1 className="text-lg font-bold mb-6">Quản Lý Mã Ngân Hàng</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-500" />
          <Input placeholder="Tìm ngân hàng..." className="flex-1" />
        </div>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setFormData({ id: null, code: "", name: "" })
              setIsEdit(false)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="whitespace-nowrap"
              onClick={() => {
                setIsEdit(false)
                setFormData({ id: null, code: "", name: "" })
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Thêm Ngân Hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Cập Nhật Ngân Hàng" : "Thêm Ngân Hàng Mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <Input
                placeholder="Mã ngân hàng"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
              />
              <Input
                placeholder="Tên ngân hàng"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveBank}>
                {isEdit ? "Cập Nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left text-xs md:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Mã ngân hàng</th>
              <th className="px-4 py-2">Tên ngân hàng</th>
              <th className="px-4 py-2">Giá hôm nay</th>
              <th className="px-4 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank) => (
              <tr key={bank.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{bank.code}</td>
                <td className="px-4 py-2">{bank.name}</td>
                <td className="px-4 py-2">
                  {bank.bank_prices[0]?.price != null
                    ? Number(bank.bank_prices[0].price).toLocaleString("vi-VN") + " ₫"
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  {/* Desktop buttons */}
                  <div className="hidden sm:flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                      onClick={() => handleChangePriceClick(bank)}
                    >
                      Giá
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(bank)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(bank.id)}
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
                        <DropdownMenuItem onClick={() => handleChangePriceClick(bank)}>
                          Giá
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(bank)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(bank.id)}
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

      {/* Dialog thay đổi giá */}
      <Dialog open={priceOpen} onOpenChange={setPriceOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Thay đổi giá</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              placeholder="Giá"
              type="text"
              value={priceData.price
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\./g, "")
                if (!isNaN(rawValue)) {
                  setPriceData((prev) => ({
                    ...prev,
                    price: rawValue,
                  }))
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSavePrice}>Lưu</Button>
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
