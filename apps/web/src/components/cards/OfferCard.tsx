import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { OfferStatus } from "@/types";

interface OfferCardProps {
  price: number;
  etaMinutes?: number;
  message?: string;
  status: OfferStatus;
  artisanName: string;
  onAccept?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

const statusLabels: Record<OfferStatus, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
  WITHDRAWN: "Retirée",
};

export function OfferCard({
  price,
  etaMinutes,
  message,
  status,
  artisanName,
  onAccept,
  onReject,
  loading,
}: OfferCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{artisanName}</CardTitle>
          <p className="mt-1 text-2xl font-bold text-primary">{price} MAD</p>
        </div>
        <Badge variant={status === "PENDING" ? "secondary" : status === "ACCEPTED" ? "success" : "outline"}>
          {statusLabels[status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {etaMinutes != null && (
          <p className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Arrivée estimée : {etaMinutes} min
          </p>
        )}
        {message && <p>{message}</p>}
      </CardContent>
      {status === "PENDING" && (onAccept || onReject) && (
        <CardFooter className="gap-2">
          {onReject && (
            <Button variant="outline" className="flex-1" onClick={onReject} disabled={loading}>
              Refuser
            </Button>
          )}
          {onAccept && (
            <Button className="flex-1" onClick={onAccept} disabled={loading}>
              Accepter
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
