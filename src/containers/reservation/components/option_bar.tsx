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
import { Search, Filter } from "lucide-react";

export default function OptionBar() {
  return (
    <div className="flex items-center gap-4 mb-4">
      <TabsList>
        <TabsTrigger value="calendar">캘린더</TabsTrigger>
        <TabsTrigger value="list">리스트</TabsTrigger>
      </TabsList>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="모든 선생님" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 선생님</SelectItem>
          <SelectItem value="김상진">김상진</SelectItem>
          <SelectItem value="나원장">나원장</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          나원장
        </Badge>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          한상장
        </Badge>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          이원장
        </Badge>
        <Badge variant="secondary" className="bg-pink-100 text-pink-800">
          김상장
        </Badge>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
