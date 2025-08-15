import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getAllBank } from "@/services/bankService";
import { calculatePrices, getAllTotalList } from "@/services/transactionService";
import { getAllEmployee } from "@/services/employeeService";
import EmployeeMultiSelect from "./EmployeeMultiSelect";


export default function DailyCalc() {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedTotal, setSavedTotal] = useState(null);
    const [dailyTotals, setDailyTotals] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployee();
            setEmployees(res.employees || []);
        } catch {
            toast.error("Lỗi tải nhân viên");
        }
    };
    useEffect(() => {
        (async () => {
            try {
                const res = await getAllBank();
                const raw = res?.data ?? res;
                const arr = (raw || []).map((bank) => ({
                    ...bank,
                    quantity: "",
                    price: Number(bank.bank_prices?.[0]?.price ?? 0),
                }));
                setBanks(arr);
            } catch (err) {
                toast.error("Lỗi tải danh sách ngân hàng");
                console.error(err);
            }
        })();

        fetchDailyTotals();
    }, []);

    const fetchDailyTotals = async () => {
        try {
            const res = await getAllTotalList();
            console.log("Daily totals response:", res);
            const raw = res?.data ?? res;
            setDailyTotals(raw || []);
        } catch (err) {
            toast.error("Lỗi tải bảng tổng tiền");
            console.error(err);
        }
    };

    const handleQuantityChange = (bankId, value) => {
        const q = parseFloat(value);
        setBanks((prev) =>
            prev.map((b) =>
                b.id === bankId ? { ...b, quantity: Number.isFinite(q) ? q : 0 } : b
            )
        );
    };

    const grandTotal = useMemo(() => {
        return banks.reduce((sum, b) => {
            const qty = Number(b.quantity) || 0;
            const price = Number(b.price) || 0;
            return sum + qty * price;
        }, 0);
    }, [banks]);

    const handleCalculate = async () => {
        try {
            setLoading(true);
            setSavedTotal(null);

            const payload = {
                items: banks.map((b) => ({
                    bank_id: b.id,
                    quantity: Number(b.quantity) || 0,
                })),
                employee_ids: selectedEmployees
            };

            const res = await calculatePrices(payload);
            setSavedTotal(res?.grand_total || 0);
            toast.success(res?.message || "Tính & lưu thành công");
            fetchDailyTotals();
        } catch (err) {
            toast.error(err?.error || "Lỗi khi tính & lưu");
        } finally {
            setLoading(false);
        }
    };

    const fmt = (n) =>
        n.toLocaleString("vi-VN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        });

    return (
        <>
            <h1 className="text-lg font-bold mb-6">Tính Toán Hàng Ngày</h1>

            {/* Bảng nhập và tính */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Nhập số lượng & Tính giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-xs md:text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Mã</th>
                                    <th className="border p-2 text-right">Giá</th>
                                    <th className="border p-2 text-right">Số lượng</th>
                                    <th className="border p-2 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banks.map((bank) => {
                                    const rowTotal =
                                        (Number(bank.quantity) || 0) *
                                        (Number(bank.price) || 0);
                                    return (
                                        <tr key={bank.id}>
                                            <td className="border p-2">{bank.code}</td>
                                            <td className="border p-2 text-right">
                                                {fmt(bank.price)}
                                            </td>
                                            <td className="border p-2 text-right">
                                                <Input
                                                    type="text"
                                                    value={bank.quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            bank.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-28"
                                                />
                                            </td>
                                            <td className="border p-2 text-right">
                                                {fmt(rowTotal)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td
                                        colSpan={3}
                                        className="border p-2 text-right font-semibold"
                                    >
                                        Tổng tiền
                                    </td>
                                    <td className="border p-2 text-right font-semibold">
                                        {fmt(grandTotal)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="my-6 w-80">
                        <EmployeeMultiSelect
                            employees={employees}
                            selectedEmployees={selectedEmployees}
                            setSelectedEmployees={setSelectedEmployees}
                        />
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <Button onClick={handleCalculate} disabled={loading}>
                            {loading ? "Đang xử lý..." : "Tính & Lưu"}
                        </Button>

                        {savedTotal !== null && (
                            <div className="text-green-600 font-medium">
                                Tổng đã lưu: {fmt(savedTotal)}
                            </div>
                        )}
                    </div>
                </CardContent>

            </Card>

            {/* Bảng tổng tiền các ngày */}
            <Card>
                <CardHeader>
                    <CardTitle>Bảng Tổng Tiền Các Ngày</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-xs md:text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Ngày</th>
                                    <th className="border p-2 text-right">Tổng Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyTotals.length > 0 ? (
                                    dailyTotals.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="border p-2">{item.date}</td>
                                            <td className="border p-2 text-right">
                                                {fmt(item.total_amount)} đ
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="border p-2 text-center text-gray-500"
                                        >
                                            Chưa có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
