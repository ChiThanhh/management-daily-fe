import React,{ useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EmployeeMultiSelect({ employees, selectedEmployees, setSelectedEmployees }) {
  const [open, setOpen] = useState(false)

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }
const fmt = (num) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedEmployees.length > 0
            ? `${selectedEmployees.length} nhân viên được chọn`
            : "Chọn nhân viên làm hôm nay"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandGroup>
            {employees.map((emp) => {
              const isSelected = selectedEmployees.includes(emp.id)
              return (
                <CommandItem
                  key={emp.id}
                  onSelect={() => toggleEmployee(emp.id)}
                  className="cursor-pointer text-xs md:text-sm"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {emp.name} - {fmt(emp.employee_expenses?.[0]?.amount || 0)}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
