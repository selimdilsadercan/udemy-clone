import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "@/lib/format";

interface Props {
  value: number;
  label: string;
  isFormatted?: boolean;
}

const DataCard = ({ value, label, isFormatted = false }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">
          {isFormatted ? format(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
