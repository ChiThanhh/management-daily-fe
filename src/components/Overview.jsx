import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getMonthlyIncome } from "@/services/transactionService";
import { getMonthlyExpenses } from "@/services/employeePriceService";

export default function Overview() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomeRes = await getMonthlyIncome();
      const expenseRes = await getMonthlyExpenses();

      setIncomeData(
        incomeRes.data.map(item => ({
          date: item.date.slice(5), // Lấy MM-DD
          value: Number(item.total_amount || item.total || 0),
        }))
      );

      setExpenseData(
        expenseRes.data.map(item => ({
          date: item.date.slice(5),
          value: Number(item.total_amount || item.total || 0),
        }))
      );
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", err);
    }
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">Thống kê tháng hiện tại</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 p-4">
        
        {/* Biểu đồ thu nhập */}
        <Card>
          <CardHeader>
            <CardTitle>Thu nhập hàng ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v) => `${v.toLocaleString()} đ`} />
                <Line type="monotone" dataKey="value" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>



      </div>
    </>
  );
}
