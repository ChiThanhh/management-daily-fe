import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Overview from "@/components/Overview";
import DailyCalc from "@/components/DailyCalc";
import EmployeeExpenses from "@/components/EmployeeExpenses";
import ManageEmployees from "@/components/ManageEmployees";
import ManageBank from "@/components/ManageBank";
import Statistics from "@/components/Statistics";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [activePage, setActivePage] = useState(() => {
    return window.location.hash.replace("#", "") || "overview";
  });

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(window.location.hash.replace("#", "") || "overview");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const changePage = (page) => {
    window.location.hash = page;
  };

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={changePage} />
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === "overview" && <Overview />}
        {activePage === "dailyCalc" && <DailyCalc />}
        {activePage === "employeeExpenses" && <EmployeeExpenses />}
        {activePage === "manageEmployees" && <ManageEmployees />}
        {activePage === "manageBank" && <ManageBank />}
      </main>
    </div>
  );
}
