import { type FC, type ReactElement, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterSortProps } from "@/types/filterSortOptions";
import { clientCategoryOptions } from "@/types/clientCategory";
import { createdDateOptions } from "@/types/createdDateFilter";
import { clientStatusOptions } from "@/types/clientStatus";

export const FilterSort: FC<FilterSortProps> = ({
  sortOptions,
  onSortChange,
  selectedSort,
}): ReactElement => {
  const currentLabel =
    sortOptions.find((opt) => opt.value === selectedSort)?.label || "Sort";
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [date, setDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Are you absolutely sure? {date ? format(date, "PPP") : "hello"}
          </SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>

        <Select onValueChange={(value) => console.log("Status:", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {clientStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => console.log("Category:", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {clientCategoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* <Select value={createdDateFilter} onValueChange={setCreatedDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder="Select Date"
              // Show formatted date when 'custom' is selected
              defaultValue={createdDateFilter}
              children={
                createdDateFilter === "custom" && date
                  ? format(date, "PPP")
                  : createdDateOptions.find(
                      (opt) => opt.value === createdDateFilter
                    )?.label
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Date</SelectLabel>
              {createdDateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {createdDateFilter === "custom" && (
          <Calendar
            className={`${date !== undefined ? "inline" : "hidden"}`}
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={(date) => date > new Date()}
          />
        )} */}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </SheetContent>
    </Sheet>
  );
};
