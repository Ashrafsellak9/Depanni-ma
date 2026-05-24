import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtisanCardProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  rating?: number;
  specialties?: string[];
  distanceKm?: number;
  hourlyRate?: number;
  badgeVerified?: boolean;
}

export function ArtisanCard({
  firstName,
  lastName,
  avatarUrl,
  rating = 0,
  specialties = [],
  distanceKm,
  hourlyRate,
  badgeVerified,
}: ArtisanCardProps) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl ?? undefined} alt={`${firstName} ${lastName}`} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">
            {firstName} {lastName}
          </CardTitle>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span>{rating.toFixed(1)}</span>
            {distanceKm != null && <span>· {distanceKm} km</span>}
          </div>
        </div>
        {badgeVerified && <Badge variant="success">Vérifié</Badge>}
      </CardHeader>
      <CardContent className="space-y-2">
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {specialties.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        )}
        {hourlyRate != null && (
          <p className="text-sm font-medium text-navy">À partir de {hourlyRate} MAD/h</p>
        )}
      </CardContent>
    </Card>
  );
}
