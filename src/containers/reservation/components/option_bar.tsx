import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function OptionBar() {
  return (
    <div className="flex items-center gap-4 mb-4">
      <TabsList>
        {/* <TabsTrigger value="calendar">캘린더</TabsTrigger> */}
        <TabsTrigger value="list">리스트</TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-2 ml-auto">
        <span>
          <Input type="text"></Input>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </span>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="default">
          <Plus className="h-4 w-4" />
          새로운 예약
        </Button>
      </div>
    </div>
  );
}
